import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-au',
  templateUrl: './au.component.html',
  styleUrls: ['./au.component.scss']
})
export class AuComponent implements OnInit {
  siteName = environment.siteName;
  fullSiteName = window.location.hostname.replace('www.', '');
  
  constructor() { }

  ngOnInit(): void {
  }

}
