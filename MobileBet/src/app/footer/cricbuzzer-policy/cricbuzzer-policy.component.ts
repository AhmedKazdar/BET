import { Component, OnInit } from '@angular/core';
import { ShareDataService } from 'src/app/services/share-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cricbuzzer-policy',
  templateUrl: './cricbuzzer-policy.component.html',
  styleUrls: ['./cricbuzzer-policy.component.scss']
})
export class CricbuzzerPolicyComponent implements OnInit {

  siteName=environment.siteName;
  affiliteLink = environment.affiliteLink;
  isAffiliate = environment.isAffiliate;
  affiliteSignUPLink = this.affiliteLink + '/register?for=2';
  domain = environment.domain;
  affiliteSiteName = (environment.siteName)[0].toUpperCase()+(environment.siteName).slice(1);

  Update: any;
  constructor(
    private shareService: ShareDataService,

  ) {
    
   
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

  showOverlayInfo(value) {
    $(value).css('display', 'flex');
  }
  
  hideOverlayInfo(value) {
    $(value).fadeOut();
  }

}
