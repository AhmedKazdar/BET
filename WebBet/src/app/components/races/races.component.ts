import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { MainService } from 'src/app/services/main.service';
import { RacingApiService } from 'src/app/services/racing-api.service';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.scss']
})
export class RacesComponent implements OnInit {


  todayRaces: any = [];
  nextRaces: any = [];

  seletedTab: string = "today";
  eventTypeId: number;
  eventTypeName: string;


  listMeetingPending: boolean = false;
  Update: any;

  constructor(
    private racingApi: RacingApiService,
    private dfService: DataFormatsService,
    private main: MainService,
    private shareService: ShareDataService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.eventTypeId = params.eventTypeId;
      if (this.eventTypeId == 7) {
        this.eventTypeName = "Horse";
      } else {
        this.eventTypeName = "Greyhound";
      }
      this.main.apis$.subscribe((res) => {
        $('#page_loading').css('display', 'block');
  
        this.listMeetings(this.seletedTab);
      });
    })
    
  }

  ngOnInit(): void {
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
  changeTab(day) {
    $('#page_loading').css('display', 'block');
    this.seletedTab = day;
    if (this.seletedTab != "dayAfter") {
      this.listMeetings(day);
    } else {
      this.todayRaces = [];
      $('#page_loading').css('display', 'none');

    }
  }

  listMeetings(day) {
    if (this.listMeetingPending) {
      return
    }
    this.listMeetingPending = true;
    this.todayRaces = [];
    this.racingApi.listMeetings(day, this.eventTypeId).subscribe((resp: any) => {
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

}
