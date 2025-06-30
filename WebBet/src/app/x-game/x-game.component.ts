import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ShareDataService } from '../services/share-data.service';
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
  loadrainbow: boolean=false;
  Update: any;

  constructor( private tokenService: TokenService,private shareService: ShareDataService) { }

  ngOnInit(): void {
  this.getlanguages();
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }
  dosomething(){
    this.loadrainbow=true
  }

}
