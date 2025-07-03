import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-dw-requests',
  templateUrl: './dw-requests.component.html',
  styleUrls: ['./dw-requests.component.scss']
})
export class DwRequestsComponent implements OnInit {

  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;
  todaysDate: Date;
  requestsData = [];
  currentUser:any;
  month;
  loader: boolean = false;
  imgURL:any='';
  selectedType: string = '0';
  selectedStatus: string = '5';
  transactionType =[
    { id: 0, name: 'All'},
    { id: 1, name: 'Deposit'},
    { id: 2, name: 'Withdraw'},
  ];
  transactionStatus =[
    { id: 5, name: 'All'},
    { id: 0, name: 'Pending'},
    { id: 1, name: 'Approved'},
    { id: 2, name: 'Rejected'},
  ];
  Update: any;

  constructor(
    private reportService: ReportService,
    private tokenService:TokenService,
    private shareService: ShareDataService
  ) { 
    this.month = new Date(new Date().setDate(new Date().getDate() - 30));
    this.todaysDate = new Date();
  }

  ngOnInit(): void {
    this.selectfromdate = new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(9, 0, 0));
    this.selecttodate = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(9, 0, 0));
    this.selecttotime = new Date(new Date().setHours(8, 59, 0));
    this.currentUser = this.tokenService.getUserInfo();
    this.getRequests('0','5');
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

  getRequests(type:any,status:any){
    this.requestsData = [];

    this.loader = true;

    $('#loading').css('display','block');

    let pnldates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }

    this.reportService.getRequests(this.currentUser.userId,status,type,pnldates.fromdate,pnldates.todate).subscribe(
      (resp:any) => {
        this.requestsData = resp.data;
        this.loader = false;
        $('#loading').css('display','none');
      },
      err => {
        if (err.status == 401) {
          //this.toastr.error("Error Occured");
        }
      }
    );
  }

  selectTransactionType(type:any){
    console.log(type);
    this.selectedType = type;
  }

  selectTransactionStatus(status:any){
    console.log(status);
    this.selectedStatus = status;
  }

  showSS(img:any){
    this.imgURL = `https://sc.cricbuzzer.io/${img}`;
    $("#bigSS").fadeIn();
  }

  closeSS(){
    $("#bigSS").fadeOut();
  }


  getFromDateAndTime() {
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;

  }
  getToDateAndTime() {
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }

}
