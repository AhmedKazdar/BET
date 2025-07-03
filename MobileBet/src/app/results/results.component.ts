import { Component, OnInit } from '@angular/core';
import { ClientApiService } from '../services/client-api.service';
import { MainService } from '../services/main.service';
import { ShareDataService } from '../services/share-data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  sportId = '4';
  type = 'today';

  results = [];
  Update: any;

  constructor(private mainService: MainService,
    private shareService: ShareDataService,
    private clientApi: ClientApiService,
  ) {
    this.mainService.apis$.subscribe((res) => {
      this.getEventresults();
    });

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

  sportselect(event:Event){
    const selectedid = (event.target as HTMLSelectElement).value;
    // console.log(selectedid,"id");
    this.sportId = selectedid;
    this.getEventresults()
  }

  changeTab(type) {
    this.type = type
    this.results=[];
    $('#page_loading').css('display', 'flex');

    setTimeout(()=>{
      this.getEventresults();
    },300)
  }

  getEventresults() {
    $('#page_loading').css('display', 'flex');

    this.clientApi.getEventresults(this.sportId, this.type).subscribe((resp: any) => {

      if (resp.data) {
        this.results = resp.data;
      }
      $('#page_loading').css('display', 'none');

      // console.log(this.results)
    })
  }



}
