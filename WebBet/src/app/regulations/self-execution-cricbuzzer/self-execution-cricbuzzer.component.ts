import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-self-execution-cricbuzzer',
  templateUrl: './self-execution-cricbuzzer.component.html',
  styleUrls: ['./self-execution-cricbuzzer.component.scss']
})
export class SelfExecutionCricbuzzerComponent implements OnInit {
  domain=environment.domain
  constructor() { }

  ngOnInit(): void {
  }

}
