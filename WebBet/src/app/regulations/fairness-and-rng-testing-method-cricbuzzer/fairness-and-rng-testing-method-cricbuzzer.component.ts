import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fairness-and-rng-testing-method-cricbuzzer',
  templateUrl: './fairness-and-rng-testing-method-cricbuzzer.component.html',
  styleUrls: ['./fairness-and-rng-testing-method-cricbuzzer.component.scss']
})
export class FairnessAndRngTestingMethodCricbuzzerComponent implements OnInit {

  domain:any=environment.domain;
  constructor() { }

  ngOnInit(): void {
  }

}
