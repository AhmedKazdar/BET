import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { DataFormatsService } from '../services/data-formats.service';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import { param } from 'jquery';
import { environment } from 'src/environments/environment';
import { ClientApiService } from '../services/client-api.service';
import { MainService } from '../services/main.service';
import { RacingApiService } from '../services/racing-api.service';
import { ToastMessageService } from '../services/toast-message.service';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styles: [
  ]
})
export class HighlightsComponent implements OnInit, OnDestroy {
  siteName = environment.siteName;
  isLcRouting = environment.isLcRouting;
  isCasinoTab = environment.isCasinoTab;
  isExchangeGames = environment.isExchangeGames;
  isParlay = environment.isParlay;
  listMeetingPending: boolean = false;
  todayRaces: any = [];
  nextRaces: any = [];



  casinoList: any = [];

  sportList = [];
  sportId!: number;
  selectedSport: any;

  isLogin: boolean = false;


  sportSubscription: Subscription;

  eventCom: any;
  isAuthPending: boolean = false;
  accountInfo: any;
  Update: any;
  sportsData: any;
  sportsIdd: any;
  sportLists: any[];
  competetionTab = 'by Time';
  tourList: any;
  isparlay:any
  Parlayenable: boolean = false
  parlayOptions: any;
  GameStatus:any


  constructor(
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    private router: Router,
    private racingApi: RacingApiService,
    private apiService: ClientApiService,
    private main: MainService,
    private route: ActivatedRoute,
    private toastr: ToastMessageService,
  ) {
    this.eventCom = '/event';
    if (this.isLcRouting) {
      this.eventCom = '/fullmarket';
    }
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
    this.route.params.subscribe(params => {
      // console.log(params);
      this.selectedSport = null;
      this.sportId = params.eventTypeId;
      this.sportWise();
    })
    this.shareService.getgameStatus$.subscribe((resp) =>{
      this.GameStatus = resp
      // console.log(this.GameStatus); 
    })
  }

  ngOnInit() {
    this.getlanguages();
    // this.shareService.seletedSport.subscribe(data => {
    //   console.log(data)
    //   this.sportId = data;
    // })
    this.main.apis$.subscribe((res) => {
      this.UserDescription();
    })
    this.sportWise();
    this.GetSportsData();

    if(this.siteName=='betgame'){
      this.listMeetings('today')
    }
    this.shareService.parlayvalue$.subscribe(val =>{
      this.isparlay = val
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

  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if (data != null) {
        this.Update = data
      }
      // console.log(this.Update);

    })
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

  sportWise() {
    $('#page_loading').css('display', 'flex');
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportList = this.dfService.sportEventWise(data, 0);
        if (!this.selectedSport) {
          setTimeout(() => {
            (<any>$('#frame')).perfectScrollbar();
          }, 200);

          if (this.sportId) {
            _.forEach(this.sportList, (item: any) => {
              if (this.sportId == item.id) {
                this.selectHighlight(item, true);
              }
            });
          } else {
            this.selectHighlight(this.sportList[0], false);
          }

        } else {
          _.forEach(this.sportList, (item: any) => {
            if (this.sportId == item.id) {
              this.selectHighlight(item, false);
            }
          });
        }
      }
    });
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

    // console.log(this.accountInfo)
  }

  selectHighlight(sport: any, value: boolean) {
    this.sportId = sport.id;
    this.selectedSport = sport;
    this.toursWises(this.selectedSport)
      setTimeout(() => {
        let frame = document.querySelector('#frame');

        if (value && frame) {
          frame.scrollLeft = 0;
        }
        var g = $("#highlightLabel");
        var f = g.find("#highlightTab" + this.sportId);
        if (f && value) {
          // const frame = document.querySelector('#frame');
          frame = document.querySelector('#frame');
          // console.log(frame)
          let leftOffset = 0;
          leftOffset = f.offset().left;
          // console.log(leftOffset)
          if (frame) {
            // frame.scrollLeft = leftOffset ? leftOffset : 0;
            frame.scrollLeft = leftOffset - 5;

          }
        }
      }, 100);

    setTimeout(() => {
      $('#page_loading').css('display', 'none');
    }, 10)

  }

  competionWise(event) {
    this.competetionTab = event
    this.toursWises(this.sportsData[this.sportId])
  }
  GetSportsData() {
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportsData = data;
      }
      if (this.siteName == 'betgame') {
        setTimeout(() => {
          $('#page_loading').css('display', 'none');
        }, 300);
      } else {
          $('#page_loading').css('display', 'none');
      }
    });
  }
  toursWises(sport: any) {
    if(this.sportsData){
    this.tourList = this.dfService.toursWise(this.sportsData[sport.eventTypeId]);
    }
  }

  toggleFavourite(event: any, marketData) {

    if (this.isLogin) {
      // if (this.siteName == 'lc247' && event.isPremium && event.eventTypeId==2) {
      //   return;
      // }
      event.isMulti = !event.isMulti;
      // this.dfService.ToggleFavourite(event.eventId);
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

  listMeetings(day) {
    if (this.listMeetingPending) {
      return
    }
    this.listMeetingPending = true;
    this.todayRaces = [];
    this.racingApi.listMeetings(day, 7).subscribe((resp: any) => {
      if (resp) {
        this.todayRaces = this.dfService.getRacingFormat(resp);
        // console.log(this.todayRaces);

        if (day == "today") {
          this.nextRaces = this.dfService.getNextRacingFormat(resp);
          // console.log(this.nextRaces);
        }
      }
      $('#page_loading').css('display', 'none');
      this.listMeetingPending = false;
    }, err => {
      $('#page_loading').css('display', 'none');
      this.listMeetingPending = false;
    });
  }

  trackBySport(index: number, item: any) {
    return item.eventTypeId;
  }

  trackByEvent(index: number, item: any) {
    return item.eventId;
  }
  handleClick(gameStatus) {
    if (gameStatus.blocked) {
      this.toastr.warningMsg('this casino is blocked by upper lavel.')
      
    }
  }


  openSearchWrap() {
    let searchWrap = $("#searchWrap");
    searchWrap.fadeIn();
    (<any>$("#searchInput")).focus();
  }
  ngOnDestroy() {
    if (this.sportSubscription) {
      this.sportSubscription.unsubscribe();
    }
    this.selectedSport = null;
  }

}
