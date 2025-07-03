import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  siteName = environment.siteName;
  fullSiteName = window.location.hostname.replace('www.', '');
  constructor() { }

  ngOnInit(): void {
  }

}
