import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShareDataService } from 'src/app/services/share-data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-search-wrap',
  templateUrl: './search-wrap.component.html',
  styleUrls: ['./search-wrap.component.scss']
})
export class SearchWrapComponent implements OnInit {

  eventsList = [];

  searchText: string = "";
  searchResult = [];
  sportSubscription: Subscription;
  Update: any;


  constructor(
    private shareService: ShareDataService
  ) { }

  ngOnInit(): void {
    this.SearchEvents();
    this.getlanguages();
  }

  SearchEvents() {
    this.sportSubscription = this.shareService.listGamesData$.subscribe(resp => {
      if (resp) {
        // getting all events name whit other data in object
        this.eventsList = resp
        // console.log("search event",this.eventsList)
      }
    })
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data 
        }
      // console.log("json file data",this.Update);

    })
  }

  keyupSearch(event) {
    this.searchResult = [];
    if (this.searchText.length >= 3) {
      _.forEach(this.eventsList, (element, index) => {
        if (element.eventName.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) {
          this.searchResult.push(element);
        }
      });
    }

    console.log("searh result",this.searchResult)
  }

  toggleFavourite(event) {
    // this.dfService.ToggleFavourite(event.mtBfId, false);
    // clear text in search box
    this.searchClear();
  }

  searchClear() {
    this.searchText = '';
    this.searchResult = [];
  }

  ngOnDestroy() {
    this.sportSubscription.unsubscribe();
  }


}
