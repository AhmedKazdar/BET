import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ReportService } from 'src/app/services/report.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  fundInfo: any;
  accountInfo: any;

  transactionList = [];
  loader: boolean = false;

  pingPending: boolean = false;
  Update: any;

  constructor(
    private reportService: ReportService,
    private mainService: MainService,
    private tokenService: TokenService,
    private shareService: ShareDataService

  ) {
    this.mainService.apis$.subscribe(resp => {
      this.FundExpo();
      this.UserDescription();
      this.getLogTransaction();
    })
  }

  ngOnInit(): void {
    this.getlanguages();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      if(this.Update?.myaccount=="আমার অ্যাকাউন্ট"){
        $("#accountPopup").css('font-size', '9px');
      }else{
        $("#accountPopup").css('font-size', 'inherit');
      }

    })
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
  }


  FundExpo() {

    if (this.pingPending) {
      return;
    }
    this.pingPending = true;


    this.reportService.balance().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        this.fundInfo = resp.result[0];
      }
      this.pingPending = false;

    }, err => {
      this.pingPending = false;

    });
  }

  getLogTransaction() {
    this.loader = true;
    this.reportService.logTransaction().subscribe((resp: any) => {
      this.transactionList = resp.result.reverse();
      this.transactionList?.forEach((user)=>{
        if(user.from_to){
          user.from_to = 'Upline';
        }
      });
    });
  }


}
