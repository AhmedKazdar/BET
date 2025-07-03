import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  userInfo: any;
  Update: any;

  constructor(
    private tokenService: TokenService,
    private shareService: ShareDataService,
    private main: MainService
  ) { }

  ngOnInit(): void {
    this.UserDescription();
    this.getlanguages();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      if(this.Update?.myaccount=="আমার অ্যাকাউন্ট"){
        $("#accountPopup").css('font-size', '9px');
      }else{
        $("#accountPopup").css('font-size', 'inherit');
      }
      // console.log(this.Update);

    })
  }
  UserDescription() {
    this.userInfo = this.tokenService.getUserInfo();
    // console.log(this.userInfo)
  }
  

  showDialog() {
    $('#changePasswordModal').fadeIn();
  }

}
