import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.scss']
})
export class AffiliateComponent implements OnInit {

  affiliteLink = environment.affiliteLink;
  affiliteSignUPLink = this.affiliteLink + '/register?for=2';
  domain = environment.domain;
  siteName = (environment.siteName)[0].toUpperCase()+(environment.siteName).slice(1);
  constructor() { }

  ngOnInit(): void {
  }

}
