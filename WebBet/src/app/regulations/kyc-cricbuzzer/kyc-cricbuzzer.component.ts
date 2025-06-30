import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-kyc-cricbuzzer',
  templateUrl: './kyc-cricbuzzer.component.html',
  styleUrls: ['./kyc-cricbuzzer.component.scss']
})
export class KycCricbuzzerComponent implements OnInit {
  domain=environment.domain;
  constructor() { }

  ngOnInit(): void {
  }

}
