import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from '../../services/token.service';
import { MainService } from 'src/app/services/main.service';
import { Subscription } from 'rxjs';
import { ShareDataService } from 'src/app/services/share-data.service';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { ClientApiService } from 'src/app/services/client-api.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements  OnInit, OnDestroy {
  isTraslate: boolean = environment.isTraslate;
  accountInfo: any;
  fundInfo: any;

  siteName: string = environment.siteName;
  intervalId: any;

  fundExpoPending: boolean = false;

  isLogin: boolean = false;

  sportList: any = [];

  OneClickBet: any = {
    isConfirmOneClickBet: false,
    isOneClickBet: false,
    oneClickBetStakeIndex: 0
  }


  pingPending: boolean = false;
  isClicked: boolean = false;
  listBetsPending: boolean = false;
  fundInterval;
  sportSubscription!: Subscription;
  eventBetsSubscription!: Subscription;

  selectedlanguage: string = '';
  language: any;
  range = "en";
  Alllanguage: any;
  Update: any;
  currentlanguage: string;
  selectedlang: any;

  constructor(
    private tokenService: TokenService,
    private main: MainService,
    private clientApi: ClientApiService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private loginService: LoginService
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

    if (this.isLogin) {
      if (!this.dfService.getOneClickSetting()) {
        this.dfService.saveOneClickSetting(this.OneClickBet);
      } else {
        this.OneClickBet = JSON.parse(this.dfService.getOneClickSetting());
      }
      this.main.apis$.subscribe((res) => {
        // this.myMarketMatch();
        this.UserDescription();
        this.FundExpo('refresh');
        this.listBets();
        this.sportWise();
        this.shareService.updateFundExpo$.subscribe(data => {
          this.FundExpo('refresh');
          this.listBets();
        })
      });

      this.fundInterval = setInterval(() => {
        this.FundExpo(null);
      }, 60000)
    } else {
      this.sportWise();
    }
  }

  ngOnInit(): void {
    this.getlanguages()
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
    if (this.siteName == "cricbuzzer" || this.siteName == "cricbuzzerlive" ) {
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
  accountPopup() {
    $("#account_pop").toggle();
  }

  onClickedOutside(e: Event, data: any) {
    // console.log('Clicked outside:', e);
    $("#account_pop").css('display', 'none');

  }

  openSlipSet() {
    if (this.isLogin) {
      $("#set_pop").toggle();
    } else {
      this.openLoginPop();
    }
  }

  onOneClickOutsideSet(e: Event, data: any) {
    // console.log('Clicked outside:', e);
    $("#set_pop").css('display', 'none');

  }

  openOneClickSet() {
    if (this.isLogin) {
      if (!this.OneClickBet.isConfirmOneClickBet) {
        $('#oneClickBetOverlay').css('display', 'block');
        $('#oneClickBetDialog').css('display', 'block');
        $('#oneClickBetStakeBox').css('display', 'block');
        this.OneClickBet.isConfirmOneClickBet = true;
        this.OneClickBet.isOneClickBet = true;
      } else if (this.OneClickBet.isConfirmOneClickBet && !this.OneClickBet.isOneClickBet) {
        $('#oneClickBetStakeBox').css('display', 'block');
        this.OneClickBet.isOneClickBet = true;
      } else if (this.OneClickBet.isOneClickBet) {
        $('#oneClickBetStakeBox').css('display', 'none');
        this.OneClickBet.isOneClickBet = false;
      }
      this.dfService.saveOneClickSetting(this.OneClickBet);
    } else {
      this.openLoginPop();
    }
  }


  openLoginPop() {
    $("#loginBox").fadeIn();
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();

    // console.log(this.accountInfo)
  }

  FundExpo(isdata: any) {

    if (this.pingPending) {
      return;
    }
    this.pingPending = true;
    if (isdata) {
      this.isClicked = this.pingPending;
    }

    this.clientApi.balance().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        this.fundInfo = resp.result[0];

        // if (this.fundInfo.listBets == 1) {
        //   this.listBets();
        // }
      }
      this.pingPending = false;
      this.isClicked = this.pingPending;

    }, err => {
      this.pingPending = false;
      this.isClicked = this.pingPending;

    });
  }

  listBets() {
    if (this.listBetsPending) {
      return;
    }
    this.listBetsPending = true;
    this.clientApi.listBets().subscribe((resp: any) => {
      // console.log(resp);
      if (resp.errorCode == 0) {
        let allbets = this.dfService.matchUnmatchBetsMarketWise(resp.result);
        // console.log(allbets);
        this.shareService.shareListBets(allbets);
      }
      this.listBetsPending = false;
    }, err => {
      this.listBetsPending = false;
    })
  }


  sportWise() {
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportList = this.dfService.sportEventWise(data, 0);

        // console.log(this.sportList);
      }
      this.sportList = this.sportList .filter(item => {
        return parseInt(item.eventTypeId) == 4 || parseInt(item.eventTypeId) == 1 || parseInt(item.eventTypeId) == 2 || parseInt(item.eventTypeId) == 52 || parseInt(item.eventTypeId) == 85;
      });

    });
  }


  trackBySport(index: number, item: any) {
    return item.eventTypeId;
  }

  Logout() {
    this.loginService.logout().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        this.tokenService.removeToken();
      }
    }, err => {
      this.tokenService.removeToken();
    })
  }

  goToPage(page){
    console.log(page)
    window.location.href = window.location.origin +"/";
  }

  ngOnDestroy(): void {
    if (this.fundInterval) {
      clearInterval(this.fundInterval);
    }
  }

}
