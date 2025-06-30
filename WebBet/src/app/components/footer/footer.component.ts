import { Component, OnInit } from '@angular/core';
import { ShareDataService } from 'src/app/services/share-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  siteName = environment.siteName;

  fullSiteName = window.location.hostname.replace('www.', '');
  Update: any;
  constructor(private shareService: ShareDataService,) { }

  ngOnInit(): void {
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
}
