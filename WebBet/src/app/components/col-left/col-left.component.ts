import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-col-left',
  templateUrl: './col-left.component.html',
  styleUrls: ['./col-left.component.scss']
})
export class ColLeftComponent implements OnInit {
  sportsData: any;

  sportList: any = [];
  sportsName: any;
  selectedSport: any;
  tourList: any = [];
  competitionName: any;
  selectedTour: any;
  matchList: any = [];
  selectedMatch: any;
  marketList: any = [];
  selectedMarket: any;


  sportSubscription!: Subscription;
  Update: any;

  constructor(
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.GetSportsData();
  this.getlanguages()

  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }


  togglePathPop() {
    $('#path-pop').toggle();
  }
  closePathPop() {
    $('#path-pop').css('display', 'none');
  }

  GetSportsData() {
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportsData = data;
        if (!this.selectedSport) {
          this.sportsWise();
        }
      }
    });
    this.shareService.activeEventType.subscribe(eventTypeId => {
      if (eventTypeId) {
        _.forEach(this.sportList,(element) => {
          if (element.eventTypeId == eventTypeId) {
            this.toursWise(element);
          }
        });

      } else {
        this.sportsWise();
      }
    })
  }

  sportsWise() {
    this.selectedSport = null;
    this.selectedTour = null;
    this.sportList = this.dfService.sportsWise(this.sportsData);
    this.closePathPop();
  }
  toursWise(sport: any) {
    this.selectedTour = null;
    this.selectedSport = sport;
    this.sportsName = sport.sportsName;
    this.tourList = this.dfService.toursWise(this.sportsData[sport.eventTypeId]);

    this.closePathPop();
  }
  matchesWise(tour: any) {
    this.selectedTour = tour;
    this.competitionName = tour.competitionName;
    this.matchList = this.dfService.matchesWise(this.sportsData[this.selectedSport.eventTypeId].tournaments[tour.competitionId]);
    this.closePathPop();
  }


  toggleFavourite(event: any) {
    // this.dfService.ToggleFavourite(event.mtBfId, false);
  }

  trackBySport(index: number, item: any) {
    return item.eventTypeId;
  }
  trackByTour(index: number, item: any) {
    return item.competitionId;
  }

  trackByEvent(index: number, item: any) {
    return item.bfId;
  }

  onClickedOutside(e: Event, data: any) {
    // console.log('Clicked outside:', e);
    $("#path-pop").css('display', 'none');

  }

  ngOnDestroy() {
    this.sportSubscription.unsubscribe();
  }

}
