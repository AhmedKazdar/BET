import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClientApiService } from '../services/client-api.service';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-virtualsports',
  templateUrl: './virtualsports.component.html',
  styleUrls: ['./virtualsports.component.scss']
})
export class VirtualsportsComponent implements OnInit ,OnDestroy {
  id: any = 0;
  eventdata: any = [];
  eventid: any;
  m: any;
  resultdata: any = [];
  updateddata: any;
  eventIdresult: any;
  Source = interval(1000);
  Subscription: Subscription;
  constructor(private userService: ClientApiService,) { 
    $('#page_loading').css('display', 'flex');
  }

  ngOnInit(): void {

    this.Subscription = this.Source.subscribe((val) => {
      this.getEventdata();
 ;
    });
       this.getResultdata()
  }

  getsportid(e: any) {
    $('#page_loading').css('display', 'flex');
    this.id = e;
    this.getEventdata();
    this.getResultdata();
  }
  getEvent(m: any) {
    this.eventid = m;
  }
  getEventdata() {

    this.userService.getEvent(this.id).subscribe((resp: any) => {
       this.eventdata=resp.data;
       this.eventIdresult=[]
      resp.data.forEach(element => {
        element.markets.forEach(data => {
          if (data.marketStatus == 'RESULTED') {
            this.eventIdresult.push(element);

            this.updateddata=element.event.eventId;
           
          }
        }
        ) 
      });
      this.eventid = this.eventid;
      $('#page_loading').css('display', 'none');
      // console.log(this.updateddata);
    });
  }
  getResultdata() {
    this.userService.getreport(this.id).subscribe((resp: any) => {
      this.resultdata = resp.data;
      this.eventid = resp.data[0].eventId;
      // console.log(this.resultdata);
      $('#page_loading').css('display', 'none');
    });
  }
  ngOnDestroy(): void {
    if (this.Subscription) {
      this.Subscription.unsubscribe();
    }
  }
}
