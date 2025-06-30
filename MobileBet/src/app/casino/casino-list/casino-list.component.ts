import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { ClientApiService } from 'src/app/services/client-api.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-casino-list',
  templateUrl: './casino-list.component.html',
  styleUrls: ['./casino-list.component.scss'],
})
export class CasinoListComponent implements OnInit {
  casinoList: any = [];
  casinoLists: any = [];
  isLogin: boolean = false;
  token: string;
  amanCasinoList: any = [];
  providerList: any = [];
  providerCode = "SN";
  provider = "ezugi";

  casinoType = 'awc'
  selectedtab: string = "awc";
  accountInfo: any;
  isInrCurrency = false;
  isAuthPending: boolean = false;
  isAuthPending_sn: boolean = false;
  @ViewChild('tab1', { read: ElementRef }) public tab: ElementRef<any>;
  @ViewChild('tab2', { read: ElementRef }) public tab1: ElementRef<any>;
  slotUrl: any;
  siteName = environment.siteName;
  slotfilter: any;
  loadrainbow: boolean = false;
  loadrainbowslot: boolean = false;
  gameCode: any;
  Update: any;
  isaura: boolean = false;
  AWClists: any;
  awclists: any;
  Platform: string;
  data: any[];
  awcGames: any;
  awcPlatform: any;
  providers: any
  blueocean: any
  listgame: any
  GameStatus :any
  isPoker = environment.isPoker
  isAuthPending_direct: boolean = false;

  amancasinoBlocked: any;
  betgamescasinoBlocked: any;
  diamondcasinoBlocked: any;

  awcOpenGame: { userName: any; gameType: any; isMobile: boolean; externalUrl: string; platform: any; gameCode: any; };

  constructor(
    private shareService: ShareDataService,
    private main: MainService,
    private sanitizer: DomSanitizer,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private apiService: ClientApiService,
    private toastr: ToastMessageService,
    private router: Router,
    private casinoapiService: CasinoApiService
  ) {
    $('#page_loading').css('display', 'flex');
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

    this.route.params.subscribe(params => {
      if (params.casinoType) {
        this.casinoType = params.casinoType;
        // console.log(this.casinoType)
      }
      if (this.casinoType == 'aura') {
        this.selectedtab = 'indian'
      }
      if (this.casinoType == 'dia') {
        this.selectedtab = 'diamond'
      }
      if (this.casinoType == 'SN') {
        this.selectedtab = 'SN'
      }
      if (this.casinoType == 'EZ') {
        this.selectedtab = 'EZ'
      }
      if (this.casinoType == 'EV') {
        this.selectedtab = 'EV'
      }
      if (this.casinoType == 'awc') {
        this.selectedtab = 'awc'
      }
      if (this.casinoType == 'bo') {
        this.selectedtab = 'bo'
      }
      if(this.casinoType == 'bo'){
        this.bolistProvider();
      }

    })

    this.shareService.getgameStatus$.subscribe((data) => {
      if (data) {
        this.amancasinoBlocked = data?.some(market => market?.sport === 'amancasino' && market?.blocked);
        this.betgamescasinoBlocked = data?.some(market => market?.sport === 'betgames' && market?.blocked);
        this.diamondcasinoBlocked = data?.some(market => market?.sport === 'diamondcasino' && market?.blocked);
      }
    })

    this.shareService.getgameStatus$.subscribe((resp) =>{
      this.GameStatus = resp
    })

    if (this.isLogin) {
      this.main.apis$.subscribe((res) => {
        $('#page_loading').css('display', 'flex');
        setTimeout(() => {
          this.listCasinoTable();
        }, 200)
      });
    }
  }

  ngOnInit(): void {
    this.getlanguages();
    this.amanCasinoList = [
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

    if (this.tokenService.getToken()) {
      this.isLogin = true;
      this.main.apis$.subscribe((res) => {
        this.listCasinoTable();
        this.UserDescription();
        this.route.params.subscribe(params => {
          this.Platform = params.Platform;
        })
        this.AWCList();
      });

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
  showalertmsg(gameStatus) {
    if (gameStatus.blocked) {
      this.toastr.errorMsg('this casino is blocked by upper lavel.')
      
    }
  }

  bolistProvider() {
    this.casinoapiService.bolist().subscribe((res: any) => {
      this.blueocean = res.result;
      this.blueocean?.sort((a, b) => a?.provider?.localeCompare(b?.provider));
      const firstMatchingElement = this.blueocean.find(element => {
        return true;
      });
      if (firstMatchingElement) {
        this.bogamesdata(firstMatchingElement.provider);
      }
    });
  }
  
  bogamesdata(provider) {
    this.provider = provider
    this.casinoapiService.boGames(provider).subscribe((res: any) => {
      this.listgame = res
    })
  }
  changeTab(tabType) {
    this.selectedtab = tabType;
  }

  listProviders() {
    this.casinoapiService.listProviders().subscribe((resp: any) => {
      this.providerList = resp.result;
    })
  }
  openExtLobby(params) {
    this.token = this.tokenService.getToken();
    this.gameCode = params.code;
    this.providerCode = params.providerCode;
    let backurldomain = window.origin;
    if (this.isAuthPending_sn) {
      return;
    }
    this.isAuthPending_sn = true;

  }

  AWCList() {
    this.shareService._listawcs$.subscribe((resp: any) => {
      if (resp) {
        this.AWClists = resp.result
        // console.log(this.AWClists);
        this.AWClists.forEach(element => {
          if (element.Platform == this.Platform) {
            this.AWCFilter(element)
          }
        });
        $('#page_loading').css('display', 'none');
      }
    })
  }
  AWCFilter(filter) {
    // console.log(filter);

    this.awcGames = filter.Games
    this.awcPlatform = filter.Platform

  }

  openAWC(gameType: any, platform: any, gameCode: any) {
    // console.log(platform);

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
    // console.log(this.awcOpenGame);

    // if (platform != 'YL' && this.accountInfo.currencyCode != 'INR' && this.accountInfo.currencyCode != 'BDT') {
    this.casinoapiService.awcAuth(data).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        window.open(resp.url, "_self");
      } else {
        this.toastr.errorMsg(resp.errorDescription); 


      }
      setTimeout(() => {
        this.isAuthPending = false;
      }, 1000)
    }, err => {
      this.isAuthPending = false;
    }
    )
    // }
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
      setTimeout(() => {
        this.isAuthPending_direct = false;
      }, 1000)
    }, err => {
      this.isAuthPending_direct = false;
    }
    )
    $('#YL').css('display', 'none');
    $(value).fadeOut();
  }

  public scrollRight(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft + 200), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft - 200), behavior: 'smooth' });
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
  opnslotgame(o: any) {
    this.gameCode = o
  }

  opentable(id) {
    if (this.amancasinoBlocked) {
      this.toastr.errorMsg('This Casino is blocked by upper level.');
    } else {
      this.router.navigate([`/tpp/${id}`]);
    }
  }
  
  openDiamond(casino) {
    if (this.diamondcasinoBlocked) {
      this.toastr.errorMsg('This Casino is blocked by upper level.');
    } else {
      const newRoute = ['casino/cas/dia/tp', casino.tableId, casino.tableName, casino.oddsUrl.replace('/d_rate/', '')];
      this.router.navigate(newRoute);
    }
  }

  opengameBO(o: any) {
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
  WLIDMapping(errorDescription: string): number {
    const match = errorDescription.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  listCasinoTable() {
    this.shareService.casinoList$.subscribe((resp: any) => {
      if (resp) {
        this.casinoList = resp;
        $('#page_loading').css('display', 'none');
      }
    });
    // this.gamesService.listCasinoTable().subscribe((resp: any) => {
    //   if (resp.result) {
    //     this.casinoList = resp.result[0].tables;
    //   }
    //   $('#page_loading').css('display', 'none');

    // })
  }
  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    if (this.accountInfo) {
      if (this.accountInfo?.currencyCode == 'INR') {
        this.isaura = true
        this.isInrCurrency = true;
      }
    }

    // console.log(this.accountInfo)
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
  listCasinoProduct() {
    if (!this.isLogin) {
      return;
    }
    this.apiService.listCasinoProduct().subscribe((resp: any) => {
      if (resp.result) {
        // console.log(resp.result)
        let cricbuzzerawc_Vnd = [];
        let awcCasinoListsAll = [];

      }
    })
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
    this.apiService.getAuthCasino(this.accountInfo?.userName, this.accountInfo?.userId, prod_code, prod_type).subscribe((resp: any) => {
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
  trackByFn(item, index) {
    return item.matchId;
  }
}
