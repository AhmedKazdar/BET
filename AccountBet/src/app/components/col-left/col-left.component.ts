import { Component, OnInit } from '@angular/core';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-col-left',
  templateUrl: './col-left.component.html',
  styleUrls: ['./col-left.component.scss']
})
export class ColLeftComponent implements OnInit {
  siteName = environment.siteName;
  isb2c: boolean = environment.isb2c;
  isAwcbets: boolean = environment.isAwcbets;
  isBObets = environment.isBObets;
  isParlay: boolean = false;

  currentUser: any;
  Update: any;
  accountInfo: any;
  constructor( private tokenService: TokenService ,  private shareService: ShareDataService,   ) { }

  ngOnInit(): void {
    this.getlanguages();
    this.UserDescription()
    this.currentUser = this.tokenService.getUserInfo();

  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }
  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    if(this.accountInfo?.parlayOption == 1){
      this.isParlay = true
    }else{
      this.isParlay = false
    }
  }

}
