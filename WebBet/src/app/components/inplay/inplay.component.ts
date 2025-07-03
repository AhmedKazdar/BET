import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-inplay',
  templateUrl: './inplay.component.html',
  styleUrls: ['./inplay.component.scss']
})
export class InplayComponent implements OnInit {
  siteName: string = environment.siteName;


  sportListFilter = [
    { sportName: 'Cricket', eventTypeId: '4', isShow: true, selected: true },
    { sportName: 'Tennis', eventTypeId: '2', isShow: true, selected: true },
    { sportName: 'Soccer', eventTypeId: '1', isShow: true, selected: true }
  ];

  selectedAll: boolean = true;

  sportList = [];
  selectedTab: string = 'inplay';

  isLogin: boolean = false;
  isLoader:boolean=false

  sportSubscription: Subscription;
  Update: any;


  constructor(
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }

  ngOnInit() {
    this.sportWise();
    this.getlanguages();
  }

  changeTab(tabType) {
    this.sportList=[];
    this.isLoader=false;
    this.selectedTab = tabType;
    $('#page_loading').css('display', 'block');
    setTimeout(()=>{
      this.sportWise();
    },300)
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }

  sportWise() {
    $('#page_loading').css('display', 'block');

    if (this.sportSubscription) {
      this.sportSubscription.unsubscribe();
    }
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportList = this.dfService.InplayTodayTomorrowEventWise(data, this.selectedTab);
        console.log(this.sportList,"sport list");
        $('#page_loading').css('display', 'none');
        this.sportListIsShow();

        this.isLoader=true;
      }
    });
  }

  sportListIsShow() {
    if (this.selectedTab != 'inplay') {
      _.forEach(this.sportList, (element) => {
        _.forEach(this.sportListFilter, (element2) => {
          if (element.eventTypeId == element2.eventTypeId) {
            element['isShow'] = element2.isShow;
          }
        });
      });
    }
  }

  openFilter() {
    $('#sportFilterContainer').fadeIn();
    $('#sportFilterPopup').css('display', 'none');
    $('#sportFilterclosePopup').css('display', 'block');

  }

  closeFilter(value) {
    $('#sportFilterContainer').fadeOut();
    $('#sportFilterPopup').css('display', 'block');
    $('#sportFilterclosePopup').css('display', 'none');

    if (value == 'save') {
      for (var i = 0; i < this.sportListFilter.length; i++) {
        this.sportListFilter[i].isShow = this.sportListFilter[i].selected;
      }
    }
    else {
      for (var i = 0; i < this.sportListFilter.length; i++) {
        this.sportListFilter[i].selected = this.sportListFilter[i].isShow;
      }
    }
    // console.log(this.sportListFilter);

    this.sportListIsShow();

  }

  checkAll() {
    // console.log(this.selectedAll)
    for (var i = 0; i < this.sportListFilter.length; i++) {
      this.sportListFilter[i].selected = this.selectedAll;
    }
    // console.log(this.sportListFilter);
  }


  toggleFavourite(event: any, marketData) {
    console.log(event);
console.log(marketData,"market data")
    if (this.isLogin) {
      event.isMulti = !event.isMulti;
      // console.log(event.isMulti,"is multi")
      this.dfService.ToggleFavourite(marketData);
    } else {
    }
  }

  checkIsMulti(marketData) {

    let isMulti=false;
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


  ngOnDestroy() {
    this.sportSubscription.unsubscribe();
  }

}
