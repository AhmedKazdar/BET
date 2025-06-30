import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-underage-policy',
  templateUrl: './underage-policy.component.html',
  styleUrls: ['./underage-policy.component.scss']
})
export class UnderagePolicyComponent implements OnInit {
  siteName = environment.siteName;
  fullSiteName = window.location.hostname.replace('www.', '');

  constructor() { }

  ngOnInit(): void {
  }

}
