import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientApiService } from 'src/app/services/client-api.service';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { LoginService } from 'src/app/services/login.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-international-casino',
  templateUrl: './international-casino.component.html',
  styleUrls: ['./international-casino.component.scss']
})
export class InternationalCasinoComponent implements OnInit {

  siteName: string = environment.siteName;
  isCasinoTab = environment.isCasinoTab;
  casinoList: any = [];
  casinoLists: any = [];
  casinoListlist: any = [];
  casinoListssports365: any = [];
  result: any
  isExchangeGames = environment.isExchangeGames;
  isAuthPending: boolean = false;


  //cricbuzzer list
  cricbuzzerawcList = [
    { sr: 9, prod_code: '117', prod_type: '2', name: "KINGMAKER", prod_name: "KINGMAKER", prod_type_name: 'SLOT' },
    { sr: 2, prod_code: '3', prod_type: '1', name: "AE Sexy", prod_name: "SEXY BACCARAT", prod_type_name: 'LIVE CASINO' },
    // { sr: 33, prod_code: '98', prod_type: '1', name: "ORIENTAL GAMING", prod_name: "ORIENTAL GAMING", prod_type_name: 'LIVE CASINO' }, //product closed
    { sr: 13, prod_code: '1006', prod_type: '1', name: "EVOLUTION GAMING", prod_name: "EVOLUTION GAMING", prod_type_name: 'LIVE CASINO' },
    { sr: 9, prod_code: '3', prod_type: '1', name: "SEXY BACCARAT", prod_name: "SEXY BACCARAT", prod_type_name: 'LIVE CASINO' },
    { sr: 3, prod_code: '6', prod_type: '1', name: "Pragmatic Play", prod_name: "PRAGMATIC", prod_type_name: 'LIVE CASINO,SLOT' },
    { sr: 29, prod_code: '70', prod_type: '1', name: "Sexy Dragon Tiger", prod_name: "WM CASINO", prod_type_name: 'LIVE CASINO' },
    { sr: 14, prod_code: '97', prod_type: '1', name: "EBET", prod_name: "EBET", prod_type_name: 'LIVE CASINO' },
    { sr: 7, prod_code: '93', prod_type: '1', name: "EZUGI", prod_name: "EZUGI", prod_type_name: 'LIVE CASINO' },
    { sr: 9, prod_code: '35', prod_type: '2', name: "MICROGAMING", prod_name: "MICROGAMING", prod_type_name: 'LIVE CASINO,SLOT' },
    { sr: 9, prod_code: '7', prod_type: '1', name: "ALLBET", prod_name: "ALLBET", prod_type_name: 'LIVE CASINO' },
    { sr: 10, prod_code: '5', prod_type: '1', name: "BIG GAMING", prod_name: "BIG GAMING", prod_type_name: 'LIVE CASINO,SLOT,LOTTO,CARD AND BOARD,FISH HUNTER' },
    { sr: 20, prod_code: '79', prod_type: '1', name: "BBIN", prod_name: "BBIN", prod_type_name: 'LIVE CASINO,SLOT,SPORTBOOK' },
    { sr: 9, prod_code: '20', prod_type: '1', name: "KING855", prod_name: "KING855", prod_type_name: 'LIVE CASINO' },
    { sr: 11, prod_code: '94', prod_type: '1', name: "VENUS", prod_name: "VENUS", prod_type_name: 'LIVE CASINO' },
    { sr: 33, prod_code: '151', prod_type: '1', name: "GAMEPLAY", prod_name: "GAMEPLAY", prod_type_name: 'LIVE CASINO,SLOT' },
    { sr: 33, prod_code: '92', prod_type: '1', name: "FGG", prod_name: "FGG", prod_type_name: 'LIVE CASINO' },
    { sr: 33, prod_code: '72', prod_type: '8', name: "Horse Grey Sportsbook", prod_name: "CITIBET", prod_type_name: 'OTHERS' },
    { sr: 12, prod_code: '146', prod_type: '5', name: "1G Poker", prod_name: "1G Poker", prod_type_name: 'LIVE CASINO,CARD AND BOARD' },
    { sr: 26, prod_code: '17', prod_type: '3', name: "Sportbook", prod_name: "M8 SPORT", prod_type_name: 'SPORTBOOK' },
    { sr: 9, prod_code: '39', prod_type: '2', name: "CQ9", prod_name: "CQ9", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 4, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 6, prod_code: '105', prod_type: '5', name: "KAI YUAN", prod_name: "KAI YUAN", prod_type_name: 'CARD AND BOARD' },
    { sr: 1, prod_code: '41', prod_type: '2', name: "JDB", prod_name: "JDB", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 27, prod_code: '11', prod_type: '2', name: "ACE333", prod_name: "ACE333", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '144', prod_type: '2', name: "FUNKY GAME", prod_name: "FUNKY GAME", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '129', prod_type: '2', name: "AMEBA", prod_name: "AMEBA", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '125', prod_type: '2', name: "FUN GAMING", prod_name: "FUN GAMING", prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '27', prod_type: '2', name: "918KISS H5", prod_name: "918KISS H5", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '110', prod_type: '2', name: "3WIN8", prod_name: "3WIN8", prod_type_name: 'SLOT' },

  ]
  awcCasinoLists_all = [
    { sr: 9, prod_code: '117', prod_type: '2', name: "KINGMAKER", prod_name: "KINGMAKER", prod_type_name: 'SLOT' , isBig: true },
    { sr: 13, prod_code: '1006', prod_type: '1', name: "EVOLUTION GAMING", prod_name: "EVOLUTION GAMING", prod_type_name: 'LIVE CASINO' },
    { sr: 2, prod_code: '3', prod_type: '1', name: "SEXY BACCARAT", prod_name: "SEXY BACCARAT", prod_type_name: 'LIVE CASINO' },
    { sr: 10, prod_code: '5', prod_type: '1', name: "BIG GAMING", prod_name: "BIG GAMING", prod_type_name: 'LIVE CASINO,SLOT,LOTTO,CARD AND BOARD,FISH HUNTER' },
    { sr: 11, prod_code: '94', prod_type: '1', name: "VENUS", prod_name: "VENUS", prod_type_name: 'LIVE CASINO' },
    { sr: 1, prod_code: '41', prod_type: '2', name: "JDB", prod_name: "JDB", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 12, prod_code: '146', prod_type: '5', name: "1G Poker", prod_name: "1G Poker", prod_type_name: 'LIVE CASINO,CARD AND BOARD' },
    { sr: 14, prod_code: '97', prod_type: '1', name: "EBET", prod_name: "EBET", prod_type_name: 'LIVE CASINO' },
    { sr: 15, prod_code: '7', prod_type: '1', name: "ALLBET", prod_name: "ALLBET", prod_type_name: 'LIVE CASINO' },
    // { sr: 29, prod_code: '70', prod_type: '1', name: "WM CASINO", prod_name: "WM CASINO", prod_type_name: 'LIVE CASINO' },
    { sr: 3, prod_code: '6', prod_type: '1', name: "PRAGMATIC", prod_name: "PRAGMATIC", prod_type_name: 'LIVE CASINO,SLOT', isBig: true },
    { sr: 28, prod_code: '20', prod_type: '1', name: "KING855", prod_name: "KING855", prod_type_name: 'LIVE CASINO' },
    { sr: 30, prod_code: '19', prod_type: '1', name: "DREAM GAMING", prod_name: "DREAM GAMING", prod_type_name: 'LIVE CASINO' },
    { sr: 20, prod_code: '79', prod_type: '1', name: "BBIN", prod_name: "BBIN", prod_type_name: 'LIVE CASINO,SLOT,SPORTBOOK' },
    { sr: 4, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 33, prod_code: '151', prod_type: '1', name: "GAMEPLAY", prod_name: "GAMEPLAY", prod_type_name: 'LIVE CASINO,SLOT' },
    { sr: 33, prod_code: '35', prod_type: '1', name: "MICROGAMING", prod_name: "MICROGAMING", prod_type_name: 'LIVE CASINO,SLOT' },
    { sr: 23, prod_code: '39', prod_type: '2', name: "CQ9", prod_name: "CQ9", prod_type_name: 'LIVE CASINO,SLOT,FISH HUNTER' },
    { sr: 17, prod_code: '107', prod_type: '6', name: "FC FISHING", prod_name: "FC FISHING", prod_type_name: 'FISH HUNTER' },
    { sr: 21, prod_code: '48', prod_type: '2', name: "BLUEPRINT", prod_name: "BLUEPRINT", prod_type_name: 'SLOT' },
    { sr: 24, prod_code: '126', prod_type: '2', name: "DRAGOON SOFT (DG)", prod_name: "DRAGOON SOFT (DG)", prod_type_name: 'SLOT' },
    { sr: 26, prod_code: '17', prod_type: '3', name: "M8 SPORT", prod_name: "M8 SPORT", prod_type_name: 'SPORTBOOK' },
    { sr: 31, prod_code: '27', prod_type: '2', name: "918KISS H5", prod_name: "918KISS H5", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '110', prod_type: '2', name: "3WIN8", prod_name: "3WIN8", prod_type_name: 'SLOT' },
    { sr: 27, prod_code: '11', prod_type: '2', name: "ACE333", prod_name: "ACE333", prod_type_name: 'SLOT' },
    { sr: 5, prod_code: '52', prod_type: '2', name: "YL FISHING",prod_name: "YL FISHING", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 6, prod_code: '105', prod_type: '5', name: "KAI YUAN",prod_name: "KAI YUAN", prod_type_name: 'CARD AND BOARD' },
    { sr: 8, prod_code: '106', prod_type: '6', name: "SEA GAMING",prod_name: "SEA GAMING", prod_type_name: 'FISH HUNTER' },
    { sr: 16, prod_code: '47', prod_type: '6', name: "4TH PLAYER",prod_name: "4TH PLAYER", prod_type_name: 'FISH HUNTER' },
    { sr: 18, prod_code: '24', prod_type: '2', name: "918KISS",prod_name: "918KISS", prod_type_name: 'SLOT' },
    { sr: 19, prod_code: '142', prod_type: '2', name: "918KISS 2",prod_name: "918KISS 2", prod_type_name: 'SLOT' },
    { sr: 22, prod_code: '67', prod_type: '2', name: "CLUBSUNCITY",prod_name: "CLUBSUNCITY", prod_type_name: 'SLOT' },

    { sr: 9, prod_code: '117', prod_type: '2', name: "SCard Poker", prod_name: "KINGMAKER", game_code: 'KM-TABLE-049', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "BACCARAT", prod_name: "KINGMAKER", game_code: 'KM-TABLE-049', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "Color Game", prod_name: "KINGMAKER", game_code: 'KM-TABLE-050', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "Sicbo", prod_name: "KINGMAKER", game_code: 'KM-TABLE-015', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "7Up 7Down", prod_name: "KINGMAKER", game_code: 'KM-TABLE-028', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "Coin Toss", prod_name: "KINGMAKER", game_code: 'KM-TABLE-036', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "Card Hilow", prod_name: "KINGMAKER", game_code: 'KM-TABLE-037', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "32 Cards", prod_name: "KINGMAKER", game_code: 'KM-TABLE-039', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "Card Matka", prod_name: "KINGMAKER", game_code: 'KM-TABLE-021', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "Number Matka", prod_name: "KINGMAKER", game_code: 'KM-TABLE-048', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "Andar bahar", prod_name: "KINGMAKER", game_code: 'KM-TABLE-032', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "BlackJack", prod_name: "KINGMAKER", game_code: 'KM-TABLE-038', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "Mine Sheeper", prod_name: "KINGMAKER", game_code: 'KM-TABLE-042', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "European Roulette", prod_name: "KINGMAKER", game_code: 'KM-TABLE-027', prod_type_name: 'SLOT', },
    { sr: 9, prod_code: '117', prod_type: '2', name: "Pok Deng", prod_name: "KINGMAKER", game_code: 'KM-TABLE-034', prod_type_name: 'SLOT', },
  ]
  cricbuzzerawcList_Vnd = [
    { sr: 9, prod_code: '117', prod_type: '2', name: "KINGMAKER", prod_name: "KINGMAKER", prod_type_name: 'SLOT' },
    // { sr: 33, prod_code: '98', prod_type: '1', name: "ORIENTAL GAMING", prod_name: "ORIENTAL GAMING", prod_type_name: 'LIVE CASINO' },//product closed
    { sr: 13, prod_code: '1006', prod_type: '1', name: "EVOLUTION GAMING", prod_name: "EVOLUTION GAMING", prod_type_name: 'LIVE CASINO' },
    { sr: 9, prod_code: '3', prod_type: '1', name: "SEXY BACCARAT", prod_name: "SEXY BACCARAT", prod_type_name: 'LIVE CASINO' },
    { sr: 29, prod_code: '70', prod_type: '1', name: "Sexy Dragon Tiger", prod_name: "WM CASINO", prod_type_name: 'LIVE CASINO' },
    { sr: 14, prod_code: '97', prod_type: '1', name: "EBET", prod_name: "EBET", prod_type_name: 'LIVE CASINO' },
    // { sr: 9, prod_code: '35', prod_type: '2', name: "MICROGAMING", prod_name: "MICROGAMING", prod_type_name: 'LIVE CASINO,SLOT' }, // not running
    // { sr: 9, prod_code: '7', prod_type: '1', name: "ALLBET", prod_name: "ALLBET", prod_type_name: 'LIVE CASINO' }, //prohibitted
    // { sr: 10, prod_code: '5', prod_type: '1', name: "BIG GAMING", prod_name: "BIG GAMING", prod_type_name: 'LIVE CASINO,SLOT,LOTTO,CARD AND BOARD,FISH HUNTER' }, //not running
    { sr: 20, prod_code: '79', prod_type: '1', name: "BBIN", prod_name: "BBIN", prod_type_name: 'LIVE CASINO,SLOT,SPORTBOOK' },
    { sr: 9, prod_code: '20', prod_type: '1', name: "KING855", prod_name: "KING855", prod_type_name: 'LIVE CASINO' },
    { sr: 33, prod_code: '151', prod_type: '1', name: "GAMEPLAY", prod_name: "GAMEPLAY", prod_type_name: 'LIVE CASINO,SLOT' },
    { sr: 33, prod_code: '92', prod_type: '1', name: "FGG", prod_name: "FGG", prod_type_name: 'LIVE CASINO' },
    { sr: 12, prod_code: '146', prod_type: '5', name: "1G Poker", prod_name: "1G Poker", prod_type_name: 'LIVE CASINO,CARD AND BOARD' },
    { sr: 26, prod_code: '17', prod_type: '3', name: "Sportbook1", prod_name: "M8 SPORT", prod_type_name: 'SPORTBOOK' },
    { sr: 9, prod_code: '39', prod_type: '2', name: "CQ9", prod_name: "CQ9", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 4, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 27, prod_code: '11', prod_type: '2', name: "ACE333", prod_name: "ACE333", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '144', prod_type: '2', name: "FUNKY GAME", prod_name: "FUNKY GAME", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '129', prod_type: '2', name: "AMEBA", prod_name: "AMEBA", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '125', prod_type: '2', name: "FUN GAMING", prod_name: "FUN GAMING", prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '27', prod_type: '2', name: "918KISS H5", prod_name: "918KISS H5", prod_type_name: 'SLOT' },

  ]
  cricbuzzerawcList_other = [
  { sr: 2, prod_code: '3', prod_type: '1', name: "AE Sexy", prod_name: "SEXY BACCARAT", prod_type_name: 'LIVE CASINO' },
  { sr: 3, prod_code: '6', prod_type: '1', name: "Pragmatic Play", prod_name: "PRAGMATIC", prod_type_name: 'LIVE CASINO,SLOT' },
  { sr: 7, prod_code: '93', prod_type: '1', name: "EZUGI", prod_name: "EZUGI", prod_type_name: 'LIVE CASINO' },
  { sr: 11, prod_code: '94', prod_type: '1', name: "VENUS", prod_name: "VENUS", prod_type_name: 'LIVE CASINO' },
  { sr: 33, prod_code: '72', prod_type: '8', name: "Horse Grey Sportsbook", prod_name: "CITIBET", prod_type_name: 'OTHERS' },
  { sr: 6, prod_code: '105', prod_type: '5', name: "KAI YUAN", prod_name: "KAI YUAN", prod_type_name: 'CARD AND BOARD' },
  { sr: 1, prod_code: '41', prod_type: '2', name: "JDB", prod_name: "JDB", prod_type_name: 'SLOT,FISH HUNTER' },
  { sr: 33, prod_code: '110', prod_type: '2', name: "3WIN8", prod_name: "3WIN8", prod_type_name: 'SLOT' },
  ]
  //end


  sportList: any = [];

  loader: boolean = false;
  isLogin: boolean = false;
  accountInfo: any;

  sportSubscription!: Subscription;


  LoginForm: FormGroup;
  submitted: boolean = false;
  isCaptcha = environment.isCaptcha;
  isPendingLogin: boolean = false;

  isNewCasino = false;
  isInrCurrency = false;
  loadrainbow: boolean=false;
  Update: any;
  constructor(
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    private apiService: ClientApiService,
    private main: MainService,
    private loginService: LoginService,
    private fb: FormBuilder,

  ) {

    this.isNewCasino = true;
    if (this.tokenService.getToken()) {
      this.isLogin = true;
      this.main.apis$.subscribe((res) => {
        $('#page_loading').css('display', 'block');


        this.listCasinoTable();
        this.UserDescription();
        this.listCasinoProduct();


      });
    } else {
     



    }
  }
  dosomething(){
    this.loadrainbow=true
  }

  ngOnInit() {
    this.getlanguages();
    this.sportWise();
    // this.showupdateTerm()
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
    if (this.accountInfo.currencyCode == 'INR') {
      this.isInrCurrency = true;
    }

    // console.log(this.accountInfo)
  }

  
  listCasinoTable() {
    $('#page_loading').css('display', 'block');

    this.shareService.casinoList$.subscribe((resp: any) => {
      if (resp) {
        this.casinoList = resp;
        $('#page_loading').css('display', 'none');
      }
    });
  }

  listCasinoProduct() {
    if (!this.isLogin) {
      return;
    }
    this.apiService.listCasinoProduct().subscribe((resp: any) => {
      if (resp.result) {
        // console.log(this.awcCasinoListTest)
        let awcCasinoList_Vnd = [];
        let awcCasinoLists_all = []
        let cricbuzzerawcList_Vnd= []
        let awcCasinoList_Vnd_test = [];


        let awcCasinoList = [];
        let awcCasinoListTest = [];
        let cricbuzzerawcList_other = [];


        let awcCasinoList_bdbet = [];
        let awcCasinoList_nayaludis = [];
        let awcCasinoLists_baji = [];
        let awcCasinoLists_velkiex = [];
        let awcCasinoList_worldexch = [];
        let awcCasinoList_palki = [];

        this.cricbuzzerawcList_Vnd.forEach(element2 => {
          resp.result.forEach((element, index) => {

            if (element.product == element2.prod_name || (!element2.prod_code && index == 0)) {
              cricbuzzerawcList_Vnd.push(element2);
            }
          });
        });
        this.awcCasinoLists_all.forEach(element2 => {
          resp.result.forEach((element, index) => {

            if (element.product == element2.prod_name || (!element2.prod_code && index == 0)) {
              awcCasinoLists_all.push(element2);
            }
          });
        });

        this.cricbuzzerawcList_other.forEach(element2 => {
          resp.result.forEach((element, index) => {

            if (element.product == element2.prod_name || (!element2.prod_code && index == 0)) {
              cricbuzzerawcList_other.push(element2);
            }
          });
        });

        this.cricbuzzerawcList_Vnd = cricbuzzerawcList_Vnd;
        this.awcCasinoLists_all = awcCasinoLists_all;

        this.cricbuzzerawcList_other = cricbuzzerawcList_other;





        // console.log(this.awcCasinoListTest)


      }
    })
  }

  sportWise() {
    $('#page_loading').css('display', 'block');
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportList = this.dfService.sportEventWise(data, 0);
        // this.sportList = this.sportList.filter(item => {
        //   return item.id < 10;
        // })
        // console.log(this.sportList);
        $('#page_loading').css('display', 'none');
        this.loader = true;
        this.showupdateTerm()
      }
    });
  }

  toggleFavourite(event: any) {
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

  hideOverlayInfo(value) {
    $(value).fadeOut();
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

    // setTimeout(() => {
    this.apiService.getAuthCasino(this.accountInfo.userName, this.accountInfo.userId, prod_code, prod_type).subscribe((resp: any) => {
      //   resp={
      //     "errorCode": 0,
      //     "errorDescription": null,
      //     "memberName": "vrnlnew100",
      //     "balance": 200.00,
      //     "prod_code": 146,
      //     "prod_type": 5,
      //     "url": "\"https://inter-gaming.com/server_selection/en/vrnlnew100/VI4FiqD928pikUe9gyCycq7h1qFlaN\""
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

      if (resp.errorCode == 0 && resp.url) {
        // window.open(JSON.parse(resp.url), '_blank');
        window.open(JSON.parse(resp.url), "_self");


      } else {
        alert(resp.errorDescription);
      }
      this.isAuthPending = false;

    }, err => {
      this.isAuthPending = false;

    })
    // },1500);
  }

  awc2_login_direct(prod_code, prod_type) {
    if (!this.isLogin) {
      return;
    }

    if (this.isAuthPending) {
      return;
    }
    this.isAuthPending = true;

    let data = {
      userName: this.accountInfo.userName,
      userId: this.accountInfo.userId,
      isMobile: true,
      platform: 'SEXYBCRT',
      gameType: 'LIVE',
      gameCode: 'MX-LIVE-001',
      externalUrl: ''
    }

    // setTimeout(() => {
    this.apiService.getAuthCasinoAWC(data).subscribe((resp: any) => {

      if (resp.errorCode == 0 && resp.url) {
        window.open(JSON.parse(resp.url), '_blank');
        // window.open(JSON.parse(resp.url), "_self");


      } else {
        alert(resp.errorDescription);
      }
      this.isAuthPending = false;

    }, err => {
      this.isAuthPending = false;

    })
    // },1500);
  }

  showupdateTerm() {
    // console.log('uuuuu')
    // $('#Evolution').css('display', 'block');
    if (!this.tokenService.getCasBanner()) {
      $('#Evolution').css('display', 'block');
      $('#marketing').css('display', 'block');


    } else {
      $('#Evolution').css('display', 'none');
      $('#marketing').css('display', 'none');

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

  get f() {
    return this.LoginForm.controls;
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

          // this.router.navigate(['highlight']);
          // window.location.href = "home";
          window.location.href = window.location.origin + window.location.pathname;
          $('#marketing').css('display', 'none');

        } else {
          if (!resp.errorDescription) {
            resp.errorDescription = "Username or password is wrong"
          }
          this.result = resp.errorDescription;
          if (this.isCaptcha) {
            this.getImg();
          }
        }
        this.submitted = false;
        this.isPendingLogin = false;
      }, err => {
        this.submitted = false;
        this.isPendingLogin = false;
      }
      );

  }
  getImg() {
    this.loginService
      .getImg()
      .subscribe((response: { img: string; log: string }) => {
        document
          .getElementById('authenticateImage')
          .setAttribute('src', this.getSecureImage(response.img));
        document
          .getElementById('loginBoxAuthenticateImage')
          .setAttribute('src', this.getSecureImage(response.img));
        this.LoginForm.get('log').setValue(response.log);
      });
  }
  getSecureImage(img) {
    return `data:image/jpeg;base64, ${img}`;
  }
  ngOnDestroy() {
    this.sportSubscription.unsubscribe();
  }
}
