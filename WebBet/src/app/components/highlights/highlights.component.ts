import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { MainService } from 'src/app/services/main.service';
import { RacingApiService } from 'src/app/services/racing-api.service';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class HighlightsComponent implements OnInit {

  siteName: string = environment.siteName;

  sportList: any = [];
  eventTypeId!: number;

  isAllSport: boolean = false;

  isLogin: boolean = false;

  sportSubscription!: Subscription;
  casinoListlist:any=[]
  casinoList:any=[]
  casinoLists:any=[]
  Update: any;
  selectedSport: any;
  sportId!: number;
  sportsData: any;
  tourList: any;
  listMeetingPending: boolean = false;
  todayRaces: any = [];
  nextRaces: any = [];
  accountInfo: any;
  competetionTab = 'by Time';
  selectedOption: string = 'openDateTime';

  constructor(
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private main: MainService,
    private racingApi: RacingApiService,
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

    this.casinoListlist = [





      { "tableName": "Live Teenpatti", "CasinoName": "LiveTP", "opentable": 56767 },
      { "tableName": "Andar Bahar", "CasinoName": "Andar-Bahar", "opentable": 87564 },
     { "tableName": "Poker", "CasinoName": "Poker1Day", "opentable": 67564 },
     { "tableName": "7 up & Down", "CasinoName": "7Up-Down", "opentable": 98789 },
     { "tableName": "Roulette", "CasinoName": "Roulette", "opentable": 98788 },
     { "tableName": "Sicbo", "CasinoName": "Sicbo", "opentable": 98566 },
     { "tableName": "32 cards casino", "CasinoName": "32Cards", "opentable": 56967 },
     { "tableName": "Hi Low", "CasinoName": "Hi-Low", "opentable": 56968 },
     { "tableName": "Worli Matka", "CasinoName": "Matka", "opentable": 92037 },
     { "tableName": "Baccarat", "CasinoName": "Baccarat", "opentable": 92038 },
     { "tableName": "Six player poker", "CasinoName": "Poker6P", "opentable": 67565 },
     { "tableName": "Teenpatti T20", "CasinoName": "TP T20", "opentable": 56768 },
     { "tableName": "Amar Akbar Anthony", "CasinoName": "AAA", "opentable": 98791 },
      { "tableName": "Dragon Tiger", "CasinoName": "Dragon-Tiger", "opentable": 98790 },
     { "tableName": "Race 20-20", "CasinoName": "Race 20-20", "opentable": 90100 },
     { "tableName": "Bollywood Casino", "CasinoName": "Bollywood", "opentable": 67570 },
     { "tableName": "Casino Meter", "CasinoName": "Casino Meter", "opentable": 67575 },
     { "tableName": "Casino War", "CasinoName": "Casino War", "opentable": 67580 },
     { "tableName": "Poker 20-20", "CasinoName": "Poker2020", "opentable": 67567 },
     { "tableName": "Muflis Teenpatti", "CasinoName": "MuflisTP", "opentable": 67600 },
     { "tableName": "Trio", "CasinoName": "MuflisTP", "opentable": 67610 },
     { "tableName": "2 Cards Teenpatti", "CasinoName": "2CardTP", "opentable": 67660 },
     { "tableName": "The Trap", "CasinoName": "Trap", "opentable": 67680 },
     { "tableName": "Teenpatti Test", "CasinoName": "TPTest", "opentable": 67630 },
     { "tableName": "Queen", "CasinoName": "Queen", "opentable": 67620 },
     { "tableName": "Teenpatti Open", "CasinoName": "Race to 17", "opentable": 67640 },
     { "tableName": "29 Card Baccarat", "CasinoName": "29 Card Baccarat", "opentable": 67690 },
     { "tableName": "Race to 17", "CasinoName": "Race to 17", "opentable": 67710 },














     { "tableName": "Six player poker (Virtual)", "CasinoName": "Poker6P (V)", "opentable": 67566 },
     { "tableName": "Teenpatti One-Day (Virtual)", "CasinoName": "TPOneDay (V)", "opentable": 56766 },
     { "tableName": "Andar Bahar (Virtual)", "CasinoName": "AB (V)", "opentable": 87565 },
     { "tableName": "Teenpatti T20 (Virtual)", "CasinoName": "TP T20 (V)", "opentable": 56769 },
     { "tableName": "Hi Low (Virtual)", "CasinoName": "High-Low (V)", "opentable": 56969 },
     { "tableName": "Poker  (Virtual)", "CasinoName": "Poker (V)", "opentable": 67563 },
     { "tableName": "Matka (Virtual)", "CasinoName": "Mataka (V)", "opentable": 92036 },
     { "tableName": "7 up & Down (Virtual)", "CasinoName": "7Up-Down (V)", "opentable": 98793 },
     { "tableName": "Dragon Tiger (Virtual)", "CasinoName": "DT (V)", "opentable": 98794 },
     { "tableName": "Amar Akbar Anthony (Virtual)", "CasinoName": "AAA (V)", "opentable": 98795 },
     { "tableName": "Roulette (Virtual)", "CasinoName": "Roulette (V)", "opentable": 98792 },
     { "tableName": "32 cards casino (Virtual)", "CasinoName": "32Cards (V)", "opentable": 56966 },




   ];
   this.casinoLists = [
    // { "tableName": "Live Teenpatti", "CasinoName": "LiveTP", "opentable": 56767 },
    { "tableName": "Andar Bahar", "CasinoName": "Andar-Bahar", "opentable": 87564 },
  //  { "tableName": "Poker", "CasinoName": "Poker1Day", "opentable": 67564 },
   { "tableName": "7 up & Down", "CasinoName": "7Up-Down", "opentable": 98789 },
   { "tableName": "Roulette", "CasinoName": "Roulette", "opentable": 98788 },
  //  { "tableName": "Sicbo", "CasinoName": "Sicbo", "opentable": 98566 },
  //  { "tableName": "32 cards casino", "CasinoName": "32Cards", "opentable": 56967 },
   { "tableName": "Hi Low", "CasinoName": "Hi-Low", "opentable": 56968 },
  //  { "tableName": "Worli Matka", "CasinoName": "Matka", "opentable": 92037 },
   { "tableName": "Baccarat", "CasinoName": "Baccarat", "opentable": 92038 },
  //  { "tableName": "Six player poker", "CasinoName": "Poker6P", "opentable": 67565 },
  //  { "tableName": "Teenpatti T20", "CasinoName": "TP T20", "opentable": 56768 },
   { "tableName": "Amar Akbar Anthony", "CasinoName": "AAA", "opentable": 98791 },
    { "tableName": "Dragon Tiger", "CasinoName": "Dragon-Tiger", "opentable": 98790 },
  //  { "tableName": "Race 20-20", "CasinoName": "Race 20-20", "opentable": 90100 },
   { "tableName": "Bollywood Casino", "CasinoName": "Bollywood", "opentable": 67570 },
   { "tableName": "Casino Meter", "CasinoName": "Casino Meter", "opentable": 67575 },
   { "tableName": "Casino War", "CasinoName": "Casino War", "opentable": 67580 },
  //  { "tableName": "Poker 20-20", "CasinoName": "Poker2020", "opentable": 67567 },
  //  { "tableName": "Muflis Teenpatti", "CasinoName": "MuflisTP", "opentable": 67600 },
  //  { "tableName": "Trio", "CasinoName": "MuflisTP", "opentable": 67610 },
  //  { "tableName": "2 Cards Teenpatti", "CasinoName": "2CardTP", "opentable": 67660 },
   { "tableName": "The Trap", "CasinoName": "Trap", "opentable": 67680 },
  //  { "tableName": "Teenpatti Test", "CasinoName": "TPTest", "opentable": 67630 },
   { "tableName": "Queen", "CasinoName": "Queen", "opentable": 67620 },
  //  { "tableName": "Teenpatti Open", "CasinoName": "Race to 17", "opentable": 67640 },
   { "tableName": "29 Card Baccarat", "CasinoName": "29 Card Baccarat", "opentable": 67690 },
   { "tableName": "Race to 17", "CasinoName": "Race to 17", "opentable": 67710 },




   { "tableName": "Six player poker (Virtual)", "CasinoName": "Poker6P (V)", "opentable": 67566 },
  //  { "tableName": "Teenpatti One-Day (Virtual)", "CasinoName": "TPOneDay (V)", "opentable": 56766 },
   { "tableName": "Andar Bahar (Virtual)", "CasinoName": "AB (V)", "opentable": 87565 },
  //  { "tableName": "Teenpatti T20 (Virtual)", "CasinoName": "TP T20 (V)", "opentable": 56769 },
   { "tableName": "Hi Low (Virtual)", "CasinoName": "High-Low (V)", "opentable": 56969 },
  //  { "tableName": "Poker  (Virtual)", "CasinoName": "Poker (V)", "opentable": 67563 },
   { "tableName": "Matka (Virtual)", "CasinoName": "Mataka (V)", "opentable": 92036 },
   { "tableName": "7 up & Down (Virtual)", "CasinoName": "7Up-Down (V)", "opentable": 98793 },
   { "tableName": "Dragon Tiger (Virtual)", "CasinoName": "DT (V)", "opentable": 98794 },
   { "tableName": "Amar Akbar Anthony (Virtual)", "CasinoName": "AAA (V)", "opentable": 98795 },
   { "tableName": "Roulette (Virtual)", "CasinoName": "Roulette (V)", "opentable": 98792 },
   { "tableName": "32 cards casino (Virtual)", "CasinoName": "32Cards (V)", "opentable": 56966 },




 ];

    this.route.params.subscribe((params: any) => {
      // console.log(params)
      this.eventTypeId = params.eventTypeId;
      this.selectedSport = null;
      this.sportId = params.eventTypeId;
      this.sportWise();
      this.shareService.activeEventType.emit(this.eventTypeId);
      this.main.apis$.subscribe((res) => {
        if(this.siteName=='cricbuzzer'){
        this.listMeetings('today')
        }
      });
      if (this.eventTypeId) {
        this.isAllSport = false;
      }
      else {
        this.isAllSport = true;
      }
    })
  }

  ngOnInit() {
    this.sportWise();
    this.getlanguages();
    this.GetSportsData();
    this.competionWise('by Time');

    if(this.siteName=='cricbuzzer'){
      this.listMeetings('today')
    }
    this.main.apis$.subscribe((res) => {
      this.UserDescription();
    })
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

    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      // console.log(data, "sportwise");
      if (data != null) {
        this.sportList = this.dfService.sportEventWise(data, 0);
        // console.log(this.sportList);
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

  toggleFavourite(event: any, marketData) {
    // console.log(event);

    if (this.isLogin) {
      event.isMulti = !event.isMulti;
      this.dfService.ToggleFavourite(marketData);
    } else {
      this.openLoginPop()
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

  openLoginPop() {
    $("#loginBox").fadeIn();
  }


  ngOnDestroy() {
    if (this.sportSubscription) {
      this.sportSubscription.unsubscribe();
    }
    this.selectedSport = null;
  }

  toursWises(sport: any) {
    this.tourList = this.dfService.toursWise(this.sportsData[sport.eventTypeId]);
    // console.log(this.tourList, "tourlist");
  }

  GetSportsData() {
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      // console.log(data)
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

  listMeetings(day) {
    if (this.listMeetingPending) {
      return
    }
    this.listMeetingPending = true;
    this.todayRaces = [];
    this.racingApi.listMeetings(day, 7).subscribe((resp: any) => {
      if (resp) {
        this.todayRaces = this.dfService.getRacingFormat(resp);
        console.log(this.todayRaces);

        if (day == "today") {
          this.nextRaces = this.dfService.getNextRacingFormat(resp);
          console.log(this.nextRaces);
        }
      }
      $('#page_loading').css('display', 'none');
      this.listMeetingPending = false;
    }, err => {
      $('#page_loading').css('display', 'none');
      this.listMeetingPending = false;
    });
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();

    // console.log(this.accountInfo)
  }

  competionWise(event) {
    this.competetionTab = event
    this.toursWises(this.sportsData[this.sportId])

    // console.log( this.competetionTab);
    
    
  }
  
  onOptionChange() {    
    if (this.selectedOption === 'openDateTime') {
      this.competionWise('by Time');
    } else if (this.selectedOption === 'competitionName') {
      this.competionWise('by Competition');
    }
  }

}
