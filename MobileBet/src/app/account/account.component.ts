import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClientApiService } from '../services/client-api.service';
import { LoginService } from '../services/login.service';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  accountInfo: any;
  isb2c: boolean = environment.isb2c;
  isTraslate: boolean = environment.isTraslate;
  clickevent: string;
  ourdesign: boolean = false;
  Update: any;
  selectedlanguage: string = '';
  language: any;
  range = "en";
  Alllanguage: any;
  currentlanguage: string;
  selectedlang: any;
  siteName = environment.siteName;
  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private shareService: ShareDataService,
    private clientApi: ClientApiService,
  ) { 
    if (this.tokenService.getLanguage()) {
      this.selectedlang = this.tokenService.getLanguage()
      this.selectlanguage(this.selectedlang)
    } else {
      this.selectlanguage('en')
    }
  }

  ngOnInit() {
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
  selectlanguage(newValue) {
    this.getLanguage();
    this.range = newValue;
    if (this.siteName == "cricbuzzer" || this.siteName == "cricbuzzerlive") {
      if (this.range == "sp") {
        // this.siteName = "cricbuzzer"

        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('spanish');
        bodytag.classList.remove('portuguese');
        bodytag.classList.remove('turkish');
      }
      else if (this.range == "pg") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('portuguese');
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('turkish');
      }
      else if (this.range == "tu") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('turkish');
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('portuguese');

      }
      else {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add(this.siteName);
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('portuguese');
        bodytag.classList.remove('turkish');
      }
    }
    this.tokenService.setLanguage(this.range);
  }
  getLanguage() {
    let L = []
    this.clientApi.getlanguage().subscribe((resp: any) => {
      this.language = resp
      this.language.forEach(data => {
        if (data.lang == this.range) {
          L.push(data)
        }
        this.Alllanguage = L
        
        this.shareService.sharelanguage(this.Alllanguage[0]);
      })
    })
  }

  
  UserDescription() {
    this.accountInfo=this.tokenService.getUserInfo();
    // console.log(this.accountInfo)
    $('#page_loading').css('display', 'none');

  }


  Logout() {
    this.loginService.logout().subscribe((resp:any) => {
      if (resp.errorCode == 0) {
        this.tokenService.removeToken();
      }else{
        this.tokenService.removeToken();
      }
    }, err => {
      this.tokenService.removeToken();
    })
  }
  langopen(){
    $('#bangala1').fadeIn();

  }

  changeExpo(clickevent) {
    this.clickevent = clickevent;
    if (this.clickevent == 'diamond') {
      window.location.href = "/m/diamondMobile";
    } else if (this.clickevent == 'lotus') {
      window.location.href = "/m/lotusMobile";
    }
    else if (this.clickevent == 'lc') {
      window.location.href = "/m/Lcexch";
    }else  if (this.clickevent == 'sky') {
      window.location.href = "/m/";
    } 
  }



}
