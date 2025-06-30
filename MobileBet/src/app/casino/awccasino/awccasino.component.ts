import { Component, OnInit } from '@angular/core';
import { ClientApiService } from 'src/app/services/client-api.service';
import { MainService } from 'src/app/services/main.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-awccasino',
  templateUrl: './awccasino.component.html',
  // styleUrls: ['./awccasino.component.scss']
  styleUrls: ['./awccasino.component.scss']

})
export class AwccasinoComponent implements OnInit {


  isLogin: boolean = false;
  accountInfo: any;
  isAuthPending: boolean = false;
  isInrCurrency = false;

  selectedTab = "popular";

  awcCasinoLists = [
    //Live Casino
    { prod_code: '1006', prod_type: '1', name: "EVOLUTION GAMING", prod_name: "EVOLUTION GAMING", prod_type_name: 'LIVE CASINO' },
    { prod_code: '6', prod_type: '1', name: "PRAGMATIC", prod_name: "PRAGMATIC", prod_type_name: 'LIVE CASINO,SLOT' },
    { prod_code: '71', prod_type: '1', name: "PLAYTECH", prod_name: "PLAYTECH", prod_type_name: 'LIVE CASINO,SLOT' },
    { prod_code: '3', prod_type: '1', name: "SEXY BACCARAT", prod_name: "SEXY BACCARAT", prod_type_name: 'LIVE CASINO' },
    { prod_code: '94', prod_type: '1', name: "VENUS", prod_name: "VENUS", prod_type_name: 'LIVE CASINO' },
    { prod_code: '5', prod_type: '1', name: "BIG GAMING", prod_name: "BIG GAMING", prod_type_name: 'LIVE CASINO,SLOT,LOTTO,CARD AND BOARD,FISH HUNTER' },
    { prod_code: '97', prod_type: '1', name: "EBET", prod_name: "EBET", prod_type_name: 'LIVE CASINO' },
    { prod_code: '7', prod_type: '1', name: "ALLBET", prod_name: "ALLBET", prod_type_name: 'LIVE CASINO' },
    { prod_code: '20', prod_type: '1', name: "KING855", prod_name: "KING855", prod_type_name: 'LIVE CASINO' },
    { prod_code: '70', prod_type: '1', name: "WM CASINO", prod_name: "WM CASINO", prod_type_name: 'LIVE CASINO' },
    { prod_code: '19', prod_type: '1', name: "DREAM GAMING", prod_name: "DREAM GAMING", prod_type_name: 'LIVE CASINO' },
    { prod_code: '35', prod_type: '1', name: "MICROGAMING", prod_name: "MICROGAMING", prod_type_name: 'LIVE CASINO,SLOT' },
    { prod_code: '151', prod_type: '1', name: "GAMEPLAY", prod_name: "GAMEPLAY", prod_type_name: 'LIVE CASINO,SLOT' },
    { prod_code: '79', prod_type: '1', name: "BBIN", prod_name: "BBIN", prod_type_name: 'LIVE CASINO,SLOT,SPORTBOOK' },

    //live table 

    { sr: 9, prod_code: '117', prod_type: '12', name: "Horse Racing", prod_name: "KINGMAKER", game_code: 'KM-TABLE-048', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "SCard Poker", prod_name: "KINGMAKER", game_code: 'KM-TABLE-049', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Plinko", prod_name: "KINGMAKER", game_code: 'KM-TABLE-040', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Bonus Dice", prod_name: "KINGMAKER", game_code: 'KM-TABLE-043', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Keno", prod_name: "KINGMAKER", game_code: 'KM-TABLE-018', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Money King Roultte", prod_name: "KINGMAKER", game_code: 'KM-TABLE-045', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Sicbo", prod_name: "KINGMAKER", game_code: 'KM-TABLE-015', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "7Up 7Down", prod_name: "KINGMAKER", game_code: 'KM-TABLE-028', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Coin Toss", prod_name: "KINGMAKER", game_code: 'KM-TABLE-036', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Card Hilow", prod_name: "KINGMAKER", game_code: 'KM-TABLE-037', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "32 Cards", prod_name: "KINGMAKER", game_code: 'KM-TABLE-039', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Card Matka", prod_name: "KINGMAKER", game_code: 'KM-TABLE-021', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Number Matka", prod_name: "KINGMAKER", game_code: 'KM-TABLE-048', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Andar Bahar", prod_name: "KINGMAKER", game_code: 'KM-TABLE-032', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "BlackJack", prod_name: "KINGMAKER", game_code: 'KM-TABLE-038', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Mine Sheeper", prod_name: "KINGMAKER", game_code: 'KM-TABLE-042', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Bola Golek", prod_name: "KINGMAKER", game_code: 'KM-TABLE-035', prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '117', prod_type: '12', name: "Jhandi Munda", prod_name: "KINGMAKER", game_code: 'KM-TABLE-030', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '117', prod_type: '2', name: "Horse", prod_name: "KINGMAKER", game_code: 'KM-TABLE-048', prod_type_name: 'SLOT' },


    // { sr: 9, prod_code: '59', prod_type: '12', name: "Number King", prod_name: "JILI", game_code: 'JILI-TABLE-005', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Poker King", prod_name: "JILI", game_code: 'JILI-TABLE-006', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Big Small", prod_name: "JILI", game_code: 'JILI-TABLE-007', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Andar Bahar", prod_name: "JILI", game_code: 'JILI-TABLE-003', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Teenpatti", prod_name: "JILI", game_code: 'JILI-TABLE-001', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Rummy", prod_name: "JILI", game_code: 'JILI-TABLE-004', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Ak47", prod_name: "JILI", game_code: 'JILI-TABLE-002', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Irich Bingo", prod_name: "JILI", game_code: 'JILI-TABLE-008', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Callbreak", prod_name: "JILI", game_code: 'JILI-TABLE-009', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "7up 7down", prod_name: "JILI", game_code: 'JILI-TABLE-011', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Teenpatti Joker", prod_name: "JILI", game_code: 'JILI-TABLE-010', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Dragon Tiger", prod_name: "JILI", game_code: 'JILI-TABLE-012', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Callbreak Quick", prod_name: "JILI", game_code: 'JILI-TABLE-013', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Sicbo", prod_name: "JILI", game_code: 'JILI-TABLE-017', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Teenpatti 2020", prod_name: "JILI", game_code: 'JILI-TABLE-016', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Super Bingo", prod_name: "JILI", game_code: 'JILI-TABLE-018', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Fortune Bingo", prod_name: "JILI", game_code: 'JILI-TABLE-015', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '12', name: "Baccarat", prod_name: "JILI", game_code: 'JILI-TABLE-014', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '117', prod_type: '12', name: "Color Game", prod_name: "KINGMAKER", game_code: 'KM-TABLE-050', prod_type_name: 'SLOT' },



    //slots
    { prod_code: '117', prod_type: '2', name: "KINGMAKER", prod_name: "KINGMAKER", prod_type_name: 'SLOT' },
    { prod_code: '41', prod_type: '2', name: "JDB", prod_name: "JDB", prod_type_name: 'SLOT,FISH HUNTER' },
    { prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", prod_type_name: 'SLOT,FISH HUNTER' },
    { prod_code: '39', prod_type: '2', name: "CQ9", prod_name: "CQ9", prod_type_name: 'LIVE CASINO,SLOT,FISH HUNTER' },
    { prod_code: '48', prod_type: '2', name: "BLUEPRINT", prod_name: "BLUEPRINT", prod_type_name: 'SLOT' },
    { prod_code: '35', prod_type: '2', name: "MICROGAMING", prod_name: "MICROGAMING", prod_type_name: 'LIVE CASINO,SLOT' },
    { prod_code: '151', prod_type: '2', name: "GAMEPLAY", prod_name: "GAMEPLAY", prod_type_name: 'LIVE CASINO,SLOT' },
    { prod_code: '126', prod_type: '2', name: "DRAGOON SOFT", prod_name: "DRAGOON SOFT (DG)", prod_type_name: 'SLOT' },
    { prod_code: '27', prod_type: '2', name: "918KISS H5", prod_name: "918KISS H5", prod_type_name: 'SLOT' },
    { prod_code: '110', prod_type: '2', name: "3WIN8", prod_name: "3WIN8", prod_type_name: 'SLOT' },
    { prod_code: '11', prod_type: '2', name: "ACE333", prod_name: "ACE333", prod_type_name: 'SLOT' },
    { prod_code: '39', prod_type: '2', name: "CQ9", prod_name: "CQ9", prod_type_name: 'LIVE CASINO,SLOT,FISH HUNTER' },
    { prod_code: '79', prod_type: '2', name: "BBIN", prod_name: "BBIN", prod_type_name: 'LIVE CASINO,SLOT,SPORTBOOK' },
    { prod_code: '6', prod_type: '2', name: "PRAGMATIC", prod_name: "PRAGMATIC", prod_type_name: 'LIVE CASINO,SLOT' },

    // // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-SLOT-063', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-014', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-013', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-029', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-024', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-023', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-017', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-005', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-026', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-004', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-027', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-021', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-009', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-028', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-006', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-047', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-043', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-051', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-007', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-038', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-002', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-008', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-030', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-015', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-044', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-022', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-045', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-020', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-046', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-005', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-005', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-005', prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", game_code: 'JILI-TABLE-005', prod_type_name: 'SLOT' },







    //sportbook
    { prod_code: '17', prod_type: '3', name: "M8 SPORT", prod_name: "M8 SPORT", prod_type_name: 'SPORTBOOK' },
    { prod_code: '79', prod_type: '3', name: "BBIN", prod_name: "BBIN", prod_type_name: 'LIVE CASINO,SLOT,SPORTBOOK' },

    //Fishing
    { prod_code: '59', prod_type: '6', name: "JILI", prod_name: "JILI", prod_type_name: 'SLOT,FISH HUNTER' },
    { prod_code: '41', prod_type: '6', name: "JDB", prod_name: "JDB", prod_type_name: 'SLOT,FISH HUNTER' },

    { prod_code: '107', prod_type: '6', name: "FC FISHING", prod_name: "FC FISHING", prod_type_name: 'FISH HUNTER' },
    { prod_code: '39', prod_type: '6', name: "CQ9", prod_name: "CQ9", prod_type_name: 'LIVE CASINO,SLOT,FISH HUNTER' },
    { prod_code: '5', prod_type: '6', name: "BIG GAMING", prod_name: "BIG GAMING", prod_type_name: 'LIVE CASINO,SLOT,LOTTO,CARD AND BOARD,FISH HUNTER' },

    //Card and Board
    { prod_code: '146', prod_type: '5', name: "1G Poker", prod_name: "1G Poker", prod_type_name: 'LIVE CASINO,CARD AND BOARD' },



  ]
  constructor(
    private apiService: ClientApiService,
    private main: MainService,
    private tokenService: TokenService,
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
      this.main.apis$.subscribe((res) => {
        this.UserDescription();
        this.listCasinoProduct();
      })
    }
    $('#page_loading').css('display', 'none');
  }

  ngOnInit(): void {
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    if (this.accountInfo.currencyCode == 'INR') {
      this.isInrCurrency = true;
    }
    // console.log(this.accountInfo)
  }

  listCasinoProduct() {
    if (!this.isLogin) {
      return;
    }
    this.apiService.listCasinoProduct().subscribe((resp: any) => {
      if (resp.result) {
        // console.log(this.awcCasinoLists)
        let awcCasinoLists = [];


        this.awcCasinoLists.forEach(element2 => {
          resp.result.forEach((element, index) => {

            if (element.product == element2.prod_name || (!element2.prod_code && index == 0)) {
              awcCasinoLists.push(element2);
            }
          });
        });
        this.awcCasinoLists = awcCasinoLists;





        // console.log(this.awcCasinoLists)


      }
    })
  }

  selectTab(tab) {
    $('#page_loading').css('display', 'flex');

    this.selectedTab = tab;

    setTimeout(()=>{
      $('#page_loading').css('display', 'none');
    },300)
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

    // this.QuitCasino();
    $('#page_loading').css('display', 'flex');

    // this.QuitCasino();


    // setTimeout(() => {
    this.apiService.getAuthCasino(this.accountInfo.userName, this.accountInfo.userId, prod_code, prod_type).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        resp.url = JSON.parse(resp.url)
      }

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

      // alert(resp.url)

      if (resp.errorCode == 0 && resp.url) {
        // window.open(JSON.parse(resp.url), '_blank');
        window.open(resp.url, "_self");

      } else {
        alert(resp.errorDescription);
      }
      this.isAuthPending = false;
      $('#page_loading').css('display', 'none');

    }, err => {
      this.isAuthPending = false;
      $('#page_loading').css('display', 'none');

    })
    // },1500)
  }
}
