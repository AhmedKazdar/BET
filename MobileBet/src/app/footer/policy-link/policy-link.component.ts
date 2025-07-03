import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-policy-link',
  templateUrl: './policy-link.component.html',
  styleUrls: ['./policy-link.component.css'],
})
export class PolicyLinkComponent implements OnInit {
  siteName = environment.siteName;
  fullSiteName = window.location.hostname.replace('www.', '');

  affiliteLink = environment.affiliteLink;
  affiliteSignUPLink = this.affiliteLink + '/register?for=2';
  domain = environment.domain;
  affiliteSiteName = (environment.siteName)[0].toUpperCase()+(environment.siteName).slice(1);
  constructor() { }

  ngOnInit(): void { }

  showOverlayInfo(value) {
    $(value).css('display', 'flex');
  }
  hideOverlayInfo(value) {
    $(value).fadeOut();
  }
}
