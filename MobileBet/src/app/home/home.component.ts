import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CountUp } from 'countup.js';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientApiService } from '../services/client-api.service';
import { DataFormatsService } from '../services/data-formats.service';
import { LoginService } from '../services/login.service';
import { MainService } from '../services/main.service';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import { CasinoApiService } from '../services/casino-api.service';
import { ToastMessageService } from '../services/toast-message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})
export class HomeComponent implements OnInit {
  isLcRouting = environment.isLcRouting;

  siteName = environment.siteName;
  LoginForm: FormGroup;
  submitted: boolean = false;
  AferLoginChangePassword: boolean = environment.AferLoginChangePassword;
  activePlayer: string = '';
  sportList = [];
  casinoList: any = [];
  casinoLists: any = [];
  @ViewChild('tab2', { read: ElementRef }) public tab1: ElementRef<any>;

  slotUrl: any;
  Update: any;
  awc_siteName_list: any;
  finaldata: any;
  finalData: any;
  AWC_games: any;
  AWC_games_final: any;
  loader: boolean = false;
  isLogin: boolean = false;
  accountInfo: any;
  ispendingactiveplayer: boolean = false;
  activePlayerTimer;
  isPoker = environment.isPoker;
  casinoListssports365: any = [];
  sportSubscription: Subscription;
  result: any;
  isPendingLogin: boolean = false;
  isAuthPending: boolean = false;
  isInrCurrency = false;
  homeCom: any;
  inplayCom: any;
  highCom: any;
  isAuthPending_sn: boolean = false;
  isCasinoTab = environment.isCasinoTab;
  isDiamondCasino = environment.isDiamondCasino;
  isExchangeGames = environment.isExchangeGames;
  isAuthPending_direct: boolean = false;
  token: string;
  gameCode: any;
  GameStatus:any
  amancasinoBlocked: any;
  betgamescasinoBlocked: any;

  amanCasinoList = [


    { "tableName": "Live Teenpatti", "CasinoName": "LiveTP", "opentable": 56767 },
    { "tableName": "Andar Bahar", "CasinoName": "Andar-Bahar", "opentable": 87564 },
    { "tableName": "Poker", "CasinoName": "Poker1Day", "opentable": 67564 },
    { "tableName": "7 up & Down", "CasinoName": "7Up-Down", "opentable": 98789 },
    { "tableName": "Roulette", "CasinoName": "Roulette", "opentable": 98788 },
    { "tableName": "Sicbo", "CasinoName": "Sicbo", "opentable": 98566 },
    { "tableName": "32 cards casino", "CasinoName": "32Cards", "opentable": 56967 },
    { "tableName": "Hi Low", "CasinoName": "Hi-Low", "opentable": 56968 },
    { "tableName": "Worli Matka", "CasinoName": "Matka", "opentable": 92037 },
    { "tableName": "Baccarat", "CasinoName": "Baccarat", "opentable": 92038 },
    { "tableName": "Six player poker", "CasinoName": "Poker6P", "opentable": 67565 },
    { "tableName": "Teenpatti T20", "CasinoName": "TP T20", "opentable": 56768 },
    { "tableName": "Amar Akbar Anthony", "CasinoName": "AAA", "opentable": 98791 },
    { "tableName": "Dragon Tiger", "CasinoName": "Dragon-Tiger", "opentable": 98790 },
    { "tableName": "Race 20-20", "CasinoName": "Race 20-20", "opentable": 90100 },
    { "tableName": "Bollywood Casino", "CasinoName": "Bollywood", "opentable": 67570 },
    { "tableName": "Casino Meter", "CasinoName": "Casino Meter", "opentable": 67575 },
    { "tableName": "Casino War", "CasinoName": "Casino War", "opentable": 67580 },
    { "tableName": "Poker 20-20", "CasinoName": "Poker2020", "opentable": 67567 },
    { "tableName": "Muflis Teenpatti", "CasinoName": "MuflisTP", "opentable": 67600 },
    { "tableName": "Trio", "CasinoName": "MuflisTP", "opentable": 67610 },
    { "tableName": "2 Cards Teenpatti", "CasinoName": "2CardTP", "opentable": 67660 },
    { "tableName": "The Trap", "CasinoName": "Trap", "opentable": 67680 },
    { "tableName": "Teenpatti Test", "CasinoName": "TPTest", "opentable": 67630 },
    { "tableName": "Queen", "CasinoName": "Queen", "opentable": 67620 },
    { "tableName": "Teenpatti Open", "CasinoName": "Race to 17", "opentable": 67640 },
    { "tableName": "29 Card Baccarat", "CasinoName": "29 Card Baccarat", "opentable": 67690 },
    { "tableName": "Race to 17", "CasinoName": "Race to 17", "opentable": 67710 },



    { "tableName": "Six player poker (Virtual)", "CasinoName": "Poker6P (V)", "opentable": 67566 },
    { "tableName": "Teenpatti One-Day (Virtual)", "CasinoName": "TPOneDay (V)", "opentable": 56766 },
    { "tableName": "Andar Bahar (Virtual)", "CasinoName": "AB (V)", "opentable": 87565 },
    { "tableName": "Teenpatti T20 (Virtual)", "CasinoName": "TP T20 (V)", "opentable": 56769 },
    { "tableName": "Hi Low (Virtual)", "CasinoName": "High-Low (V)", "opentable": 56969 },
    { "tableName": "Poker  (Virtual)", "CasinoName": "Poker (V)", "opentable": 67563 },
    { "tableName": "Matka (Virtual)", "CasinoName": "Mataka (V)", "opentable": 92036 },
    { "tableName": "7 up & Down (Virtual)", "CasinoName": "7Up-Down (V)", "opentable": 98793 },
    { "tableName": "Dragon Tiger (Virtual)", "CasinoName": "DT (V)", "opentable": 98794 },
    { "tableName": "Amar Akbar Anthony (Virtual)", "CasinoName": "AAA (V)", "opentable": 98795 },
    { "tableName": "Roulette (Virtual)", "CasinoName": "Roulette (V)", "opentable": 98792 },
    { "tableName": "32 cards casino (Virtual)", "CasinoName": "32Cards (V)", "opentable": 56966 },




  ];





  loadrainbow: boolean = false;
  isaura: boolean = false;
  awcOpenGame: any;
  constructor(
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private apiService: ClientApiService,
    private main: MainService,
    private loginService: LoginService,
    private tokenService: TokenService,
    private toastr: ToastMessageService,
    private fb: FormBuilder,
    private router: Router,
    private casinoapiService: CasinoApiService


  ) {

    this.token = this.tokenService.getToken();

    this.homeCom = '/dash';
    this.inplayCom = '/running';
    this.highCom = '/highlight';

    this.shareService.getgameStatus$.subscribe((resp) =>{
      this.GameStatus = resp
      // console.log(this.GameStatus);
      
    })
    this.shareService.getgameStatus$.subscribe((data) => {
      if (data) {
        this.amancasinoBlocked = data?.some(market => market?.sport === 'amancasino' && market?.blocked);
        this.betgamescasinoBlocked = data?.some(market => market?.sport === 'betgames' && market?.blocked);
      }

    })


    if (this.isLcRouting) {
      this.homeCom = '/home';
      this.inplayCom = '/inplay';
      this.highCom = '/sports';
    }
    this.getAWC_table()

    if (this.tokenService.getToken()) {
      this.isLogin = true;
      this.main.apis$.subscribe((res) => {

        this.listCasinoTable();
        this.UserDescription();
        // this.listCasinoProduct();

      });
    } else {


      this.casinoList = [{ "tableName": "TP2020", "tableId": "-11", "oddsUrl": "/d_rate/teen20", "resultUrl": "/l_result/teen20", "scoreUrl": null, "streamUrl": ":8015/" }, { "tableName": "TP1Day", "tableId": "-12", "oddsUrl": "/d_rate/teen", "resultUrl": "/l_result/teen", "scoreUrl": null, "streamUrl": ":8001/" }, { "tableName": "TPOpen", "tableId": "-14", "oddsUrl": "/d_rate/teen8", "resultUrl": "/l_result/teen8", "scoreUrl": null, "streamUrl": ":8003/" }, { "tableName": "TPTest", "tableId": "-13", "oddsUrl": "/d_rate/teen9", "resultUrl": "/l_result/teen9", "scoreUrl": null, "streamUrl": ":8002/" }, { "tableName": "Lucky7A", "tableId": "-10", "oddsUrl": "/d_rate/lucky7", "resultUrl": "/l_result/lucky7", "scoreUrl": null, "streamUrl": ":8011/" }, { "tableName": "Lucky7B", "tableId": "-10", "oddsUrl": "/d_rate/lucky7eu", "resultUrl": "/l_result/lucky7eu", "scoreUrl": null, "streamUrl": ":8017/" }, { "tableName": "32Cards", "tableId": "-24", "oddsUrl": "/d_rate/card32", "resultUrl": "/l_result/card32", "scoreUrl": null, "streamUrl": ":8006/" }, { "tableName": "32CardsB", "tableId": "-25", "oddsUrl": "/d_rate/card32eu", "resultUrl": "/l_result/card32eu", "scoreUrl": null, "streamUrl": ":8024/" }, { "tableName": "Baccarat", "tableId": "-9", "oddsUrl": "/d_rate/baccarat", "resultUrl": "/l_result/baccarat", "scoreUrl": null, "streamUrl": ":8022/" }, { "tableName": "Baccarat2", "tableId": "-9", "oddsUrl": "/d_rate/baccarat2", "resultUrl": "/l_result/baccarat2", "scoreUrl": null, "streamUrl": ":8023/" }, { "tableName": "AB", "tableId": "-5", "oddsUrl": "/d_rate/ab20", "resultUrl": "/l_result/ab20", "scoreUrl": null, "streamUrl": ":8010/" }, { "tableName": "AB2", "tableId": "-4", "oddsUrl": "/d_rate/abj", "resultUrl": "/l_result/abj", "scoreUrl": null, "streamUrl": ":8019/" }, { "tableName": "3CardsJud", "tableId": "-23", "oddsUrl": "/d_rate/3cardj", "resultUrl": "/l_result/3cardj", "scoreUrl": null, "streamUrl": ":8016/" }, { "tableName": "AAA", "tableId": "-26", "oddsUrl": "/d_rate/aaa", "resultUrl": "/l_result/aaa", "scoreUrl": null, "streamUrl": ":8013/" }, { "tableName": "Bollywood", "tableId": "-27", "oddsUrl": "/d_rate/btable", "resultUrl": "/l_result/btable", "scoreUrl": null, "streamUrl": ":8014/" }, { "tableName": "CasinoMeter", "tableId": "-16", "oddsUrl": "/d_rate/cmeter", "resultUrl": "/l_result/cmeter", "scoreUrl": null, "streamUrl": ":8018/" }, { "tableName": "Poker2020", "tableId": "-20", "oddsUrl": "/d_rate/poker20", "resultUrl": "/l_result/poker20", "scoreUrl": null, "streamUrl": ":8007/" }, { "tableName": "Poker1Day", "tableId": "-19", "oddsUrl": "/d_rate/poker", "resultUrl": "/l_result/poker", "scoreUrl": null, "streamUrl": ":8008/" }, { "tableName": "Poker6P", "tableId": "-18", "oddsUrl": "/d_rate/poker6", "resultUrl": "/l_result/poker6", "scoreUrl": null, "streamUrl": ":8009/" }, { "tableName": "Cricket2020", "tableId": "-15", "oddsUrl": "/d_rate/cmatch20", "resultUrl": "/l_result/cmatch20", "scoreUrl": null, "streamUrl": ":8031/" }, { "tableName": "DT2020", "tableId": "-6", "oddsUrl": "/d_rate/dt20", "resultUrl": "/l_result/dt20", "scoreUrl": null, "streamUrl": ":8012/" }, { "tableName": "DT2", "tableId": "-52", "oddsUrl": "/d_rate/dt202", "resultUrl": "/l_result/dt202", "scoreUrl": null, "streamUrl": ":8020/" }, { "tableName": "DT1Day", "tableId": "-7", "oddsUrl": "/d_rate/dt6", "resultUrl": "/l_result/dt6", "scoreUrl": null, "streamUrl": ":8025/" }, { "tableName": "DTL2020", "tableId": "-8", "oddsUrl": "/d_rate/dtl20", "resultUrl": "/l_result/dtl20", "scoreUrl": null, "streamUrl": ":8026/" }, { "tableName": "Race2020", "tableId": "-60", "oddsUrl": "/d_rate/race20", "resultUrl": "/l_result/race20", "scoreUrl": null, "streamUrl": ":8029/" }, { "tableName": "CasinoQueen", "tableId": "-70", "oddsUrl": "/d_rate/queen", "resultUrl": "/l_result/queen", "scoreUrl": null, "streamUrl": ":8028/" }, { "tableName": "WorliMatka", "tableId": "-21", "oddsUrl": "/d_rate/worli", "resultUrl": "/l_result/worli", "scoreUrl": null, "streamUrl": ":8004/" }, { "tableName": "5FiveCricket", "tableId": "-3", "oddsUrl": "/d_rate/cricketv3", "resultUrl": "/l_result/cricketv3", "scoreUrl": null, "streamUrl": ":8030/" }, { "tableName": "InstantWorli", "tableId": "-22", "oddsUrl": "/d_rate/worli2", "resultUrl": "/l_result/worli2", "scoreUrl": null, "streamUrl": ":8005/" }];
    }

  }

  ngOnInit() {
    this.sportWise();
    this.getlanguages()
    this.startAnimation(this.tokenService.getActivePlayer());
    this.activePlayerTimer = setInterval(() => {
      this.startAnimation(this.tokenService.getActivePlayer());
    }, 10000)
    // this.showupdateTerm()

  }
  handleClick(gameStatus) {
    if (gameStatus.blocked) {
      this.toastr.warningMsg('This Casino is blocked by upper level.')
      
    }
  }

  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if (data != null) {
        this.Update = data
      }
      // console.log(this.Update);

    })
  }
  startAnimation(player: any) {
    let demo = new CountUp('activePlayer', player, { startVal: Number(this.activePlayer) });
    this.activePlayer = player;
    if (!demo.error) {
      demo.start();
    } else {
      console.log(demo.error);
    }
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    if (this.accountInfo) {
      if (this.accountInfo.currencyCode == 'INR') {
        this.isaura = true
        this.isInrCurrency = true;
        console.log(this.accountInfo.currencyCode)
      }
    }

    // console.log(this.accountInfo)
  }


  selectSport() {
    // this.shareService.seletedSport.emit(52);
  }

  sportWise() {
    $('#page_loading').css('display', 'flex');

    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportList = this.dfService.sportEventWise(data, 0);
        // this.sportList = this.sportList.filter(item => {
        //   return item.id < 10;
        // })
        // console.log(this.sportList);
        setTimeout(() => {
          $('#page_loading').css('display', 'none');
        }, 500);
        this.loader = true;
        this.showupdateTerm()

      }
    });
  }
  openTable(awc) {
    if (!this.isLogin) {
      return
    }
    if (awc.isAWC) {
      this.openAWC(awc.gameType, awc.Platform, awc.gameCode)
    }
    if (awc.is_direct_lobby) {
      this.openAWC(awc.gameType, awc.Platform, awc.gameCode)
    }
    if (awc.isBo) {
      this.opengameBO(awc.gameId)
    }
    if (awc.isBoDirect) {
      this.opengameBODirect(awc.gameId)
    }
    if (awc.isProvider) {
      this.router.navigate([awc.Route]);
    }
    if (awc.isSN_direct) {
      this.open_direct_sn(awc.providerCode, awc.gameCode)
    }
    if (awc.isHorse) {
      this.router.navigate([awc.Route, 7]);
    }
    if (awc.isGrey) {
      this.router.navigate([awc.Route, 4339]);
    }
    if (awc.isETG) {
      this.awc_login_direct(awc.prod_code, awc.prod_type, awc.prod_name, awc.game_code)
    }
    if (awc.isSlot || awc.isbetgame || awc.istwain || awc.isPoker || awc.isSN || awc.isSport || awc.isBo || awc.isBoDirect) {
      if (this.amancasinoBlocked || this.betgamescasinoBlocked) {
        this.toastr.errorMsg('This Casino is blocked by upper level.')
      } else {
        this.router.navigate([awc.Route]);
      }
    }
  }

  listCasinoTable() {
    this.shareService.casinoList$.subscribe((resp: any) => {
      if (resp) {
        this.casinoList = resp;
        $('#page_loading').css('display', 'none');
      }
    });
  }
  openAWC(gameType: any, platform: any, gameCode: any) {
    console.log(platform);

    // if (platform == 'YL' || this.accountInfo.currencyCode == 'INR' || this.accountInfo.currencyCode == 'BDT') {
    //   $('#YL').css('display', 'block');
    // }
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

    // if (platform != 'YL' && this.accountInfo.currencyCode != 'INR' && this.accountInfo.currencyCode != 'BDT') {
      this.casinoapiService.awcAuth(data).subscribe((resp: any) => {
        if (resp.errorCode == 0 && resp.url) {
          window.open(resp.url, "_self");
        } else {
          this.toastr.errorMsg(resp.errorDescription);
        }
        setTimeout(()=>{
          this.isAuthPending = false;
        },1000)
      }, err => {
        this.isAuthPending = false;
      }
      )
    // }
  }
  WLIDMapping(errorDescription: string): number {
    const match = errorDescription.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }
  opengameBODirect(o:any){
    $('#page_loading').css('display', 'flex');

    this.gameCode = o
    let data = {
      "userName": this.accountInfo.userName,
      "gameId": this.gameCode,
      "externalUrl": window.origin,
    }
    // console.log(data)
    this.casinoapiService.boAuth(data).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        resp.url = this.removeParams('table_id', resp.url);
        resp.url = this.removeParams('game_id', resp.url);
        resp.url = this.removeParams('identifier', resp.url);
        resp.url = this.removeParams('limit_id', resp.url);
        resp.url = this.removeParams('operatorId', resp.url);
        resp.url = this.removeParams('category', resp.url);

        setTimeout(() => {
          $('#page_loading').css('display', 'none');
        }, 1000)
        window.open(resp.url, "_self");
      } else {
        this.toastr.errorMsg(resp.errorDescription); 
      }

      $('#page_loading').css('display', 'none');
    })
  }
  opengameBO(o:any){
    $('#page_loading').css('display', 'flex');

    this.gameCode = o
    let data = {
      "userName": this.accountInfo.userName,
      "gameId": this.gameCode,
      "externalUrl": window.origin,
    }
    // console.log(data)
    this.casinoapiService.boAuth(data).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        window.open(resp.url, "_self");
      } else {
        this.toastr.errorMsg(resp.errorDescription); 
      }

      $('#page_loading').css('display', 'none');
    })
  }
  hideOverlayInfo(value) {
    if (this.isAuthPending_direct) {
      return;
    }
    this.isAuthPending_direct = true;
    this.casinoapiService.awcAuth(this.awcOpenGame).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        window.open(resp.url, "_self");
      } else {
        alert(resp.errorDescription);
      }
      setTimeout(()=>{
        this.isAuthPending_direct = false;
      },1000)
    }, err => {
      this.isAuthPending_direct = false;
    }
    )
    $('#YL').css('display', 'none');
    $(value).fadeOut();
  }
  getAWC_table() {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
    let awcData = []
    this.shareService.listawcsLocal$.subscribe((resp) => {
      // console.log(resp)
      if (resp) {
        this.awc_siteName_list = resp
        this.awc_siteName_list.forEach(element2 => {
          if (element2.siteName == this.siteName) {
            awcData.push(element2)
            this.AWC_games = awcData[0].games
            this.AWC_games.forEach(game => {
              if (this.isLogin) {
                game['isEnable'] = false;
              } else {
                game['isEnable'] = true;
              }
              if (game.isbetgame || game.isSN || game.isSN_direct || game.isPoker || game.isSlot || game.istwain || game.isSport || game.isHorse || game.isGrey || game.isStatic||game.isBo || game.isBoDirect) {
                game['isEnable'] = true;
              }
            });

          }
        });
        // console.log(this.AWC_games)
        this.getAWCProvers();
      }

    })
  }

  getAWCProvers() {
    this.shareService._listawcs$.subscribe((resp: any) => {
      if (resp) {
        // console.log(this.AWC_games);

        this.AWC_games.forEach(element2 => {

          resp.result.forEach((element, index) => {
            if (element.Platform == element2.Platform) {
              element2['isEnable'] = true;
            } else {
              // console.log('not matched')
            }
          });

        });
        // console.log(this.AWC_games)
        // this.shareService.shareawcLocalList(this.AWC_games);

      }
    })
  }

  open_direct_sn(providerCode, gameCode) {
    $('#page_loading').css('display', 'flex');

    if (this.isAuthPending_sn) {
      return;
    }
    this.isAuthPending_sn = true;

    let backurldomain = window.origin;
    let authData = {
      "token": this.token,
      "backUrl": backurldomain,
      "gameCode": gameCode,
      "providerCode": providerCode,

    }
  }

  listCasinoProduct() {
    if (!this.isLogin) {
      return;
    }
    this.apiService.listCasinoProduct().subscribe((resp: any) => {
      if (resp.result) {
        this.AWC_games.forEach(element2 => {
          resp.result.forEach((element, index) => {
            // console.log(element2);
            // console.log(element);
            if (element.product == element2.prod_name) {
              element2['isEnable'] = true;
            } else {
              return
            }
          });
        });
      }
    })
  }
  toggleFavourite(event) {
    // this.dfService.ToggleFavourite(event.mtBfId, false);
  }

  trackBySport(index: number, item: any) {
    return item.eventTypeId;
  }

  trackByEvent(index: number, item: any) {
    return item.eventId;
  }

  showOverlayInfo(value) {
    $(value).css('display', 'flex');
  }
  // hideOverlayInfo(value) {
  //   $(value).fadeOut();
  // }

  showupdateTerm() {
    // console.log('uuuuu')
    // $('#Evolution').css('display', 'block');
    if (!this.tokenService.getCasBanner()) {
      $('#Evolution').css('display', 'block');
      $('#marketing').css('display', 'block');


    } else {
      $('#Evolution').css('display', 'none');
      $('#marketing').css('display', 'block');

    }
    // var is_already_Show = sessionStorage.getItem('alreadyshow');
    // if (!is_already_Show) {
    //   sessionStorage.setItem('alreadyshow', 'already shown')
    //   $('#Evolution').css('display', 'none');
    // } else {
    //   $('#Evolution').css('display', 'block');
    // }


  }

  HideupdateTerm() {
    this.tokenService.setCasBanner(true)
    $('#Evolution').css('display', 'none');
    $('#marketing').css('display', 'none');



  }
  removeParams(key: string, sourceURL: string) {
    const regex = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const url = sourceURL.replace(regex, '$1');
    return url.replace(/&$/, '');
  }

  removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
      param,
      params_arr = [],
      queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split("=")[0];
        if (param === key) {
          params_arr.splice(i, 1);
        }
      }
      if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
  }


  awc_login_direct(prod_code, prod_type, prod_name, game_code) {
    if (!this.isLogin) {
      return;
    }
    if (!prod_code || !prod_type) {
      return;
    }
    if (this.isAuthPending) {
      return;
    }
    this.isAuthPending = true;

    $('#page_loading').css('display', 'flex');


    // setTimeout(() => {
    this.apiService.getAuthCasino(this.accountInfo.userName, this.accountInfo.userId, prod_code, prod_type).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        resp.url = JSON.parse(resp.url)
      }

      // if (game_code && prod_name == 'KINGMAKER' && resp.url) {
      //   resp.url = this.removeParam('gameForbidden', resp.url);
      //   resp.url = resp.url + '&gameCode=' + game_code + '&isLaunchGame=true&isLaunchGameTable=false';
      // }
      if (game_code && (prod_name == 'KINGMAKER') && resp.url) {
        resp.url = this.removeParam('gameForbidden', resp.url);
        resp.url = resp.url + '&gameCode=' + game_code + '&isLaunchGame=true&isLaunchGameTable=false';
      }
      if (game_code && (prod_name == 'JILI') && resp.url) {
        resp.url = this.removeParam('gameForbidden', resp.url);
        resp.url = this.removeParam('gameType', resp.url);
        // resp.url = this.removeParam('isMobileLogin', resp.url);
        resp.url = resp.url + '&isMobileLogin=true&gameType=TABLE&gameCode=' + game_code + '&isLaunchGame=true&isLaunchGameTable=false';
      }
      if (game_code && (prod_name == 'JDB') && resp.url) {
        resp.url = this.removeParam('gameForbidden', resp.url);
        resp.url = resp.url + '&gameCode=' + game_code + '&isLaunchGame=true&isLaunchGameTable=false';
      }
      // alert(resp.url)

      if (resp.errorCode == 0 && resp.url) {
        // window.open(JSON.parse(resp.url), '_blank');
        window.open(resp.url, "_self");

      } else {
        this.toastr.errorMsg(resp.errorDescription);
      }
      this.isAuthPending = false;
      $('#page_loading').css('display', 'none');

    }, err => {
      this.isAuthPending = false;
      $('#page_loading').css('display', 'none');

    })
    // },1500)
  }

  get f() {
    return this.LoginForm.controls;
  }

  getDomainName(hostName) {
    let formatedHost = "";
    let splithostName = hostName.split('.');
    if (splithostName.length > 2) {
      formatedHost = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
    } else {
      formatedHost = hostName.split('//')[1]
    }
    return formatedHost;
  }
  getImg() {
    this.loginService
      .getImg()
      .subscribe((response: { img: string; log: string }) => {
        document
          .getElementById('authenticateImage')
          .setAttribute('src', this.getSecureImage(response.img));
        this.LoginForm.get('log').setValue(response.log);
      });
  }

  getSecureImage(img) {
    return `data:image/jpeg;base64, ${img}`;
  }

  Login() {
    this.submitted = true;
    // console.log(this.LoginForm)

    if (!this.LoginForm.valid) {
      return;
    }

    if (this.isPendingLogin) {
      return;
    }
    this.isPendingLogin = true;

    this.loginService
      .login(this.LoginForm.value)
      .subscribe((resp: any) => {
        if (resp.errorCode === 0) {

          if (this.siteName == "betfair21" || this.siteName == "betswiz") {
            resp.result[0]['currencyCode'] = "";
          }

          this.tokenService.setToken(resp.result[0].token);
          this.tokenService.setUserInfo(resp.result[0]);
          this.result = resp.errorDescription;
          this.LoginForm.reset();
          $('#marketing').css('display', 'none');
          if (resp.result[0].newUser == 1 && this.AferLoginChangePassword) {
            this.router.navigate(['change_pass']);
          } else {
            this.router.navigate([this.homeCom]);
          }
        } else {
          if (!resp.errorDescription) {
            resp.errorDescription = "Username or password is wrong"
          }
          this.result = resp.errorDescription;

        }
        this.submitted = false;
        this.isPendingLogin = false;

      }, err => {
        this.submitted = false;
        this.isPendingLogin = false;
      }
      );

  }
  public scrollRight1(): void {
    this.tab1.nativeElement.scrollTo({ left: (this.tab1.nativeElement.scrollLeft + 200), behavior: 'smooth' });
  }

  public scrollLeft1(): void {
    this.tab1.nativeElement.scrollTo({ left: (this.tab1.nativeElement.scrollLeft - 200), behavior: 'smooth' });
  }
  dosomething() {
    this.loadrainbow = true
  }
  ngOnDestroy() {
    this.sportSubscription.unsubscribe();
    if (this.activePlayerTimer) {
      clearInterval(this.activePlayerTimer);
    }
  }

}

