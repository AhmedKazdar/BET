import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ReportService } from 'src/app/services/report.service';
import * as _ from 'lodash';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-current-bets',
  templateUrl: './current-bets.component.html',
  styleUrls: ['./current-bets.component.scss']
})
export class CurrentBetsComponent implements OnInit {
  isToastr = environment.isToastr;
  bets = []
  betId: number;
  stype = '';

  loader: boolean = false;

  betStatus: string = "";
  orderBetPlaced: boolean = true;
  orderMarket: boolean = false;
  Update: any;
  Parlayenable: boolean = false
  parlayOptions: any;


  constructor(
    private reportService: ReportService,
    private mainService: MainService,
    private shareService: ShareDataService,
    private toastr: ToastMessageService,
    private tokenService: TokenService

  ) {

  }

  ngOnInit() {
    this.mainService.apis$.subscribe(resp => {
      this.GetCurrentBets();
      let accountInfo = this.tokenService.getUserInfo();
      if (this.parlayOptions == 1) {
        this.Parlayenable = true
      }
      else {
        this.Parlayenable = false
      }
    })
    this.getlanguages();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      if (this.Update?.myaccount == "আমার অ্যাকাউন্ট") {
        $("#accountPopup").css('font-size', '9px');
      } else {
        $("#accountPopup").css('font-size', 'inherit');
      }

    })
  }


  selectTab(stype) {
    this.stype = stype;
    this.GetCurrentBets();
  }

  changeBetStatus() {
    this.GetCurrentBets();
  }
  changeStatus(event) {
    if (this.orderBetPlaced) {
      this.orderBetPlaced = false;
      this.orderMarket = true;
      this.bets = _.orderBy(this.bets, ['marketName'], ['asc']);
    } else {
      this.orderBetPlaced = true;
      this.orderMarket = false;
      this.bets = _.orderBy(this.bets, ['betTime'], ['desc']);
    }
  }

  changeSport(stype) {
    this.stype = stype;
    this.GetCurrentBets();
  }
  GetCurrentBets() {

    this.loader = true;
    $('#loading').css('display', 'block');

    this.reportService.currentBets().subscribe(
      (resp: any) => {

        this.bets = resp.result;
        this.bets = this.bets.map(bets => {
          if (bets.details) {
            switch (bets.details?.length) {
              case 1:
                bets['countName'] = 'Single';
                break;
              case 2:
                bets['countName'] = 'Double';
                break;
              case 3:
                bets['countName'] = 'Triple';
                break;
              case 4:
                bets['countName'] = 'Quadruple';
                break;
              case 5:
                bets['countName'] = 'Quintuple';
                break;
              case 6:
                bets['countName'] = 'Sextuple';
                break;
              case 7:
                bets['countName'] = 'Septuple';
                break;
              case 8:
                bets['countName'] = 'Octuple';
                break;
              case 9:
                bets['countName'] = 'Nonuple';
                break;
              case 10:
                bets['countName'] = 'Decuple';
                break;
              default:
                bets['countName'] = `Multiple (${bets.details?.length})`;
            }
          }
          return bets;
        });
        if (this.stype == '') {
          this.bets = resp.result.reverse();
        } else if (this.stype == '0') {
          this.bets = resp.result.filter((bet) => bet.sportName.indexOf('Virtual ') == -1 && bet.sportName.indexOf('Live Casino') == -1 && bet.marketName != 'Bookmaker' && bet.marketName != bet.selName).reverse();
        } else if (this.stype == '1') {
          this.bets = resp.result.filter((bet) => bet.sportName === 'cricket').reverse();
        } else if (this.stype == '2') {
          this.bets = resp.result.filter((bet) => bet.sportName === 'tennis').reverse();
        } else if (this.stype == '3') {
          this.bets = resp.result.filter((bet) => bet.sportName === 'soccer').reverse();
        } else if (this.stype == '4') {
          this.bets = resp.result.filter((bet) => bet.sportName === 'Horse Racing').reverse();
        } else if (this.stype == '5') {
          this.bets = resp.result.filter((bet) => bet.sportName === 'GreyHound Racing').reverse();
        } else if (this.stype == '6') {
          this.bets = resp.result.filter((bet) => bet.marketName == bet.selName).reverse();
        } else if (this.stype == '7') {
          this.bets = resp.result.filter((bet) => bet.marketName == 'Bookmaker').reverse();
        } else if (this.stype == '8') {
          this.bets = resp.result.filter((bet) => bet.sportName == "Live Casino").reverse();
        }else if (this.stype == '9') {
          this.bets = resp.result.filter((bet) => bet.betType == "parlay").reverse();
        } 
        else {
          this.bets = [];
        }
        if (this.bets.length == 0 && this.isToastr) {
          this.toastr.warningMsg('There are no data to be displayed. ')
        }


        this.loader = false;
        $('#loading').css('display', 'none');
      },
      err => {
        if (err.status == 401) {
          //this.toastr.error("Error Occured");
        }
      }
    );
  }



  toggleTx(betId) {
    this.betId = betId;

  }

}

