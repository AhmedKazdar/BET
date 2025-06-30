import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import Swiper from 'swiper';
import { ToastMessageService } from '../services/toast-message.service';
import { CasinoApiService } from '../services/casino-api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;

  siteName = environment.siteName;
  isLcRouting = environment.isLcRouting;
  isEtgcasino = environment.isEtgcasino
  isCasinoTab = environment.isCasinoTab;
  isMultiMarket = environment.isMultiMarket;

  isLogin: boolean = false;
  homeCom: any;
  inplayCom: any;
  highCom: any;
  Update: any;
  isFirstBoxOpen: boolean = false;
  isSecondBoxOpen: boolean = false;
  randomNumber: number;
  randomNumber1: number;
  isAuthPending: boolean = false;
  accountInfo: any;
  awcOpenGame: any;
  isparlay:any
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private shareService: ShareDataService,
    private toastr: ToastMessageService,
    private apiService: CasinoApiService,

  ) {
    this.homeCom = '/dash';
    this.inplayCom = '/running';
    this.highCom = '/highlight';


    if (this.isLcRouting) {
      this.homeCom = '/home';
      this.inplayCom = '/inplay';
      this.highCom = '/sports';

    }
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }

  awc_filterList = [
    { name: "7 Up 7 Down", Platform: "KINGMAKER", gameType: "TABLE", gameCode: "KM-TABLE-028", type: "Table" },
    { name: "Andar Bahar", Platform: "KINGMAKER", gameType: "TABLE", gameCode: "KM-TABLE-032", type: "Table" },
    { name: "NumberKing", Platform: "JILI", gameType: "TABLE", gameCode: "JILI-TABLE-005", type: "Table" },
    { name: "BGLobby", Platform: "BG", gameType: "LIVE", gameCode: "BG-LIVE-001", type: "GameShows" },
    { name: "sicbo", Platform: "KINGMAKER", gameType: "TABLE", gameCode: "KM-TABLE-015", type: "Table" },
    { name: "Coin Toss", Platform: "KINGMAKER", gameType: "TABLE", gameCode: "KM-TABLE-036", type: "Table" },



  ]

  ngOnInit() {
    this.getlanguages();
    this.UserDescription()
    this.shareService.parlayvalue$.subscribe(val =>{
      this.isparlay = val
      // console.log( this.isparlay);
    })
  }


  openAWC(gameType: any, platform: any, gameCode: any) {
    $('#page_loading').css('display', 'flex');
    if (!this.isLogin) {
      this.router.navigate(['/login']);
    }
    if (!this.isLogin) {
      return
    }
    if (this.isAuthPending) {
      return;
    }
    this.isAuthPending = true;

    let data = {
      "userName": this.accountInfo.userName,
      "gameType": gameType,
      "isMobile": true,
      "externalUrl": window.origin,
      "platform": platform,
      "gameCode": gameCode,
      "isLaunchGameTable": true,
    }
    this.awcOpenGame = data
    console.log(this.awcOpenGame);
    this.apiService.awcAuth(data).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        setTimeout(() => {
          $('#page_loading').css('display', 'none');
        }, 1000)
        window.open(resp.url, "_self");
      } else {
        this.toastr.errorMsg(resp.errorDescription);
      }
      setTimeout(() => {
        this.isAuthPending = false;
      }, 1000)
    }, err => {
      this.isAuthPending = false;
      setTimeout(() => {
        $('#page_loading').css('display', 'none');
      }, 1000)

    }
    )
    setTimeout(() => {
      $('#page_loading').css('display', 'none');
    }, 1000)
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
  }
  openMiniGame() {
    if (!this.isLogin) {
      this.router.navigate(['/login']);
    } else {
      $('#luckco7-frame').addClass("luckco7-frame-active");
      $('#luckco7-frame-hide').addClass("displayblock");
      this.isFirstBoxOpen = true;
      this.isSecondBoxOpen = true;
      this.generateRandomNumber()
    }

  }


  closeMiniGame() {
    $('#luckco7-frame').removeClass("luckco7-frame-active");
    $('#luckco7-frame-hide').removeClass("displaynone");
    this.isFirstBoxOpen = false;
    this.isSecondBoxOpen = false;
  }


  generateRandomNumber() {
    this.randomNumber = Math.floor(Math.random() * (999 - 700 + 1)) + 700;
    this.randomNumber1 = Math.floor(Math.random() * (999 - 700 + 1)) + 700;
    // console.log(this.randomNumber);
    // console.log(this.randomNumber1);

  }

  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if (data != null) {
        this.Update = data
      }

    })
  }
  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
}
