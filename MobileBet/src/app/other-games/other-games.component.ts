import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientApiService } from '../services/client-api.service';
import { DataFormatsService } from '../services/data-formats.service';
import { LoginService } from '../services/login.service';
import { MainService } from '../services/main.service';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-other-games',
  templateUrl: './other-games.component.html',
  styleUrls: ['./other-games.component.scss']
})
export class OtherGamesComponent implements OnInit {
  sportSubscription: Subscription;
  sportList = [];
  loader: boolean = false;
  highCom: any;
  siteName = environment.siteName;
  isLogin: boolean = false;
  isAuthPending: boolean = false;
  accountInfo: any;
  isInrCurrency = false;
  homeCom: any;

  constructor(
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private apiService: ClientApiService,
    private main: MainService,
    private loginService: LoginService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private router: Router,) {
    this.highCom = '/highlight';
    this.homeCom = '/dash';

    if (this.siteName == 'lc247' || this.siteName == 'lc365') {
      this.homeCom = '/Other-Games';
      this.highCom = '/sports';

    }
  }
  awcCasinoList_bdbet = [

    { name: "Kabaddi", prod_name: "Kabaddi", prod_type_name: 'Kabaddi', isBig: true, isSport: true, eventTypeId: 52 },
    { name: "Horse Racing", prod_name: "Horse Racing", prod_type_name: 'Horse Racing', isBig: true, isSport: true, eventTypeId: 7 },
    { sr: 1, prod_code: '41', clsname: 'jdb', prod_type: '2', name: "JDB", prod_name: "JDB", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 30, prod_code: '19', clsname: 'dream-gaming', prod_type: '1', name: "DREAM GAMING", prod_name: "DREAM GAMING", prod_type_name: 'LIVE CASINO' },
    { sr: 33, prod_code: '151', clsname: 'gameplay', prod_type: '1', name: "GAMEPLAY", prod_name: "GAMEPLAY", prod_type_name: 'LIVE CASINO,SLOT' },
    { sr: 23, prod_code: '39', clsname: 'cq9', prod_type: '2', name: "CQ9", prod_name: "CQ9", prod_type_name: 'LIVE CASINO,SLOT,FISH HUNTER' },
    { sr: 17, prod_code: '107', clsname: 'fc-fishing', prod_type: '6', name: "FC FISHING", prod_name: "FC FISHING", prod_type_name: 'FISH HUNTER' },
    { sr: 21, prod_code: '48', clsname: 'blueprint', prod_type: '2', name: "BLUEPRINT", prod_name: "BLUEPRINT", prod_type_name: 'SLOT' },
    { sr: 24, prod_code: '126', clsname: 'dragoon-soft-dg', prod_type: '2', name: "DRAGOON SOFT (DG)", prod_name: "DRAGOON SOFT (DG)", prod_type_name: 'SLOT' },
    { sr: 31, prod_code: '27', clsname: 'img-918kiss-h5', prod_type: '2', name: "918KISS H5", prod_name: "918KISS H5", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '110', clsname: 'img-3win8', prod_type: '2', name: "3WIN8", prod_name: "3WIN8", prod_type_name: 'SLOT' },

  ]
  ngOnInit(): void {
    this.sportWise();
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
    this.main.apis$.subscribe((res) => {
      this.listCasinoProduct();
      this.UserDescription();
    })
  }
  listCasinoProduct() {
    if (!this.isLogin) {
      return;
    }
    this.apiService.listCasinoProduct().subscribe((resp: any) => {
      if (resp.result) {
        // console.log(this.awcCasinoList_bdbet)
        let awcCasinoList_bdbet = [];


        this.awcCasinoList_bdbet.forEach(element2 => {
          resp.result.forEach((element, index) => {

            if (element.product == element2.prod_name || (!element2.prod_code && index == 0)) {
              awcCasinoList_bdbet.push(element2);
            }
          });
        });


        this.awcCasinoList_bdbet = awcCasinoList_bdbet;


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

    // this.QuitCasino();
    $('#page_loading').css('display', 'flex');

    // this.QuitCasino();


    // setTimeout(() => {
    this.apiService.getAuthCasino(this.accountInfo.userName, this.accountInfo.userId, prod_code, prod_type).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        resp.url = JSON.parse(resp.url)
      }

      if (game_code && prod_name == 'KINGMAKER' && resp.url) {
        resp.url = this.removeParam('gameForbidden', resp.url);
        resp.url = resp.url + '&gameCode=' + game_code + '&isLaunchGame=true&isLaunchGameTable=false';
      }

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
  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    if (this.accountInfo?.currencyCode == 'INR') {
      this.isInrCurrency = true;
    }
    // console.log(this.accountInfo)
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

      }
    });
  }
}
