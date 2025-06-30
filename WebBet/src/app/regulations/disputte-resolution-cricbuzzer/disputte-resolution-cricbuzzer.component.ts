import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-disputte-resolution-cricbuzzer',
  templateUrl: './disputte-resolution-cricbuzzer.component.html',
  styleUrls: ['./disputte-resolution-cricbuzzer.component.scss']
})
export class DisputteResolutionCricbuzzerComponent implements OnInit {

  domain :any = environment.domain
  constructor() { }

  ngOnInit(): void {
  }

}
