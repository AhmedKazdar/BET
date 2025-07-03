import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientApiService } from 'src/app/services/client-api.service';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { MainService } from 'src/app/services/main.service';
import { ScoreService } from 'src/app/services/score.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { SportsApiService } from 'src/app/services/sports-api.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-full-wrap',
  templateUrl: './full-wrap.component.html',
  styleUrls: ['./full-wrap.component.scss']
})
export class FullWrapComponent implements OnInit {
  siteName = environment.siteName;

  isLeftMenuShow: boolean = true;
  isRightMenuShow: boolean = true;


  stakeSettingData: any;
  allScoresData: any = [];

  loader: boolean = true;
  isBannerShow: boolean = false;

  isLogin: boolean = false;

  intervalSub: any;
  isGameApiCall = true;

  isRemoveBfMarket = environment.isRemoveBfMarket;
  sportDataSubscription!: Subscription;

  constructor(
    private mainService: MainService,
    private clientApi: ClientApiService,
    private sportsAPi: SportsApiService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    private scoreService: ScoreService,
    public router: Router
  ) {

    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
    this.mainService.apis$.subscribe((res) => {
      this.sportWise();
      this.listCasinoTable();
      this.GetBetStakeSetting();
      this.intervalSub = setInterval(() => {
        this.sportWise();
      }, 60000)
    });

    if (this.router.url == '/dash' || this.router.url.indexOf('/tpp') > -1 || this.router.url.indexOf('/aman') > -1 || this.router.url.indexOf('/lcasino') > -1 || this.router.url.indexOf('/Other-Games') > -1 || this.router.url.indexOf('/feedback') > -1 || this.router.url.indexOf('/dispute') > -1 || this.router.url.indexOf('/betgames') > -1 || this.router.url.indexOf('/twain') > -1) {
      this.isLeftMenuShow = false;
      this.isRightMenuShow = false;
    } else if (this.router.url == '/running') {
      this.isLeftMenuShow = false;
      this.isRightMenuShow = true;
    }
    else {
      this.isLeftMenuShow = true;
      this.isRightMenuShow = true;
    }

    this.router.events.subscribe((event: NavigationStart) => {
      window.scrollTo(0, 0);

      setTimeout(() => {
        $('#overWrap').scrollTop(0);
      }, 100)

      if (event instanceof NavigationStart) {
        // console.log(event.url)

        if (event.url == '/dash' || event.url.indexOf('/tpp') > -1   || event.url.indexOf('/aman') > -1  || event.url.indexOf('/lcasino') > -1 || event.url.indexOf('/Other-Games') > -1 || event.url.indexOf('/feedback') > -1 || event.url.indexOf('/dispute') > -1 || event.url.indexOf('/betgames') > -1 || event.url.indexOf('/twain') > -1) {
          this.isLeftMenuShow = false;
          this.isRightMenuShow = false;
        } else if (event.url == '/running') {
          this.isLeftMenuShow = false;
          this.isRightMenuShow = true;
        }
        else {
          this.isLeftMenuShow = true;
          this.isRightMenuShow = true;
        }
      }
    });


  }

  ngOnInit(): void {
  }


  GetBetStakeSetting() {
    let accountInfo = this.tokenService.getUserInfo();
    if (!accountInfo) {
      this.stakeSettingData = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100, 500, 1000, 5000]
      this.shareService.shareStakeButton(this.stakeSettingData);
      this.getpprofile();
      return;
    }

    if (accountInfo.stakeSetting) {
      this.stakeSettingData = accountInfo.stakeSetting.split(',');
      if (this.stakeSettingData.length == 10) {
        this.stakeSettingData.push('1000');
        this.stakeSettingData.push('5000');
      }
    } else {
      if (this.siteName == "jeetfair") {
        this.stakeSettingData = [5, 10, 50, 100, 500, 1000, 5000, 10000, 5, 10, 50, 100];
      } else {
        this.stakeSettingData = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100, 500, 1000, 5000];
      }
    }
    this.stakeSettingData.forEach((element: any, index: number) => {
      this.stakeSettingData[index] = parseInt(element);
    });
    this.shareService.shareStakeButton(this.stakeSettingData);
  }

  getpprofile() {
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
      console.log(resp);
      
      if (resp.result) {
        this.shareService.shareCasinoList(resp.result[0].tables);
      }

    })
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
              item.competitionName = "Pro Kabaddi 2021-22";
              item['isKabaddi'] = true;
              item['isBm'] = true;
              // item['isFancy'] = true;
            }
            if (item.sportsName == "Election") {
              item['isKabaddi'] = true;
              // item['isBm'] = true;
              item['isFancy'] = true;
              item['marketName'] = "Assembly Election 2022";

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

            if (item.markets[0] && this.siteName == 'lionbook247' || this.siteName == 'cricbuzzercom') {
              item.markets = item.markets.filter(function (market) {
                return market.marketName != "Tied Match";
              });
            }
            if (item.eventName.indexOf(' T10 v ') > -1) {
              item.competitionId = "505540854";
              item.competitionName = "T10 Virtual Cricket League";
              item['isStream'] = true;
            }

            if (item.markets[0]) {
              item.markets = item.markets.filter(function (market) {
                return market.marketName != "Over/Under 3.5 Goals";
              });
            }
          })
        }



        // if (this.siteName != 'cricbuzzer') { //Remove new all sport
        //   resp.result = resp.result.filter(item => {
        //     return parseInt(item.eventTypeId) < 100 && parseInt(item.eventTypeId) != 6;
        //   });
        // }
        // console.log(resp.result);
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

        this.shareService.shareListGamesData(resp.result);
        // console.log(resp.result,"fullwrap sharelist games data")
        this.getMatchOdds(resp.result);

      }
      if(resp.sports){
        this.shareService.sharegamestatus(resp.sports)
      }
      this.isGameApiCall = true;
    }, err => {
      this.isGameApiCall = true;
    });
  }


  getMatchOdds(matches: any[]) {
    var ids: any[] = [];
    var allSportIds: any[] = [];
    // console.log(matches,"full wrap")
    matches.forEach((match, index) => {
      if (!match.markets[0]) {
        return;
      }
      if ((match.eventTypeId == 4 || match.eventTypeId == 1 || match.eventTypeId == 2) && match.markets[0]?.marketId.length < 13) {
        if (match.markets[0].marketName == 'Match Odds' || match.markets[0].marketName == 'Moneyline' || match.markets[0].marketName == 'Fight Result' || match.markets[0].marketName == 'Fight Result - Unmanaged') {
          ids.push(match.markets[0].marketId);
        }
      } else if (match.markets[0]?.marketId.length < 13) {
        // if (match.markets[0].marketName == 'Match Odds' || match.markets[0].marketName == 'Moneyline' || match.markets[0].marketName == 'Fight Result' || match.markets[0].marketName == 'Fight Result - Unmanaged') {
        allSportIds.push(match.markets[0].marketId);
        // }
      }

    });
    if (ids.length) {

      this.sportsAPi.getMatchOdds(4, ids.join(','), false).subscribe((resp: any) => {
        // console.log(resp)

        if (resp.errorCode) {
          this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));

        } else {
          matches.forEach((match: any) => {
            resp.forEach((market: any) => {
              if (match.eventId == market.eventId) {
                match['runners'] = market.runners;
                match['status'] = market.status;
              }
            });
            if (this.allScoresData.length > 0) {
              this.allScoresData.forEach((scoreData: any) => {
                if (match.eventId == scoreData.eventId) {
                  match['score'] = scoreData;
                }
              });
            }
          });
        }

        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));
        this.loader = false;

        this.getAllScores(matches);
      }, err => {
        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));
      });
    }
    if (allSportIds.length) {

      this.sportsAPi.getMatchOdds(4, allSportIds.join(','), true).subscribe((resp: any) => {
        // console.log(resp)

        if (resp.errorCode) {
          this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));

        } else {
          matches.forEach((match: any) => {
            resp.forEach((market: any) => {
              if (match.eventId == market.eventId) {
                match['runners'] = market.runners;
                match['status'] = market.status;
              }
            });
            if (this.allScoresData.length > 0) {
              this.allScoresData.forEach((scoreData: any) => {
                if (match.eventId == scoreData.eventId) {
                  match['score'] = scoreData;
                }
              });
            }
          });
        }

        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));
        this.loader = false;

        this.getAllScores(matches);
      }, err => {
        this.shareService.shareSportData(this.dfService.getSportDataFormat(matches));
      });
    }

    // console.log(allSportIds)
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
