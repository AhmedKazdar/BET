import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-x-game',
  templateUrl: './x-game.component.html',
  styleUrls: ['./x-game.component.scss']
})
export class XGameComponent implements OnInit {
  loader: boolean = false;
  isLogin: boolean = false;
  siteName: string = environment.siteName;


   
    constructor( private tokenService: TokenService) { 
      if (this.tokenService.getToken()) {
        this.isLogin = true;
      }

  }

  ngOnInit(): void {
    $('#page_loading').css('display', 'none');
  }

}
