import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rg-cricbuzzer',
  templateUrl: './rg-cricbuzzer.component.html',
  styleUrls: ['./rg-cricbuzzer.component.scss']
})
export class RgCricbuzzerComponent implements OnInit {
  domain=environment.domain
  constructor() { }

  ngOnInit(): void {
  }

}
