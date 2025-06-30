import { ShareDataService } from './../services/share-data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { ClientApiService } from '../services/client-api.service';
import { MainService } from '../services/main.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.component.html',
  styles: [
  ]
})
export class MarqueeComponent implements OnInit, OnDestroy {

  news: string = "";
  vnews: string = "";
  pnews: string = "";


  newsPending: boolean = false;
  newsPending2: boolean = false;
  isLogin: boolean = false;
  intervalSub;
  siteName: string = environment.siteName;
  Update: any;
  newImpElements: any;
  sitewiseTicker: any;
  tickerData: any;
  currentDate: Date;

  constructor(
    // private dfService: DataFormatService,
    private userService: ClientApiService,
    private main: MainService,
    private tokenService: TokenService,
    private shareService : ShareDataService

  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
    if (this.isLogin) {
      this.main.apis$.subscribe((res) => {
        this.getticker();
        this.getNews();
      });
    }

    this.intervalSub = setInterval(() => {
      this.getticker()
    }, 60000)


    this.currentDate = new Date();


  }

  ngOnInit() {
    this.getlanguages();
  }

  ngAfterViewInit() {

  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }

  loadMarquee(){
    (<any>$('.marquee')).marquee({
      //speed in milliseconds of the marquee
      duration: 10000,
      //gap in pixels between the tickers
      gap: 0,
      //time in milliseconds before the marquee will start animating
      delayBeforeStart: 0,
      //'left' or 'right'
      direction: 'left',
      //true or false - should the marquee be duplicated to show an effect of continues flow
      duplicated: false,
      // startVisible: true

    });
  }

  getNews() {
    if (this.newsPending) {
      return;
    }
    this.newsPending = true;
    this.vnews = "";
    this.userService.getTicker().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        resp.result = resp.result.map(t => { t.ticker = atob(t.ticker); return t });
        resp.result.forEach(element => {
          this.vnews = this.vnews + " | " + element.ticker;
        });
      }
      this.newsPending = false;
    }, err => {
      this.newsPending = false;
    })
  }

  getticker() {
    if (this.newsPending2) {
      return;
    }
    this.newsPending2 = true;
    this.userService.get_ticker().subscribe((resp: any) => {
      if (!this.news) {
        setTimeout(() => {
          this.loadMarquee();
        }, 10)
      }
      this.pnews = resp.ticker.split('||');
      this.news = resp.ticker;
      this.tickerData = resp.ticker1;
      this.tickerData.forEach(element => {
        this.sitewiseTicker = element.ticker
      });
      this.newsPending2 = false;
    }, err => {
      this.newsPending2 = false;
    })
  }
  openAnnouncementPopUp(){
    $('#announcementPopUp').css('display', 'flex')
  }
  closeAnnouncementPopUp(){
    $('#announcementPopUp').css('display', 'none')
  }

  ngOnDestroy(): void {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
  }

}