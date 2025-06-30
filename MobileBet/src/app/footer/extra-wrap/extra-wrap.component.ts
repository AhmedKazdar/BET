import { Component, OnInit } from '@angular/core';
import { ClientApiService } from 'src/app/services/client-api.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-extra-wrap',
  templateUrl: './extra-wrap.component.html',
  styleUrls: ['./extra-wrap.component.css']
})
export class ExtraWrapComponent implements OnInit {
  siteName = environment.siteName;
  isTraslate: boolean = environment.isTraslate;
  Update: any;

  language: any;
  range = "en";
  Alllanguage: any;
  isLogin: boolean = false;
  currentlanguage: string;
  selectedlang: any;
  constructor(private shareService: ShareDataService,
    private tokenService: TokenService,
    private clientApi: ClientApiService,
  ) { 
    if (this.tokenService.getLanguage()) {
      this.selectedlang = this.tokenService.getLanguage()
      this.selectlanguage(this.selectedlang)
    } else {
      this.selectlanguage('en')
    }
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }

  ngOnInit(): void {
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


}
