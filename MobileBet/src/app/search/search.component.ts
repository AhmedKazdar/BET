import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ShareDataService } from '../services/share-data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit,OnDestroy {


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
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
    })

    }
  SearchEvents() {
    this.sportSubscription = this.shareService.listGamesData$.subscribe(resp => {
      if (resp) {
        this.eventsList = resp
      }
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

    console.log(this.searchResult)
  }

  toggleFavourite(event) {
    // this.dfService.ToggleFavourite(event.mtBfId, false);
    this.searchBack();
    this.removeExpand();
    this.searchClear();
  }


  searchBack() {
    let searchWrap = $("#searchWrap");
    searchWrap.fadeOut();
  }

  searchClear() {
    this.searchText = '';
    this.searchResult = [];
  }
  addExpand() {
    let searchWrap = $("#searchWrap");
    searchWrap.find("#searchPop").addClass("expand")
  }
  removeExpand() {
    let searchWrap = $("#searchWrap");
    searchWrap.find("#searchPop").removeClass("expand")
  }

  ngOnDestroy() {
    if(this.sportSubscription){
      this.sportSubscription.unsubscribe();
    }

  }

}
