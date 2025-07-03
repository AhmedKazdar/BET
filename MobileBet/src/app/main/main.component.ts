import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientApiService } from '../services/client-api.service';
import { DataFormatsService } from '../services/data-formats.service';
import { MainService } from '../services/main.service';
import { ScoreService } from '../services/score.service';
import { ShareDataService } from '../services/share-data.service';
import { SportsApiService } from '../services/sports-api.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  siteName = environment.siteName;

  stakeSettingData: any;
  allScoresData: any = [];

  loader: boolean = true;
  isBannerShow: boolean = true;
  isWhatsappShow: boolean = true;

  isLogin: boolean = false;

  isGameApiCall = true;

  intervalSub;
  language: any;
  range = "en";
  Alllanguage: any;
  Update: any;
  currentlanguage: string;
  selectedlang: any;
  isRemoveBfMarket = environment.isRemoveBfMarket;

  constructor(
    private mainService: MainService,
    private clientApi: ClientApiService,
    private sportsAPi: SportsApiService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private router: Router,
    private tokenService: TokenService,
    private scoreService: ScoreService,
  ) {

    if (this.tokenService.getLanguage()) {
      this.selectedlang = this.tokenService.getLanguage()
      this.selectlanguage(this.selectedlang)
    } else {
      this.selectlanguage('en')
    }
    let seconds = 300;
    if (this.tokenService.getToken()) {
      this.isLogin = true;
      seconds = 60;
    }
    this.mainService.apis$.subscribe((res) => {

      // console.log(res);
      this.sportWise();
      this.listCasinoTable();
      this.GetBetStakeSetting();
      this.intervalSub = setInterval(() => {
        this.sportWise();
      }, seconds * 1000);
    });

    // console.log(window)


    if (this.router.url == '/home' || this.router.url == '/dash' || this.router.url == '/highlight' || this.router.url == '/sports') {
      this.isBannerShow = true;
    }
    else {
      this.isBannerShow = false;
    }

    if (this.router.url.includes('/event') || this.router.url.includes('/tpp') || this.router.url.includes('/casino/cas/international/tp') || this.router.url.includes('/exchange')) {
      this.isWhatsappShow = false;
    }
    else {
      this.isWhatsappShow = true;
    }
    // window.scrollTo(0, 0);

    this.router.events.subscribe((event: NavigationStart) => {
      window.scrollTo(0, 0);
      if (event instanceof NavigationStart) {
        // console.log(event.url)
        $('#page_loading').css('display', 'flex');

        if (event.url == '/home' || event.url == '/dash' || event.url == '/highlight' || event.url == '/sports') {
          this.isBannerShow = true;
        }
        else {
          this.isBannerShow = false;
        }

        if (event.url.includes('/event') || event.url.includes('/tpp') || event.url.includes('/casino/cas/international/tp') || event.url.includes('/exchange')) {
          this.isWhatsappShow = false;
          var fc = document.getElementById('fc_frame');
          if (fc) {
            fc.style.display = "none";
          }
        }
        else {
          this.isWhatsappShow = true;
          var fc = document.getElementById('fc_frame');
          if (fc) {
            fc.style.display = "block";
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.getlanguages();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if (data != null) {
        this.Update = data
      }
      if (this.Update?.myaccount == "আমার অ্যাকাউন্ট") {
        $("#accountPopup").css('font-size', '9px');
      } else {
        $("#accountPopup").css('font-size', 'inherit');
      }
      // console.log(this.Update);

    })
  }
  selectlanguage(newValue) {
    this.getLanguage();
    this.range = newValue;
    if (this.siteName == "cricbuzzer" || this.siteName == 'cricbuzzerlive') {
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


  GetBetStakeSetting() {
    let accountInfo = this.tokenService.getUserInfo();
    if (!accountInfo) {
      this.stakeSettingData = [100, 500, 1000, 5000, 10000, 20000, 50000, 100000, 100, 500, 1000, 5000];
      this.shareService.shareStakeButton(this.stakeSettingData);
      this.getProfile();
      return;
    }

    if (accountInfo.stakeSetting) {
      this.stakeSettingData = accountInfo.stakeSetting.split(',');
    } else {

      if (this.siteName == "jeetfair") {
        this.stakeSettingData = [5, 10, 50, 100, 500, 1000, 5000, 10000, 5, 10, 50, 100];
      } else {
        this.stakeSettingData = [100, 500, 1000, 5000, 10000, 20000, 50000, 100000, 100, 500, 1000, 5000];
      }
    }
    this.stakeSettingData.forEach((element, index) => {
      this.stakeSettingData[index] = parseInt(element);
    });
    this.shareService.shareStakeButton(this.stakeSettingData);
  }

  getProfile() {
    if (!this.isLogin) {
      return;
    }
    this.clientApi.profile().subscribe((resp: any) => {
      if (resp.result) {
        if (this.siteName == "betfair21" || this.siteName == "betswiz") {
          resp.result[0]['currencyCode'] = "";
        }
        this.tokenService.setUserInfo(resp.result[0]);

        window.location.href = window.location.origin + window.location.pathname;

      }
    })
  }

  listCasinoTable() {
    if (!this.isLogin) {
      return;
    }
    this.clientApi.listCasinoTable().subscribe((resp: any) => {
      if (resp.result) {
        this.shareService.shareCasinoList(resp.result[0].tables);
      }
    })
  }

  hideVerify() {
    $('#verifyEmail').css('display', 'none');
  }

  sportWise() {
    if (!this.isGameApiCall) {
      return;
    }
    this.isGameApiCall = false;

    this.clientApi.listGames().subscribe((resp: any) => {
      if (resp.result) {
        if (resp.result) {
          resp.result.forEach((item: any) => {

            if (item.eventId == 31345701) {
              item.markets.push({ betDelay: 0, gameId: 430719080, isInPlay: 1, marketId: '1.145970106', marketName: 'Winner 2022', open: 1, status: 1 })
            }
            if (item.markets[0]) {
              item['marketId'] = item.markets[0].marketId;
            }
            if (item.sportsName == "Virtual Cricket") {
              item.sportsName = "cricket";
              item.sportId = "4";
              item.eventTypeId = "4";
              item['isVirtual'] = true;
              item['isBm'] = true;
            }
            if (item.sportsName == "Kabaddi") {
              item['isKabaddi'] = true;
              item['isBm'] = true;
              // item['isFancy'] = true;
            }
            if (item.sportsName == "Election") {
              item['isKabaddi'] = true;
              // item['isBm'] = true;
              item['isFancy'] = true;

            }

            if (item.premiumMain == 0) {
              item.premiumMain = true;
            } else {
              item.premiumMain = false;
            }

            // new field start
            if (this.isRemoveBfMarket) {
              if (item.matchOddsInplay1 == 0) {
                item.matchOddsInplay1 = true;
              } else {
                item.matchOddsInplay1 = false;
              }
              if (item.tiedMatchInplay1 == 0) {
                item.tiedMatchInplay1 = true;
                if (item.markets[0]) {
                  item.markets = item.markets.filter(function (market) {
                    return market.marketName != "Tied Match";
                  });
                }
              } else {
                item.tiedMatchInplay1 = false;
              }
              if (item.overUnderInplay1 == 0 || item.winTheTossInplay1 == 0) {
                item.overUnderInplay1 = true;
                if (item.markets[0]) {
                  item.markets = item.markets.filter(function (market) {
                    return !market.marketName.includes("Over/Under");
                  });
                }
              } else {
                item.overUnderInplay1 = false;
              }
              // new field end
            }

            if (item.matchOddsInplay == 0) {
              item.matchOddsInplay = true;
            } else {
              item.matchOddsInplay = false;
            }
            if (item.tiedMatchInplay == 0) {
              item.tiedMatchInplay = true;
              // if (item.markets[0]) {
              //   item.markets = item.markets.filter(function (market) {
              //     return market.marketName != "Tied Match";
              //   });
              // }
            } else {
              item.tiedMatchInplay = false;
            }
            if (item.overUnderInplay == 0) {
              item.overUnderInplay = true;
              // if (item.markets[0]) {
              //   item.markets = item.markets.filter(function (market) {
              //     return !market.marketName.includes("Over/Under");
              //   });
              // }
            } else {
              item.overUnderInplay = false;
            }

            if (item.eventName.indexOf(' SRL ') > -1) {
              item['isSrl'] = true;
            }

            if (item.eventName.indexOf(' T10 v ') > -1) {
              item.competitionName = "T10 Virtual Cricket League";
              item['isStream'] = true;
            }
            if (item.markets[0]) {
              item.markets = item.markets.filter(function (market) {
                return market.marketName != "Over/Under 3.5 Goals";
              });
            }
            if (this.allScoresData.length > 0) {
              this.allScoresData.forEach((scoreData: any) => {
                if (item.eventId == scoreData.eventId) {
                  item['score'] = scoreData;
                }
              });
            }

          })
        }
        if (this.siteName == 'lionbook247') {// remove SRL matches
          resp.result = resp.result.filter(item => {
            return item.eventName.indexOf(' SRL ') == -1;
          });
        }
        if (this.siteName == 'lionbook247') {
          resp.result = resp.result.filter(item => {
            return item.eventName.indexOf(' T10 v ') == -1;
          });
        }

        resp.result = resp.result.filter(item => {
          return parseInt(item.eventTypeId) == 4 || parseInt(item.eventTypeId) == 1 || parseInt(item.eventTypeId) == 2 || parseInt(item.eventTypeId) == 52 || parseInt(item.eventTypeId) == 85;
        });
        // this.getMatchOdds(resp.result);
        this.shareService.shareListGamesData(resp.result);
        this.shareService.shareSportData(this.dfService.getSportDataFormat(resp.result));
        this.getAllScores(resp.result);
        // console.log(this.dfService.getSportDataFormat(resp.result))

      }
      if(resp.sports){
        this.shareService.sharegamestatus(resp.sports)
      }
      this.isGameApiCall = true;
      this.loader = false;

    }, err => {
      this.isGameApiCall = true;
      $('#page_loading').css('display', 'none');
    });
  }


  getMatchOdds(matches: any[]) {
    var ids: any[] = [];
    matches.forEach((match, index) => {
      if (!match.markets[0]) {
        return;
      }
      if (match.markets[0].marketName == 'Match Odds') {
        ids.push(match.markets[0].marketId);
      }
    });
    if (ids.length) {

      this.sportsAPi.getMatchOdds(4, ids.join(',')).subscribe((resp: any) => {
        // console.log(resp)
        matches.forEach((match: any) => {
          resp.forEach((market: any) => {
            if (match.eventId == market.eventId) {
              match['runners'] = market.runners;
              match['status'] = market.status;
            }
          });
        });
        // this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));
        this.loader = false;
      });
    }
  }

  getAllScores(matches: any[]) {

    if (matches.length > 0) {

      this.scoreService.getAllScore().subscribe((resp: any) => {
        // console.log(resp)
        this.allScoresData = resp;
        matches.forEach((match: any) => {
          if (resp.length > 0) {
            resp.forEach((scoreData: any) => {
              if (match.eventId == scoreData.eventId) {
                match['score'] = scoreData;
              }
            });
          }
        });
        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));
      });
    }
  }

  ngOnDestroy(): void {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
  }
}
