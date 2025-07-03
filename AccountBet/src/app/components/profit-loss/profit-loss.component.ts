import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ReportService } from 'src/app/services/report.service';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss'],
})
export class ProfitLossComponent implements OnInit {
  isToastr = environment.isToastr;
  userInfo: any;

  ProfitLoss = [];
  totalPnl = 0;
  srNo: any;
  stype = '';

  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;

  loader: boolean = false;
  month;
  Update: any;
  constructor(
    private reportService: ReportService,
    private mainService: MainService,
    private tokenService: TokenService,
    private shareService: ShareDataService,
    private toastr: ToastMessageService
  ) {
    this.month = new Date(new Date().setDate(new Date().getDate() - 30));
  }

  ngOnInit() {
    // this.selectfromdate = new Date(
    //   new Date().setDate(new Date().getDate() - 1)
    // );
    // this.selecttodate = new Date();
    this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    this.selecttodate = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(9, 0, 0));
    this.selecttotime = new Date(new Date().setHours(8, 59, 0));
    this.mainService.apis$.subscribe((resp) => {
      this.UserDescription();
      this.GetProfitLoss();
    });
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

  UserDescription() {
    this.userInfo = this.tokenService.getUserInfo();
  }

  selectTab(input) {
    if (input == 'today') {
      this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    } else {
      this.selectfromdate = new Date(
        new Date().setDate(new Date().getDate() - 1)
      );
    }
    this.GetProfitLoss();
  }

  changeSport(stype) {
    this.stype = stype;
    this.GetProfitLoss();
  }

  GetProfitLoss() {
    this.ProfitLoss = [];
    this.srNo = null;
    this.totalPnl=0;
    this.loader = true;
    $('#loading').css('display', 'block');

    let pnldates = {
      fromdate: this.getFromDateAndTime(),
      todate: this.getToDateAndTime(),
    };

    this.reportService.ProfitLoss(pnldates.fromdate, pnldates.todate).subscribe(
      (resp: any) => {
        // this.ProfitLoss = resp.result.reverse();
        if (this.stype == '') {
          this.ProfitLoss = resp.result.reverse();
        } else if (this.stype == '0') {
          this.ProfitLoss = resp.result
            .filter((pnl) => pnl.marketId ? pnl.marketId.indexOf('_') == -1 : '')
            .reverse();
        } else if (this.stype == '1') {
          this.ProfitLoss = resp.result
            .filter((pnl) => pnl.sportName === 'cricket')
            .reverse();
        } else if (this.stype == '2') {
          this.ProfitLoss = resp.result
            .filter((pnl) => pnl.sportName === 'tennis')
            .reverse();
        } else if (this.stype == '3') {
          this.ProfitLoss = resp.result
            .filter((pnl) => pnl.sportName === 'soccer')
            .reverse();
        } else if (this.stype == '4') {
          this.ProfitLoss = resp.result
            .filter((pnl) => pnl.sportName === 'Horse Racing')
            .reverse();
        } else if (this.stype == '5') {
          this.ProfitLoss = resp.result
            .filter((pnl) => pnl.sportName === 'GreyHound Racing')
            .reverse();
        } else if (this.stype == '6') {
          this.ProfitLoss = resp.result
            .filter((pnl) => pnl.marketId ? pnl.marketId.indexOf('df_') > -1 : '')
            .reverse();
        } else if (this.stype == '7') {
          this.ProfitLoss = resp.result
            .filter((pnl) => pnl.marketId ? pnl.marketId.indexOf('bm_') > -1 : '')
            .reverse();
        } else if (this.stype == '8') {
          this.ProfitLoss = resp.result
            .filter((pnl) => !pnl.marketId)
            .reverse();
        } else {
          this.ProfitLoss = [];
        }
        if (this.ProfitLoss.length == 0 && this.isToastr) {
          this.toastr.warningMsg('There are no data to be displayed. ')
        }

        _.forEach(this.ProfitLoss, (market) => {
          this.totalPnl = this.totalPnl + market.PL;
          market['totalStakes'] = 0;
          market['backTotal'] = 0;
          market['layTotal'] = 0;
          market['mktPnl'] = 0;

          _.forEach(market.bets, (bet) => {
            market.totalStakes += +bet.stake;
            if (bet.betType === 'back' || bet.betType === 'yes') {
              market.backTotal += +bet.pl;
            } else if (bet.betType === 'lay' || bet.betType === 'no') {
              market.layTotal += +bet.pl;
            }
            market.mktPnl += +bet.pl;
          });
          // this.totalComm = this.totalComm + element.commission;
          // this.eventName = this.bets + element.eventName
        });
        // this.totalPnl = resp.total;

        console.log(this.ProfitLoss)
        this.loader = false;
        $('#loading').css('display', 'none');
      },
      (err) => {
        if (err.status == 401) {
          //this.toastr.error("Error Occured");
        }
      }
    );
  }

  toggleDetail(srNo) {
    this.srNo = srNo;
  }

  getFromDateAndTime() {
    // return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromtime.getHours()}:${this.selectfromtime.getMinutes()}:${this.selectfromtime.getSeconds()}`;
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1
      }-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;
  }
  getToDateAndTime() {
    // return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttotime.getHours()}:${this.selecttotime.getMinutes()}:${this.selecttotime.getSeconds()}`;
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1
      }-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }

  getBetType(bet) {
    let betType = '';
    if (bet.type == 'back' || bet.type == 'yes') {
      betType = 'back';
    } else {
      betType = 'lay';
    }
    return betType;
  }
}
