import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RacingApiService } from 'src/app/services/racing-api.service';
import * as _ from 'lodash';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-virtuals',
  templateUrl: './virtuals.component.html',
  styleUrls: ['./virtuals.component.scss']
})
export class VirtualsComponent implements OnInit {
  @ViewChild('widgetsContent', { static: false }) widgetsContent: ElementRef;
  @ViewChild('widgetsContent1', { static: false }) widgetsContent1: ElementRef;
  seletedTab: string = "today";
  racedata: Object;
  maindata: any;
  id: any = 0;
  m:any
  event:any
  Resultdata: any;
  casinoSubscription: Subscription;
  casinoSource = interval(1000);


  constructor(
    private racingApi: RacingApiService,

  ) { }

  sportListFilter = [
    { sportName: 'horse-racing', id: '0', isShow: true, selected: true },
    { sportName: 'horses-jumps', id: '2', isShow: true, selected: true },
    { sportName: 'horses-sprint', id: '1', isShow: true, selected: true },
    { sportName: 'football', id: '1', isShow: true, selected: true },
    { sportName: 'football-club', id: '1', isShow: true, selected: true },
    { sportName: 'greyhound-racing', id: '1', isShow: true, selected: true },
    { sportName: 'motor-racing', id: '1', isShow: true, selected: true }
  ];

  ngOnInit(): void {
    this.casinoSubscription = this.casinoSource.subscribe((val) => {
      this.racing();
      this.racingResult()
    });

  }

  sportsid(sportsid) {
    this.id = sportsid
    // console.log(this.id);
    this.racing();
    this.racingResult()

  }

  geteventid(eventid) {
    this.m = eventid
    // console.log(this.m);
    
  }
  geteventidResult(eventid) {
    this.event = eventid
    // console.log(this.m);
    
  }


  racing() {
    this.racingApi.getEventsDetails(this.id).subscribe((resp: any) => {
      this.racedata = resp.data
      this.m = resp.data[0].event.eventId
      // console.log(this.racedata);

    })
  }

  racingResult() {
    this.racingApi.getLatestResults(this.id).subscribe((resp: any) => {
      this.Resultdata = resp.data
      this.event = resp.data[0].eventId
      // console.log(this.Resultdata);

    })
  }

  trackByMkt(index, item) {
    return item.MarketId;
  }
  scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 200;
  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 200;
  }
  scrollLeftResult() {
    this.widgetsContent1.nativeElement.scrollLeft -= 200;
  }

  scrollRightResult() {
    this.widgetsContent1.nativeElement.scrollLeft += 200;
  }

}
