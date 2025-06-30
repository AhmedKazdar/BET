import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ReportService } from 'src/app/services/report.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bet-history',
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.scss']
})
export class BetHistoryComponent implements OnInit {
  isToastr = environment.isToastr;
  BETSTATUS = "1";
  stype = '';
  bets = []
  betId: number;

  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;

  loader: boolean = false;
  betstatus: any;
  month;
  Update: any;
  constructor(
    private reportService: ReportService,
    private mainService: MainService,
    private shareService: ShareDataService,
    private toastr: ToastMessageService
    ) { 
      this.month = new Date(new Date().setDate(new Date().getDate() - 30));
  }

  ngOnInit() {
    // this.selectfromdate = new Date(new Date().setDate(new Date().getDate() - 1));
    // this.selecttodate = new Date();
    this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    this.selecttodate = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(9, 0, 0));
    this.selecttotime = new Date(new Date().setHours(8, 59, 0));

    this.mainService.apis$.subscribe(resp => {
      this.GetBetHistory();
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

  selectTab(input) {
    if(input=='today'){
      this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    }else{
      this.selectfromdate = new Date(new Date().setDate(new Date().getDate() - 1));
    }
    this.GetBetHistory();
  }

  changeSport(stype) {
    this.stype=stype;
    this.GetBetHistory();
  }

  GetBetHistory() {

    this.bets = [];

    this.loader = true;
    let STYPE = this.stype;
    $('#loading').css('display', 'block');

    let betdates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }
    this.reportService.BetHistory(betdates.fromdate, betdates.todate, this.BETSTATUS).subscribe(
      (resp: any) => {

        // this.bets = resp.result.reverse();
        this.betstatus = this.BETSTATUS
        if (this.stype == '') {
          this.bets = resp.result.reverse();
        } else if (this.stype == '0') {
          this.bets = resp.result
            .filter((bet) => bet.sportName.indexOf('Virtual ') == -1 && bet.sportName.indexOf('Live Casino') == -1 && bet.marketName != 'Bookmaker' && bet.marketName != bet.selName)
            .reverse();
        } else if (this.stype == '1') {
          this.bets = resp.result
            .filter((bet) => bet.sportName === 'cricket')
            .reverse();
        } else if (this.stype == '2') {
          this.bets = resp.result
            .filter((bet) => bet.sportName === 'tennis')
            .reverse();
        } else if (this.stype == '3') {
          this.bets = resp.result
            .filter((bet) => bet.sportName === 'soccer')
            .reverse();
        } else if (this.stype == '4') {
          this.bets = resp.result
            .filter((bet) => bet.sportName === 'Horse Racing')
            .reverse();
        } else if (this.stype == '5') {
          this.bets = resp.result
            .filter((bet) => bet.sportName === 'GreyHound Racing')
            .reverse();
        } else if (this.stype == '6') {
          this.bets = resp.result
            .filter((bet) => bet.marketName == bet.selName)
            .reverse();
        } else if (this.stype == '7') {
          this.bets = resp.result
            .filter((bet) => bet.marketName == 'Bookmaker')
            .reverse();
        } else if (this.stype == '8') {
          this.bets = resp.result
            .filter((bet) => bet.sportName == "Live Casino")
            .reverse();
        } else {
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
          this.toastr.errorMsg("Error Occured");
        }
      }
    );
  }

  getFromDateAndTime() {
    // return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromtime.getHours()}:${this.selectfromtime.getMinutes()}:${this.selectfromtime.getSeconds()}`;
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;

  }
  getToDateAndTime() {
    // return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttotime.getHours()}:${this.selecttotime.getMinutes()}:${this.selecttotime.getSeconds()}`;
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
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



