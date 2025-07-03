import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ReportService } from 'src/app/services/report.service';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {

  logsData = [];


  loader: boolean = false;
  Update: any;

  constructor(
    private reportService: ReportService,
    private mainService: MainService,
    private shareService: ShareDataService

    ) {
    this.mainService.apis$.subscribe(resp => {
      this.AccountStatement();
    })
   }
  ngOnInit(): void {
    this. getlanguages();
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

  
  AccountStatement() {

    this.loader = true;

    $('#loading').css('display','block');



    this.reportService.logActivity().subscribe(
      (resp:any) => {
        this.logsData = resp.result.reverse();
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


}
