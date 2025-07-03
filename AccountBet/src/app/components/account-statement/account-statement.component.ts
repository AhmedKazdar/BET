import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ReportService } from 'src/app/services/report.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent implements OnInit {
  isToastr = environment.isToastr;
  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;

  filter = "1";
  statementsData = [];
  month;

  loader: boolean = false;
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
    // this.selectfromdate = new Date(new Date().setDate(new Date().getDate() - 7));

    this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    this.selecttodate = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(9, 0, 0));
    this.selecttotime = new Date(new Date().setHours(8, 59, 0));
    
    this.mainService.apis$.subscribe(resp => {
      this.AccountStatement();
    })
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

  selectTab(input) {
    if (input == 'today') {
      this.selectfromdate = new Date(new Date().setHours(9, 0, 0));
    } else {
      this.selectfromdate = new Date(
        new Date().setDate(new Date().getDate() - 1)
      );
    }
    this.AccountStatement();
  }

  AccountStatement() {
    this.statementsData = [];

    this.loader = true;

    $('#loading').css('display', 'block');

    let pnldates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }

    this.reportService.AccountStatement(pnldates.fromdate, pnldates.todate, this.filter).subscribe(
      (resp: any) => {
        this.statementsData = resp.result.reverse();
        this.statementsData?.forEach((user) => {
          if (user.narration.includes("Deposit") && !user.narration.includes('ETG ')) {
            user.narration = 'Deposit by Upline';
          }
          if (user.narration.includes("Withdrawal") && !user.narration.includes('ETG ')) {
            user.narration = 'Withdraw from Upline';
          }
        });
        if (this.statementsData.length == 1 && this.isToastr ) {
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



  getFromDateAndTime() {
    // return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromtime.getHours()}:${this.selectfromtime.getMinutes()}:${this.selectfromtime.getSeconds()}`;
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;

  }
  getToDateAndTime() {
    // return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttotime.getHours()}:${this.selecttotime.getMinutes()}:${this.selecttotime.getSeconds()}`;
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }


}
