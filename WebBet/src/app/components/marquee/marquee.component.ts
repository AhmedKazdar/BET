import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientApiService } from 'src/app/services/client-api.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.scss']
})
export class MarqueeComponent implements OnInit {

  news: string = "";
  vnews: string = "";

  siteName: string = environment.siteName;

  newsPending: boolean = false;
  newsPending2: boolean = false;
  isLogin: boolean = false;
  intervalSub;
  Update: any;

  constructor(
    private router: Router,
    private userService: ClientApiService,
    private main: MainService,
    private tokenService: TokenService,
    private shareService: ShareDataService,

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

  }

  ngOnInit() {
    this.getlanguages();
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
      duration: 18000,
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
    this.vnews="";
    this.userService.getTicker().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        resp.result = resp.result.map(t => { t.ticker = atob(t.ticker); return t });
        resp.result.forEach((element:any) => {
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
      // this.news = this.news + " " + resp.ticker;
      if(!this.news){
        setTimeout(()=>{
          this.loadMarquee();
        })
      }
      this.news = resp.ticker;

      this.newsPending2 = false;
    }, err => {
      this.newsPending2 = false;
    })
  }

  openAnnouncementPopUp() {
    // For hash-based routing, we need to manually construct the URL
    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}#/announcement`;
    window.open(url, '_blank', "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=850,height=650");
  }


  ngOnDestroy(): void {
      if(this.intervalSub){
        clearInterval(this.intervalSub);
      }
  }

}
