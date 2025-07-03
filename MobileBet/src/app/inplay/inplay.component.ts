import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataFormatsService } from '../services/data-formats.service';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-inplay',
  templateUrl: './inplay.component.html',
  styles: [
  ]
})
export class InplayComponent implements OnInit {
  siteName = environment.siteName;
  isLcRouting = environment.isLcRouting;
  isParlay = environment.isParlay;



  sportList = [];
  selectedTab: string = 'inplay';

  isLogin: boolean = false;

  sportSubscription: Subscription;

  isLoader: boolean = false;
  inplayCom: any;
  eventCom: any;
  Update: any;
  isparlay:any
  accountInfo: any;
  parlayOptions: any;
  Parlayenable: boolean = false;


  constructor(
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.inplayCom = '/running';
    this.eventCom = '/event';

    if (this.isLcRouting) {
      this.inplayCom = '/inplay';
      this.eventCom = '/fullmarket';
    }
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }

  ngOnInit() {
    this.sportWise();
    this.getlanguages();
    this.UserDescription();
    this.shareService.parlayvalue$.subscribe(val =>{
      this.isparlay = val
      // console.log( this.isparlay);
    })
    const isparlayStr = localStorage.getItem('parlayenable');

    if (isparlayStr) {
      this.isparlay = JSON.parse(isparlayStr);
      this.shareService.shareparlayvalue(this.isparlay)
    } else {
      this.isparlay = false; // Set a default value if it's not in local storage
      this.shareService.shareparlayvalue(this.isparlay)
    }
  }

  enableparlay() {
    this.isparlay = !this.isparlay;
    if (this.isparlay) {
      localStorage.setItem('parlayenable', JSON.stringify(this.isparlay));
      this.shareService.shareparlayvalue(this.isparlay)
    }
    else {
      localStorage.setItem('parlayenable', JSON.stringify(this.isparlay));
      this.shareService.shareparlayvalue(this.isparlay)
    }
  }
  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    this.parlayOptions = this.accountInfo?.parlayOption
    if (this.parlayOptions == 1) {
      this.Parlayenable = true
    }
    else {
      this.Parlayenable = false
    }
  }
  sportWise() {
    $('#page_loading').css('display', 'flex');

    if (this.sportSubscription) {
      this.sportSubscription.unsubscribe();
    }
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportList = this.dfService.InplayTodayTomorrowEventWise(data, this.selectedTab);
        // console.log(this.sportList);
        setTimeout(() => {
          $('#page_loading').css('display', 'none');
        }, 300);
        this.isLoader = true;
      }
    });
  }


  changeTab(tabType) {
    this.sportList = [];
    this.isLoader = false;
    this.selectedTab = tabType;

    if (this.selectedTab == 'result') {
      this.isLoader = true;

      return false;
    }
    $('#page_loading').css('display', 'flex');
    setTimeout(() => {
      this.sportWise();
    }, 300)
  }

  toggleFavourite(event: any , marketData) {

    if (this.isLogin) {
      event.isMulti = !event.isMulti;
      this.dfService.ToggleFavourite(marketData);
    } else {
      this.router.navigate(['/login']);
    }
  }

  checkIsMulti(marketData) {

    let isMulti = false;
    let favArray = localStorage.getItem('favourite');
    let favArrays = [];
    if (favArray) {
      favArrays = favArray.split(',');
    }

    let mktIndex = _.indexOf(favArrays, marketData);
    if (mktIndex > -1) {
      isMulti = true;
    }
    return isMulti;
  }
  trackBySport(index: number, item: any) {
    return item.eventTypeId;
  }

  trackByEvent(index: number, item: any) {
    return item.eventId;
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }


  ngOnDestroy() {
    this.sportSubscription.unsubscribe();
  }

}
