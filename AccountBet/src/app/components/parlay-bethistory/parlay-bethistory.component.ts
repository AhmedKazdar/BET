import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ReportService } from 'src/app/services/report.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-parlay-bethistory',
  templateUrl: './parlay-bethistory.component.html',
  styleUrls: ['./parlay-bethistory.component.scss']
})
export class ParlayBethistoryComponent implements OnInit {

  siteName = environment.siteName;
  isToastr = environment.isToastr;

  BETSTATUS = "1";
  stype = '';
  bets = []
  betId: number;
  srNo: any;
  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;

  loader: boolean = false;
  betstatus: any;
  bettingHistory: any = [];
  month;

  constructor(
    private reportService: ReportService,
    private mainService: MainService,
    private toastr: ToastMessageService


  ) {

  }

  ngOnInit() {
    // this.selectfromdate = new Date(new Date().setDate(new Date().getDate() - 1));
    // this.selecttodate = new Date();
    this.selectfromdate = new Date(new Date().setHours(0, 0, 0));
    this.selecttodate = new Date(new Date().setHours(23, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(0, 0, 0, 0));
    this.selecttotime = new Date(new Date().setHours(23, 59, 0, 0));

    this.mainService.apis$.subscribe(resp => {
      this.GetBetHistory();
    })
  }

  selectTab(input) {
    if (input == 'today') {
      this.selectfromdate = new Date(new Date().setHours(0, 0, 0));
    } else {
      this.selectfromdate = new Date(new Date().setDate(new Date().getDate() - 1));
    }
    this.GetBetHistory();
  }

  changeSport(stype) {
    this.stype = stype;
    this.GetBetHistory();
  }

  GetBetHistory() {
    this.bets = [];
    this.bettingHistory = [];
    this.srNo = null;
    this.loader = true;
    let STYPE = this.stype;
    $('#loading').css('display', 'block');

    let betdates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }
    this.reportService.parlayBetsHistory(betdates.fromdate, betdates.todate, this.BETSTATUS).subscribe(
      (resp: any) => {
        this.betstatus = this.BETSTATUS
        this.bettingHistory = resp.result;       
        this.bettingHistory = this.bettingHistory.map(bets => {
          if (bets.listBets) {
            switch (bets.listBets?.length) {
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
                bets['countName'] = `Multiple (${bets.listBets?.length})`;
            }
          }
          return bets;
        });
                
        if (this.bettingHistory.length == 0 && this.isToastr) {
          this.toastr.warningMsg('There are no data to be displayed. ')
        }
        this.loader = false;
        $('#loading').css('display', 'none');
   

      },


    );
  }

  getFromDateAndTime() {
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;

  }
  getToDateAndTime() {
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }

  toggleDetail(srNo) {
    this.srNo = srNo;
  }

  getBetType(bet) {
    let betType = "";
    if (bet.type == "Lagai(B)") {
      betType = 'back';
      bet.betType = 'back';

    } else {
      betType = 'lay';
      bet.betType = 'lay';
    }
    return betType;
  }

  toggleTx(betId) {
    this.betId = betId;

  }


}
