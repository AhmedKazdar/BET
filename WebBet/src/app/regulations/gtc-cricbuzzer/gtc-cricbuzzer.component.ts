import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gtc-cricbuzzer',
  templateUrl: './gtc-cricbuzzer.component.html',
  styleUrls: ['./gtc-cricbuzzer.component.scss']
})
export class GtcCricbuzzerComponent implements OnInit {
  siteName = environment.siteName;
  domain = environment.domain;
  fullSiteName = window.location.hostname.replace('www.', '');
  constructor() { }

  ngOnInit(): void {
  }

}
