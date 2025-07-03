import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { interval, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ClientApiService } from '../services/client-api.service';
import { DataFormatsService } from '../services/data-formats.service';
import { ScoreService } from '../services/score.service';
import { ShareDataService } from '../services/share-data.service';
import { SocketService } from '../services/socket.service';
import { TokenService } from '../services/token.service';
import { ToastMessageService } from '../services/toast-message.service';
import { RacingApiService } from '../services/racing-api.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { SportsApiService } from '../services/sports-api.service';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  siteName: string = environment.siteName;
  isLcRouting = environment.isLcRouting;
  isRemoveBfMarket = environment.isRemoveBfMarket;

  params: any;
  isLogin: boolean = false;

  matchData = [];
  isVirtual: boolean;
  selectedMarket: number;

  isSocketConn: boolean = false;

  marketsPnl: any = {};

  fancyExposures: any;
  fSource;

  fancyBookData = [];
  selectedFancyTab = '1';
  isSportBook: boolean = false;

  openBet: any;
  OpenBetForm: FormGroup;
  showLoader: boolean = false;

  stakeSetting = [];

  selectedMatch: any;

  scoreInterval: any;


  deviceInfo: any;
  context: any;

  liveUrl: string;
  liveUrlSafe: SafeResourceUrl;
  activeTab: string = "liveVideo";


  width: number = 360;
  height: number = 202;
  Update: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // console.log(event);
    // this.width = event.target.innerWidth;
    // this.height = Math.ceil(this.width / 1.778);
    // this.setIframeUrl();
  };


  score_id: any;

  scoreWidth: number = 450;
  scoreHeight: number = 281;

  bfMin: any;
  bfMax: any;

  bmMin: any;
  bmMax: any;

  fMin: any;
  fMax: any;

  pMin:any;
  pMax:any;
  minBeforeInplay: number = 0;

  subSink = new Subscription();

  accountInfo: any;
  openedPremiumMarkets = {};


  orientation: number = 0;

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    // console.log('orientationChanged');
    // console.log("the orientation of the device is now " + event.target.screen.orientation.angle);
    this.orientation = event.target.screen.orientation.angle;

    // this.width = event.target.innerWidth;
    // this.height = Math.ceil(this.width / 1.778);
  }

  getMarketDataDepth: any;
  marketDepthData: any
  backlayReport = [];

  expoApiPending: boolean = false;
  fexpoApiPending: boolean = false;
  scoreApiPending: boolean = false;
  isSportRadar: boolean = false;

  isparlay: any;
  listBetArray: any[];
  parlaybet: boolean = false;
  existingArray: any;
  betslipItemCount: any;
  callsportbookmultiapi: boolean = false;
  localstoragedata: any;
  grandtotalodds: any;
  matchingLocal: boolean = true;
  isAvailableData: boolean = false;
  dataAvailable: boolean;
  data: any;
  localStorageData: any[];
  sportsbookdata: any
  sportbook_multi: any
  totallocaldata: any

  constructor(
    private shareService: ShareDataService,
    private dfService: DataFormatsService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: ClientApiService,
    private racingApi: RacingApiService,
    private toastr: ToastMessageService,
    private scoreService: ScoreService,
    private sanitizer: DomSanitizer,
    private deviceService: DeviceDetectorService,
    private tokenService: TokenService,
    private router: Router,
    private sportapi: SportsApiService
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

    this.isSportRadar = true;
    if (localStorage.getItem('parlayBetSlip')) {
      this.totallocaldata = JSON.parse(localStorage.getItem('parlayBetSlip'));
      this.betslipItemCount = this.totallocaldata?.length
    }
  }

  ngOnInit(): void {
    this.shareService.parlayvalue$.subscribe(val => {
      this.isparlay = val
      if (this.isparlay) {
        this.isSportBook = true
      }
      if (this.isparlay) {
        if (this.router.url.includes('/event/') || this.router.url.includes('/fullmarket/')) {
          this.toastr.warningMsg('Parlay Bets Enable');
        }
      }
    })
    this.getlanguages();
    this.route.params.subscribe(params => {
      // console.log(params);
      this.shareService.activeMatch.emit(params.eventId);
      this.params = params;
      this.subSink.unsubscribe();
      this.subSink = new Subscription();
      this.matchData = [];
      this.isSocketConn = false;
      this.subSink.add(() => {
        this.socketService.closeConnection();
       
      });
      this.getMatchData();
    });
    this.epicFunction();
    this.getBetStakeSetting();
    this.UserDescription();
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktop = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktop); // returns if the app is running on a Desktop browser.

    if (isMobile) {
      this.context = "Mobile";
    }
    if (isTablet) {
      this.context = "Tablet";
    }
    if (isDesktop) {
      this.context = "Desktop";
    }
    if (isMobile) {
      this.width = window.innerWidth;
      this.height = Math.ceil(this.width / 1.778);

      // if(this.width>400){
      //   this.width=400;
      // }
      // if(this.height>201){
      //   this.height=201;
      // }
    }
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);
      
    })
  }

  initOpenBetForm() {
    this.OpenBetForm = this.fb.group({
      sportId: [this.openBet?.sportId],
      tourid: [this.openBet?.tourid],
      matchBfId: [this.openBet?.matchBfId],
      matchId: [this.openBet?.matchId],
      eventId: [this.openBet?.matchId],
      bfId: [this.openBet?.bfId],
      marketId: [this.openBet?.bfId],
      mktBfId: [this.openBet?.bfId],
      mktId: [this.openBet?.mktId],
      selId: [this.openBet?.SelectionId],
      matchName: [this.openBet?.matchName],
      marketName: [this.openBet?.marketName],
      mktname: [this.openBet?.marketName],
      isInplay: [this.openBet?.isInplay],
      runnerName: [this.openBet?.runnerName],
      odds: [this.openBet?.odds],
      bookodds: [{ value: this.openBet?.odds, disabled: true }],
      backlay: [this.openBet?.backlay],
      betType: [this.openBet?.backlay],
      yesno: [this.openBet?.backlay == "back" ? 'yes' : 'no'],
      score: [this.openBet?.score],
      runs: [this.openBet?.score],
      rate: [this.openBet?.rate],
      fancyId: [this.openBet?.fancyId],
      bookId: [this.openBet?.bookId],
      runnerId: [this.openBet?.runnerId],
      bookType: [this.openBet?.bookType],
      stake: [""],
      profit: [0],
      loss: [0],
      mtype: [this.openBet?.mtype],
      gameType: [this.openBet?.mtype],
      oddsTyping: [false],
      stakeTyping: [true],

    })
    // console.log(this.OpenBetForm.value);
  }
  get f() {
    return this.OpenBetForm.controls;
  }

  getBetStakeSetting() {
    this.shareService.stakeButton$.subscribe(data => {
      if (data != null) {
        this.stakeSetting = data;
        // console.log(this.stakeSetting)
      }
    });
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
  }



  selectMarket(marketId, value) {
    this.selectedMarket = marketId;
    // var g = $('#marketBetsWrap');
    // var f = g.find('#naviMarket_' + this.removeSpace(marketId));
    // if (f && value) {
    //   const mainWrap = document.querySelector('#mainWrap');
    //   let leftOffset = 0;
    //   leftOffset = f.offset().left;
    //   // console.log(leftOffset)
    //   if (mainWrap) {
    //     // frame.scrollLeft = leftOffset ? leftOffset : 0;
    //     mainWrap.scrollLeft = leftOffset;
    //   }
    // }
    $('#page_loading').css('display', 'flex');

  }


  getMatchData() {
    $('#page_loading').css('display', 'flex');
    this.matchData = [];
    let IsTvShow = false;
    this.shareService.sportData$.subscribe((data: any) => {
      if (data) {
        if (!this.isSocketConn) {
          if (this.params.marketId) {
            this.matchData.push({ eventId: this.params.eventId, port: this.params.port, markets: [], isRacing: true });

            this.getMarketDescription();
          } else {
            this.matchData = _.cloneDeep(this.dfService.favouriteEventWise(data, this.params.eventId));
            this.scoreInterval = setInterval(() => {
              _.forEach(this.matchData, (element) => {
                this.getScore(element);
              });
            }, this.isLogin ? 2000 : 10000);
          }
          this.socketService.getWebSocketData(this.matchData[0]);
          this.isSocketConn = true;

          // console.log(this.matchData)
          if (this.matchData.length == 0) {
            let homeCom = '/dash';

            if (this.isLcRouting) {
              homeCom = '/home';
            }
            this.router.navigate([homeCom]);
          }

          this.loadEventSettings();

          if (!this.params.marketId) {

            _.forEach(this.matchData, (element) => {
              _.forEach(element.markets, (element2, mktIndex: number) => {
                element2['MarketId'] = element2.marketId;
                this.ExposureBook(element2);
                if (mktIndex == 0) {
                  this.getBmExposureBook(element2);
                }
              });
              this.getFancyExposure(element);
                this.getScoreId(element);

              if (element.videoEnabled) {
                $('#openTV').css('display', 'flex');
              }
              else {
                $('#openTV').css('display', 'none');
              }

              if (!this.selectedMatch && element.videoEnabled && !IsTvShow && this.isLogin) {
                // this.openTv(element);
                IsTvShow = false;
              }

            });

          } else {
            _.forEach(this.matchData, (element) => {
              _.forEach(element.markets, (element2) => {
                element2['MarketId'] = element2.marketId;
                this.ExposureBook(element2);
              });
            });
          }

          this.shareService.oddsData$.subscribe((oddsData: any) => {
            if (oddsData && this.matchData[0]) {
              if (this.matchData[0].isRacing) {

                if (this.matchData[0].eventTypes) {
                  _.forEach(this.matchData[0].eventTypes.eventNodes.marketNodes.runners, (data) => {
                    _.forEach(oddsData.runners, (runner) => {

                      if (!runner.exchange.availableToBack) {
                        runner.exchange.availableToBack = []
                      }
                      if (!runner.exchange.availableToLay) {
                        runner.exchange.availableToLay = []
                      }
                      runner.exchange['AvailableToBack'] = runner.exchange.availableToBack;
                      runner.exchange['AvailableToLay'] = runner.exchange.availableToLay;

                      if (runner.selectionId == data.selectionId) {
                        runner['SelectionId'] = runner.selectionId;
                        runner['ExchangePrices'] = runner.exchange;
                        runner['description'] = data.description;
                      }
                    });
                  });
                  oddsData['isBettable'] = true;
                  oddsData['Runners'] = oddsData.runners;
                  oddsData['MarketId'] = oddsData.marketId;
                  oddsData['Status'] = oddsData.state.status;
                  oddsData['marketName'] = this.matchData[0].eventTypes.eventNodes.marketNodes.description.marketName;



                  let raceMarket = [];
                  raceMarket.push(oddsData)
                  // console.log(this.matchData)

                  _.forEach(this.matchData, (element) => {
                    _.forEach(element.markets, (element2) => {
                      _.forEach(raceMarket, (market) => {
                        if (market.MarketId == element2.MarketId) {

                          element2.pnl = this.marketsPnl[element2.MarketId];
                          if (element2.pnl) {
                            market['pnl'] = element2.pnl
                          } else {
                            this.ExposureBook(element2);
                          }

                          if (element2.newpnl) {
                            market['newpnl'] = element2.newpnl;
                          }

                        }
                      })
                    });
                  });


                  if (this.matchData[0].markets[0]) {
                    this.oddsChangeBlink(this.matchData[0].markets, raceMarket, 'markets');

                  }
                  this.getMarketsData(raceMarket);

                }

                setTimeout(() => {
                  $('#page_loading').css('display', 'none');
                }, 1000)

              } else {

                if (oddsData.sportsBookMarket) {
                  _.forEach(this.matchData, (element) => {
                    _.forEach(element.sportsBookMarket, (element2) => {
                      _.forEach(oddsData.sportsBookMarket, (market, index) => {
                        if (market.id == element2.id) {
                          // element2.pnl = this.marketsPnl[element2.id];
                          element2.pnl = this.userService.getPremiumBook(element2.id)
                          if (element2.pnl) {
                            market['pnl'] = element2.pnl
                          } else {
                            // this.ExposureBook(element2);
                          }
                          if (element2.newpnl) {
                            market['newpnl'] = element2.newpnl;
                          }
                        }
                      })
                    });
                    this.oddsChangeBlink(element.sportsBookMarket, oddsData.sportsBookMarket, 'sportbook');
                  });
                  this.getSportsBookMarket(oddsData.sportsBookMarket);
                }

                if (oddsData.Fancymarket) {
                  _.forEach(oddsData.Fancymarket, (fanyItem) => {
                    // fanyItem.nat = "145 over run ENG";
                    // fanyItem.nat="9.6 ball run ENG";

                    if (this.openBet) {
                      if (this.openBet.runnerName == fanyItem.nat && fanyItem.gstatus != '') {
                        this.ClearAllSelection();
                      }
                    }
                    if (this.fancyExposures) {
                      let fancyExpo = this.fancyExposures["df_" + fanyItem.mid + '_' + fanyItem.sid + '_' + fanyItem.nat];
                      if (fancyExpo != undefined) {
                        fanyItem['pnl'] = fancyExpo;

                      }
                    }
                  });
                  _.forEach(this.matchData, (element: any) => {
                    this.oddsChangeBlink(element.Fancymarket, oddsData.Fancymarket, 'fancy');
                  })

                  this.getFancyData(oddsData.Fancymarket);
                }
                if (oddsData.BMmarket) {
          
                  _.forEach(this.matchData, (element: any) => {

                    if (element.BMmarket.bm1) {
                      
                      if (element.BMmarket.bm1[0].mid == oddsData.BMmarket?.bm1[0].mid) {
                        // if (!element2.pnl) {
                        element.BMmarket.pnl = this.marketsPnl['bm_' + element.BMmarket?.bm1[0].mid];
                        // }
                        if (element.BMmarket.pnl) {
                          oddsData.BMmarket['pnl'] = element.BMmarket.pnl
                        } else {
                          this.getBmExposureBook(element.markets[0]);
                        }

                        if (element.BMmarket.newpnl) {
                          oddsData.BMmarket['newpnl'] = element.BMmarket.newpnl;
                        }
                      }
                    }

                    this.oddsChangeBlink(element.BMmarket.bm1, oddsData.BMmarket, 'bookmaker');

                    // console.log(element.BMmarket.bm1)
                  });
                  this.getBookMakersData(oddsData.BMmarket);
                }
                if (oddsData.length > 0) {

                  // console.log(this.checkDateTime(this.matchData[0].time));

                  oddsData = oddsData.sort(function (a, b) {
                    if (a.marketName == 'Draw no Bet') {
                      return 1;
                    } else {
                      return a.marketName < b.marketName ? -1 : a.marketName > b.marketName ? 1 : 0;
                    }
                  });

                  
                  if (this.siteName == 'lionbook247' || this.siteName == 'cricbuzzercom') {
                    oddsData = oddsData.filter(function (market) {
                      return market.marketName != "Tied Match";
                    });
                  }

                  oddsData = oddsData.filter(function (market) {
                    return market.marketName != "Over/Under 3.5 Goals";
                  });


                  _.forEach(this.matchData, (element) => {

                    // if (element.tiedMatchInplay) {
                    //   if (oddsData[0]) {
                    //     oddsData = oddsData.filter(function (market) {
                    //       return market.marketName != "Tied Match";
                    //     });
                    //   }
                    // }
                    // if (element.overUnderInplay) {
                    //   if (oddsData[0]) {
                    //     oddsData = oddsData.filter(function (market) {
                    //       return !market.marketName.includes("Over/Under");
                    //     });
                    //   }
                    // }
                    if (this.isRemoveBfMarket) {
                      if (element.tiedMatchInplay1) {
                        if (oddsData[0]) {
                          oddsData = oddsData.filter(function (market) {
                            return market.marketName != "Tied Match";
                          });
                        }
                      }
                      if (element.overUnderInplay1) {
                        if (oddsData[0]) {
                          oddsData = oddsData.filter(function (market) {
                            return !market.marketName.includes("Over/Under");
                          });
                        }
                      }
                    }
                    _.forEach(element.markets, (element2) => {
                      _.forEach(oddsData, (market) => {
                        if (market.MarketId == element2.MarketId) {
                          market['eventName'] = element.eventName;
                          if (market.marketName.indexOf('Winner') > -1) {
                            market.Runners = market.Runners.filter(function (runner) {
                              return runner.Status == "ACTIVE";
                            });
                          }

                          if (element.matchOddsInplay && (market.marketName == "Winner" || market.marketName == "Match Odds")) {
                            market.Status = "SUSPENDED";
                            // // if(element.eventTypeId!=4){
                            // market['removeMarket'] = true;
                            // // }
                          }

                          if (element.tiedMatchInplay && (market.marketName == "Tied Match")) {
                            market.Status = "SUSPENDED";
                            // // if(element.eventTypeId!=4){
                            // market['removeMarket'] = true;
                            // // }
                          }
                          if (element.overUnderInplay && (market.marketName.includes("Over/Under"))) {
                            market.Status = "SUSPENDED";
                            // // if(element.eventTypeId!=4){
                            // market['removeMarket'] = true;
                            // // }
                          }



                          if (this.isRemoveBfMarket) {
                            if (element.matchOddsInplay1 && (market.marketName == "Winner" || market.marketName == "Match Odds")) {
                              market.Status = "SUSPENDED";
                              market['removeMarket'] = true;
                            }
                            if (element.tiedMatchInplay1 && (market.marketName == "Tied Match")) {
                              market.Status = "SUSPENDED";
                              market['removeMarket'] = true;
                            }
                            if (element.overUnderInplay1 && (market.marketName.includes("Over/Under"))) {
                              market.Status = "SUSPENDED";
                              market['removeMarket'] = true;
                            }
                          }

                          if (market.marketName == "To Win the Toss") {
                            market['isBettable'] = true;
                          } else {
                            market['isBettable'] = element.isBettable;
                          }

                          // if ((this.siteName == 'cricbuzzer') && !element.isBettable) {
                          //   market['isBettable'] = this.checkDateTime(this.matchData[0].time)
                          // }

                          // if (this.siteName == "cricbuzzer") {
                          //   market['isBettable'] = true;
                          // }
                          // console.log(market);

                          // if (element2.pnl) {
                          element2.pnl = this.marketsPnl[element2.MarketId];
                          // }
                          if (element2.pnl) {
                            market['pnl'] = element2.pnl
                          } else {
                            this.ExposureBook(element2);
                          }

                          if (element2.newpnl) {
                            market['newpnl'] = element2.newpnl;
                          }
                          if (market.TotalMatched < 1000) {
                            market['isLowLiquidity'] = true;
                          }

                          // if (market.Runners.length > 0) {
                          //   market['TotalMatched'] = market.Runners[0].TotalMatched.toFixed(2);
                          // }
                          if (!this.selectedMarket) {
                            this.selectMarket(market.MarketId, false);
                          }

                        }
                      })
                    });

                    this.oddsChangeBlink(element.markets, oddsData, 'markets');
                  });
                  this.getMarketsData(oddsData);
                }
                setTimeout(() => {
                  $('#page_loading').css('display', 'none');
                }, 500);

                // $('#page_loading').css('display', 'none');
                if (oddsData.length > 2) {
                  (<any>$('#naviMarket')).perfectScrollbar();
                }

              }
            }
            // console.log(this.matchData)
            if (this.matchData[0]) {
              this.isVirtual = this.matchData[0].isVirtual;
            }
            // console.log(this.isVirtual,"isVirtual")
            // if (this.isVirtual) {
            //   this.getMatchData();
            // }
          });


        } else {
          if (this.params.marketId) {

          } else {
            let matchData = _.cloneDeep(this.dfService.favouriteEventWise(data, this.params.eventId));

            if (matchData[0] && this.matchData[0]) {
              // console.log(matchData[0].tiedMatchInplay)
              this.matchData[0].isInPlay = matchData[0].isInPlay;
              this.matchData[0].isBettable = matchData[0].isBettable;
              this.matchData[0].inplay = matchData[0].inplay;
              this.matchData[0].videoEnabled = matchData[0].videoEnabled;
              this.matchData[0].matchOddsInplay = matchData[0].matchOddsInplay;
              this.matchData[0].tiedMatchInplay = matchData[0].tiedMatchInplay;
              this.matchData[0].overUnderInplay = matchData[0].overUnderInplay;
              this.matchData[0].premiumMain = matchData[0].premiumMain;
              this.matchData[0].matchOddsInplay1 = matchData[0].matchOddsInplay1;
              this.matchData[0].tiedMatchInplay1 = matchData[0].tiedMatchInplay1;
              this.matchData[0].overUnderInplay1 = matchData[0].overUnderInplay1;


              if (this.matchData[0].videoEnabled) {
                $('#openTV').css('display', 'flex');
              }
              else {
                $('#openTV').css('display', 'none');
              }

            }
          }
        }
      }
    });

    if (this.isLogin) {
      this.shareService.showLiveTv.subscribe(data => {
        // console.log(data);
        this.hideTvControl();
        _.forEach(this.matchData, (event) => {
          if (event.videoEnabled) {
            $('#openTV').css('display', 'flex');
          }
          else {
            $('#openTV').css('display', 'none');
          }
          if (event.videoEnabled && !this.selectedMatch) {
            this.openTv(event);
          }
        });
      })
    }


  }

  closeOverlayInfo() {
    $("#marketDepth").css("display", "none");
  }

  openMarketDepth(market) {
    if(!this.isLogin){
      return;
    }
  }

  showMenuList() {
    this.getMarketDataDepth.show = !this.getMarketDataDepth.show;
    // console.log(this.getMarketDataDepth)
  };

  queryMarketDepth(runner) {

    _.forEach(this.getMarketDataDepth.Runners, (item: any, index: number) => {
      item['isSelected'] = false;
    });
    // console.log(runner)

    runner['isSelected'] = true;

    // console.log(this.getMarketDataDepth)
    if (this.getMarketDataDepth.show) {
      this.showMenuList();

    }
    this.inverseAxis(1);
    this.userService
      .queryMarketDepths(this.getMarketDataDepth.MarketId, runner.SelectionId)
      .subscribe((data: any) => {

        this.marketDepthData = data;
        // console.log(marketDepthData)

        this.marketDepthData.ex.availableToBack.forEach(function (
          item
        ) {
          item.backLay = "back";
        });
        this.marketDepthData.ex.availableToLay.forEach(function (
          item
        ) {
          item.backLay = "lay";
        });
        this.backlayReport = this.marketDepthData.ex.availableToBack
          .concat(this.marketDepthData.ex.availableToLay)
          .concat(this.marketDepthData.ex.tradedVolume);

        this.backlayReport.sort(function (a, b) {
          return a.price - b.price;
        });
        // console.log(backlayReport)

        $("#marketDepth").css("display", "flex");

        setTimeout(function () {
          var outerContent = $("#reportArticle");
          var innerContent = $("#reportArticle .trade");

          outerContent.scrollLeft(
            (innerContent.width() - outerContent.width()) / 2
          );
        }, 200);

      })
  }

  inverseAxis = function (axis) {


    this.getMarketDataDepth['axis'] = axis;
    var bfId = this.getMarketDataDepth.MarketId.split(".")[1];
    let SelectionId = 0;
    _.forEach(this.getMarketDataDepth.Runners, (item: any, index: number) => {
      if (item.isSelected) {
        SelectionId = item.SelectionId;
      }
    });

    if (axis == 1) {
      this.userService
        .LoadRunnerInfoChartAction(bfId, SelectionId, false)
        .subscribe((data: any) => {
          // console.log(data)
          this.getMarketDataDepth['img'] = data;
        });
    } else {
      this.userService
        .LoadRunnerInfoChartAction(bfId, SelectionId, true)
        .subscribe((data: any) => {
          this.getMarketDataDepth['img'] = data;

        });
    }
  };
  getMarketDescription() {

    if (!this.isLogin) {
      return;
    }
    this.racingApi
      .marketDescription(this.params.marketId)
      .subscribe((data: any) => {
        // this.marketDescription = data;
        // console.log(data);
        if (data) {

          this.matchData[0]['eventTypes'] = data.eventTypes;
          this.matchData[0]['time'] = data.eventTypes?.eventNodes?.marketNodes?.description?.marketTime;
          this.matchData[0]['inplay'] = data.eventTypes?.eventNodes?.marketNodes?.state?.inplay;
          this.matchData[0]['isBettable'] = true;
          this.matchData[0]['eventTypeId'] = data.eventTypes.eventTypeId;



          if (data.eventTypes.eventTypeId == 7) {
            this.matchData[0]['sportsName'] = "Horse Racing";
          }
          if (data.eventTypes.eventTypeId == 4339) {
            this.matchData[0]['sportsName'] = "Greyhound Racing";
          }


          // console.log(this.matchData)
          // data.eventTypes.eventNodes.marketNodes.runners.forEach((runner) => {
          //   this.runnersMap[runner.selectionId] = runner;
          // });
          // (<any[]>this.currentMatchData)?.forEach((market) => {
          //   market.runners.forEach((runner) => {
          //     runner.runnerName = this.runnersMap[runner.selectionId]
          //       ?.description.runnerName
          //       ? this.runnersMap[runner.selectionId].description.runnerName
          //       : '';
          //     runner['description'] = this.runnersMap[runner.selectionId]
          //       ?.description
          //       ? this.runnersMap[runner.selectionId].description
          //       : '';
          //   });
          // });
        }

      });
  }

  toggleFavourite(event, marketData) {
    // // _.forEach(this.favouriteEvents, (item, matchIndex) => {
    // _.forEach(event.markets, (item2) => {
    //   this.mktService.UnsuscribeSingleMarket(item2.bfId);
    // });
    // this.fancyService.UnsuscribeSingleFancy(event.id);
    // // this.favouriteEvents.splice(matchIndex, 1);
    // // });

    // this.dfService. (event.bfId, true);
    if (this.isLogin) {
      // if (this.siteName == 'lc247' && event.isPremium && event.eventTypeId == 2) {
      //   return;
      // }
      let splitMarket = marketData.split('_');
      if (splitMarket) {
        if (splitMarket[0] == 'market') {
          event.markets.forEach(market => {
            if (market.MarketId == splitMarket[2]) {
              market['isMulti'] = true;
            }
          });
        }
        if (splitMarket[0] == 'bookmaker') {
          event['isBmMulti'] = true;
        }
        if (splitMarket[0] == 'fancy') {
          event['isFancyMulti'] = true;
        }
        if (splitMarket[0] == 'premium') {
          event.sportsBookMarket.forEach(sbmarket => {
            if (sbmarket.id == splitMarket[2]) {
              sbmarket['isMulti'] = true;
            }
          });
        }

      }
      // this.dfService.ToggleFavourite(event.bfId, false);
      // event.isMulti = !event.isMulti;
      // this.dfService.ToggleFavourite(event.eventId);
      this.dfService.ToggleFavourite(marketData);

    } else {
        this.router.navigate(['/login']);
    }
  }

  checkIsMulti(marketData) {

    let isMulti = false;
    let favArray = localStorage.getItem('favourite');
    let favArrays = [];
    if (favArray) {
      favArrays = favArray.split(',');
    }

    let mktIndex = _.indexOf(favArrays, marketData);
    if (mktIndex > -1) {
      isMulti = true;
    }
    return isMulti;
  }


  onIframeClick() {
    const iframeElement = this.iframe.nativeElement;        
    iframeElement.onload = () => {
      iframeElement.contentWindow.postMessage('widgets', 'https://www.satsports.net');
    };
    window.addEventListener('message', (event) => {
      this.scoreHeight  = event.data.scoreWidgetHeight    
    });
  }

  loadEventSettings() {
    if (!this.isLogin) {
      return;
    }
    this.userService.loadEvent(this.params.eventId).subscribe((resp: any) => {
      // console.log(resp)
      if (resp.errorCode == 0) {
        this.bfMin = resp.result[0].min;
        this.bfMax = resp.result[0].max.toString();
        this.minBeforeInplay = resp.result[0].minBeforeInplay;
        // if (this.bfMax.length > 5) {
        //   this.bfMax = this.bfMax.slice(0, -3) + 'K';
        // }

        if (this.isVirtual) {
          this.bmMin = this.bfMin;
          this.bmMax = this.bfMax;
        }

        if (resp.result[0].bookmakerSettings) {
          this.bmMin = resp.result[0].bookmakerSettings?.min;
          this.bmMax = resp.result[0].bookmakerSettings?.max.toString();
          // if (this.bmMax.length > 5) {
          //   this.bmMax = this.bmMax.slice(0, -3) + 'K';
          // }
        }

        if (resp.result[0].sessionSettings) {
          this.fMin = resp.result[0].sessionSettings?.min;
          this.fMax = resp.result[0].sessionSettings?.max.toString();
          // if (this.fMax.length > 5) {
          //   this.fMax = this.fMax.slice(0, -3) + 'K';
          // }
        }
              
        if (resp.result[0].premiumSettings) {
          this.pMin = resp.result[0].premiumSettings?.min;
          this.pMax = resp.result[0].premiumSettings?.max.toString();
          // if (this.fMax.length > 5) {
          //   this.fMax = this.fMax.slice(0, -3) + 'K';
          // console.log(this.pMax)
          // }
        }

      }
    });
  }

  // checkDateTime(matchDate) {
  //   // matchDate = "2022-12-13T09:30:00Z";
  //   var a = moment(matchDate);
  //   var b = moment(new Date());//now

  //   let minutes = a.diff(b, 'minutes');
  //   // console.log(a.diff(b, 'minutes')) // 44700
  //   // console.log(a.diff(b, 'hours')) // 745
  //   // console.log(a.diff(b, 'days')) // 31
  //   // console.log(a.diff(b, 'weeks')) // 4
  //   // console.log(this.minBeforeInplay);
  //   if (minutes <= this.minBeforeInplay) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  getMarketsData(markets: any[]) {

    this.matchData[0]['markets'] = markets;

    // console.log(this.matchData)
  }

  getFancyData(Fancymarket: any[]) {
    // console.log(Fancymarket)
    this.fSource = this.socketService.getFSource();
    Fancymarket = Fancymarket.filter((f1) => {
      return !f1.nat.includes('ball run ') || f1.ballsess != '3';
    });
    // Fancymarket = Fancymarket.filter((f1) =>

    // // console.log(!(/[1-9][0-9]+.[1-9]\s+(ball|over)\s+run/.test(f1.nat)))
    // // !(/100|[1-9]?[0-9]\s+(ball|over)\s+run/.test(f1.nat))
    // // !(/[0-9]|[1-9][0-9]|[1-9][0-9][0-9]\s+(ball|over)\s+run/.test(f1.nat))

    // // !(/[0-9]|[1-9][0-9]|[1-9][0-9][0-9].[1-9]\s+(ball|over)\s+run/.test(f1.nat))
    //   // !(
    //   //   /[0-9]+.[1-9]\s+(ball|over)\s+run/.test(f1.nat) ||
    //   //   /[1-9][0-9]+.[1-9]\s+(ball|over)\s+run/.test(f1.nat) ||

    //   //   // /[0-9]|.[0-6]\s+(ball|over)\s+run/.test(f1.nat) ||
    //   //   // /[0-9]{1,}.[0-9]/.test(f1.nat) ||
    //   //   // /\./.test(f1.nat) ||
    //   //   // /^[0-9]+\.?[0-9]*$/.test(f1.nat) ||
    //   //   // /[\d]+\s+runs\s+bhav\s+/i.test(f1.nat) ||
    //   //   // /run\s+bhav/i.test(f1.nat) ||
    //   //   /(total\s+match\s+boundaries)/i.test(f1.nat) ||
    //   //   /\d+\s+to\s+\d+\s+overs\s+/i.test(f1.nat)
    //   // )
    //   );

    // console.log(Fancymarket)

    this.matchData[0]['Fancymarket'] = Fancymarket;

    (<any>$('#fancyBetTabWrap')).perfectScrollbar();

  }

  IsOverMarkets(Fancymarket) {
    Fancymarket = Fancymarket.filter((f1) => {
      return f1.ballsess == '2';
    });

    // console.log(Fancymarket.length)

    if (Fancymarket.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  seletctFancyTab(tab) {
    this.selectedFancyTab = tab;
  }

  getSportsBookMarket(sportsBookMarket: any[]) {

    let totalOdds = 1;

    if (this.callsportbookmultiapi) {
      this.localstoragedata = JSON.parse(localStorage.getItem('parlayBetSlip'));
      let matchBfIdsArray: any[] = [];

      // Loop through localstoragedata and push matchBfId into the array
      if (Array.isArray(this.localstoragedata)) {
        for (const item of this.localstoragedata) {
          if (item.matchBfId) {
            matchBfIdsArray.push(item.matchBfId);
          }
        }
      } else {
        console.log("nothing in local");
      }
      if (matchBfIdsArray.length > 0) {
        this.sportapi.getSportsBookmulti(matchBfIdsArray.toString()).subscribe((res) => {
          const dataArray = Object.values(res);
          this.sportsbookdata = dataArray;
          this.localstoragedata.forEach(localItem => {
            this.dataAvailable = false
            this.sportsbookdata.forEach(elementData => {
              this.sportbook_multi = elementData.sportsBookMarket
              if (this.sportbook_multi) {
                this.sportbook_multi.forEach(apiItem => {
                  if (localItem.bfId == apiItem.id) {
                    this.dataAvailable = true;
                  }
                  if (apiItem.sportsBookSelection) {
                    apiItem.sportsBookSelection.forEach(element => {
                      if (this.dataAvailable && localItem.bfId == apiItem.id && element.id == localItem.SelectionId) {
                        localItem.odds = element.odds;
                        localItem.apiSiteStatus = apiItem.apiSiteStatus;
                        localItem.marketStatus = apiItem.marketStatus;
                        localItem.marketName = apiItem.marketName;
                        this.dataAvailable = true
                      }
                      if (!this.dataAvailable) {
                        localItem.apiSiteStatus = "SUSPENDED";
                      }
                    })
                  }
                });

              }

            })
          });
          localStorage.setItem('parlayBetSlip', JSON.stringify(this.localstoragedata));
          this.loadDataFromLocalStorage()
        });
      }
    }
    this.data = sportsBookMarket

    // total odds
    if (this.localstoragedata && Array.isArray(this.localstoragedata)) {
      for (const selection of this.localstoragedata) {
        if (selection && selection.odds) {
          if (selection.apiSiteStatus === 'ACTIVE') {
            // Parse the odds and add them to the total if they are valid numbers
            const parsedOdds = parseFloat(selection.odds);
            if (!isNaN(parsedOdds)) {
              totalOdds = totalOdds * parsedOdds;
              this.grandtotalodds = totalOdds
              this.OpenBetForm?.controls['odds'].setValue(this.grandtotalodds);
              this.calcProfit();
            }
          }
        }
      }
    }

    sportsBookMarket = sportsBookMarket.filter((market) => {
      return market.apiSiteStatus != "DEACTIVED";
    });
    // sportsBookMarket = sportsBookMarket.sort((a, b) => {
    //   return a.eventId - b.eventId;
    // });

    if (this.matchData[0]?.premiumMain || (!this.matchData[0]?.matchOddsInplay && !this.matchData[0]?.isManualEvent && !this.matchData[0]?.isSrl)) {
      if (this.matchData[0]?.eventTypeId == 4) {
        sportsBookMarket = sportsBookMarket.filter((market) => {
          return !market.marketName.toLowerCase().includes('winner');
        });
        sportsBookMarket = sportsBookMarket.filter((market) => {
          return !market.marketName.toLowerCase().includes('1x2') && market.marketName.length > 3;
        });
      }
      if (this.matchData[0]?.eventTypeId == 2) {
        sportsBookMarket = sportsBookMarket.filter((market) => {
          return !market.marketName.toLowerCase().includes('winner');
        });
      }
      if (this.matchData[0]?.eventTypeId == 1) {
        sportsBookMarket = sportsBookMarket.filter((market) => {
          return !market.marketName.toLowerCase().includes('1x2') && market.marketName.length > 3;
        });
      }
    }

    sportsBookMarket = sportsBookMarket.sort((a, b) => {
      return parseInt(a.id) - parseInt(b.id);
    });

    sportsBookMarket = sportsBookMarket.sort((a, b) => {
      return parseInt(a.apiSiteMarketId) - parseInt(b.apiSiteMarketId);
    });

    // sportsBookMarket = sportsBookMarket.sort((a, b) => {
    //   return parseInt(a.updateDate) - parseInt(b.updateDate);
    // });


    _.forEach(sportsBookMarket, (market, index) => {
      // market.sportsBookSelection.filter((market) => {
      //   return market.apiSiteStatus != "DEACTIVED";
      // });
      if (index < 5) {
        market['isExpand'] = 1;
        this.openedPremiumMarkets[market.id] = 1;
      }
      if (this.openedPremiumMarkets[market.id]) {
        market['isExpand'] = this.openedPremiumMarkets[market.id];
      }

      if (market.sportsBookSelection) {
        market.sportsBookSelection = market.sportsBookSelection.sort((a, b) => {
          return parseInt(a.id) - parseInt(b.id);
        });
      }

    });

    this.matchData[0]['sportsBookMarket'] = sportsBookMarket;

    if (this.matchData[0]?.eventTypeId == 4 && this.matchData[0]?.isFancy) {
      setTimeout(() => {
        // if (this.siteName != 'betswiz') {
        if (this.matchData[0]?.Fancymarket.length == 0 && sportsBookMarket.length > 0) {
          this.isSportBook = true;
        }
        // }
      }, 500);
    } else {
      if (this.matchData[0]?.Fancymarket.length == 0 && sportsBookMarket.length > 0) {
        this.isSportBook = true;
      }
    }
    this.matchData[0]['isSportBook'] = this.isSportBook;

    (<any>$('#sportsBookTab_2_4')).perfectScrollbar();
    (<any>$('#sportsBookTab_2_2')).perfectScrollbar();
    (<any>$('#sportsBookTab_2_1')).perfectScrollbar();



    // console.log(this.matchData)
  }

  activeSportsBook(isSportBook) {
    this.isSportBook = isSportBook;
    this.matchData[0]['isSportBook'] = this.isSportBook;
    $('#page_loading').css('display', 'flex');

  }
  selectSportsBookTab(tab, eventTypeId) {
    this.matchData[0]['sportsBookMarket'] = [];
    $('#page_loading').css('display', 'flex');

  }

  OpneClosePreMarkets(sportBook) {
    if (sportBook['isExpand'] == 0) {
      sportBook['isExpand'] = 1;
      this.openedPremiumMarkets[sportBook.id] = 1;
    } else {
      sportBook['isExpand'] = 0;
      this.openedPremiumMarkets[sportBook.id] = 0;
    }

  }

  getBookMakersData(BMmarket: any[]) {
    this.matchData[0]['BMmarket'] = BMmarket;
  }


  oddsChangeBlink(oldMarkets, newMarkets, type) {

    if (type == 'markets') {
      _.forEach(oldMarkets, (market: any, index: number) => {
        _.forEach(market.Runners, (runner: any, index2: number) => {

          if (runner.ExchangePrices) {
            if (!newMarkets[index]?.Runners[index2]) {
              return;
            }
            let BackRunner = newMarkets[index]?.Runners[index2]?.ExchangePrices.AvailableToBack;

            if (BackRunner) {
              _.forEach(runner.ExchangePrices.AvailableToBack, (value: any, index3: number) => {
                // || value.size != BackRunner[index3]?.size
                if (value.price != BackRunner[index3]?.price || value.size != BackRunner[index3]?.size) {
                  const back = $('#selection_' + this.removeSpace(market.MarketId) + '_' + runner.SelectionId + ' .back-' + (index3 + 1));
                  back.addClass('spark');
                  this.removeChangeClass(back);
                }
              })
            }
          }

          if (runner.ExchangePrices) {
            let LayRunner = newMarkets[index]?.Runners[index2]?.ExchangePrices.AvailableToLay;

            if (LayRunner) {
              _.forEach(runner.ExchangePrices.AvailableToLay, (value: any, index3: number) => {
                // || value.size != LayRunner[index3]?.size
                if (value.price != LayRunner[index3]?.price || value.size != LayRunner[index3]?.size) {
                  const back = $('#selection_' + this.removeSpace(market.MarketId) + '_' + runner.SelectionId + ' .lay-' + (index3 + 1));
                  back.addClass('spark');
                  this.removeChangeClass(back);
                }
              })
            }
          }
        })
      })
    }

    if (type == 'sportbook') {
      _.forEach(oldMarkets, (market: any) => {
        _.forEach(market.sportsBookSelection, (runner: any) => {

          _.forEach(newMarkets, (newmarket: any) => {
            if (newmarket.id == market.id) {
              _.forEach(newmarket.sportsBookSelection, (newrunner: any) => {
                if (runner.id == newrunner.id) {
                  if (runner.odds != newrunner.odds) {
                    const back = $('#sportsBookSelection_' + this.removeSpace(market.id) + '_' + runner.id + ' .back-1');
                    back.addClass('spark');
                    this.removeChangeClass(back);
                  }
                }

              })
            }
          });


        })
      })
    }


  }

  removeChangeClass(changeClass: any) {
    setTimeout(() => {
      changeClass.removeClass('spark');
    }, 300);
  }


  showMinMax(name) {
    console.log(name)
    name = this.removeSpace(name);
    $('#minMaxBox_' + name).fadeIn().css('display', 'flex');
    $('#bookMakerMinMax_' + name).fadeIn().css('display', 'flex');
    $('#fancy_popup_' + name).fadeIn().css('display', 'flex');
  }
  hideMinMax(name) {
    name = this.removeSpace(name);

    $('#minMaxBox_' + name).fadeOut();
    $('#bookMakerMinMax_' + name).fadeOut();
    $('#fancy_popup_' + name).fadeOut();
  }

  showFancyRules(match) {

    if (match.sportId == 85) {
      $('#fancyBetHeader').css('display', 'none');
      $('#fancyBetRules').css('display', 'none');
      $('#electionHeader').css('display', 'block');
      $('#electionRules').css('display', 'block');

    } else {
      $('#fancyBetHeader').css('display', 'block');
      $('#fancyBetRules').css('display', 'block');
      $('#electionHeader').css('display', 'none');
      $('#electionRules').css('display', 'none');
    }
    $('#fancyBetRulesWrap').fadeIn().css('display', 'flex');

  }
  showPremiumRules(match) {
    $('#premiumBetRulesWrap').fadeIn().css('display', 'flex');
  }
  hidePremiumRules() {
    $('#premiumBetRulesWrap').fadeOut();
  }

  hideFancyRules() {
    $('#fancyBetRulesWrap').fadeOut();
  }



  getScoreId(match) {


    this.scoreService.GetScoreId(match.eventId).subscribe((resp: any) => {
      if(resp.result){
        this.score_id = resp.result[0]?.score_id;
        if (this.score_id) {
          this.GetIframeScoreUrl(match)
        }
      }
    }, err => {

    })
  }

  GetIframeScoreUrl(match) {
    // if (this.siteName != 'runexch') {
    //   if (match.eventTypeId == 4) {
    //     let url = 'https://streamingtv.fun/cricket_score/?scoreId=' + this.score_id + '&matchDate=' + match.time;
    //     match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    //   }
    //   if (match.eventTypeId == 1) {
    //     let url = 'https://streamingtv.fun/soccer_score/?scoreId=' + this.score_id + '&matchDate=' + match.time;
    //     match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //     this.scoreHeight = 60;

    //   }
    //   if (match.eventTypeId == 2) {
    //     let url = 'https://streamingtv.fun/tennis_score/?scoreId=' + this.score_id + '&matchDate=' + match.time;
    //     match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //     this.scoreHeight = 160;
    //   }

    //   // let url = 'https://livesportscore.xyz/sport_score/?scoreId=' + this.score_id;
    //   // match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // }
    // else {
    if (match.eventTypeId < 10) {
      this.scoreHeight = 180;
      // let url = 'https://central.satsport247.com/score_widget/' + this.score_id;
      // match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      // if (match.eventTypeId == 4) {
      //   let url = 'https://streamingtv.fun/cricket_score/?scoreId=' + this.score_id + '&matchDate=' + match.time;
      //   match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      // }
      // if (match.eventTypeId == 1) {
      //   let url = 'https://streamingtv.fun/soccer_score/?scoreId=' + this.score_id + '&matchDate=' + match.time;
      //   match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      //   this.scoreHeight = 60;

      // }
      // if (match.eventTypeId == 2) {
      //   let url = 'https://streamingtv.fun/tennis_score/?scoreId=' + this.score_id + '&matchDate=' + match.time;
      //   match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      //   this.scoreHeight = 160;
      // }
      let url = 'https://www.satsports.net/score_widget/index.html?id=' + this.score_id + '&aC=bGFzZXJib29rMjQ3';
      // let url = 'http://localhost:5500/index2.html?id=' + this.score_id + '&aC=bGFzZXJib29rMjQ3';

      match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    // let url = 'https://livesportscore.xyz/sport_score/?scoreId=' + this.score_id;
    // match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // }


  }

  resizeIframe(obj) {
    //  console.log(obj)
    // console.log(obj.screenX, obj.screenY, this.scoreHeight)

    // if (obj.screenX > 320 && obj.screenX < 340 && this.scoreHeight == 180) {
    //   this.scoreHeight = 445;
    // } else if (obj.screenX > 320 && obj.screenX < 340 && this.scoreHeight == 445) {
    //   this.scoreHeight = 180;
    // }

    // obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
  }


  getScore(event) {

    if (event.isKabaddi) {
      return;
    }
    if (this.scoreApiPending) {
      return;
    }
    this.scoreApiPending = true;
    if (((!event.sportradar_url && !this.score_id) || (this.selectedMatch && this.score_id && !this.isSportRadar))) {
      this.scoreService.getScore(event.eventId).subscribe(resp => {
        if (resp.score) {
          // if (this.isVirtual) {

          // } else {
          // }

          if (event.eventTypeId == 4) {
            if (resp.score.score1.indexOf('&') > -1) {
              resp.score['score3'] = resp.score.score1.split('&')[1];
              resp.score.score1 = resp.score.score1.split('&')[0];
            }
            if (resp.score.score2.indexOf('&') > -1) {
              resp.score['score4'] = resp.score.score2.split('&')[1];
              resp.score.score2 = resp.score.score2.split('&')[0];
            }
          }
          // console.log(resp)
          if (event.eventId == resp.eventId) {
            event['fullScore'] = resp;
          }

        }
        this.scoreApiPending = false;
      }, err => {
        this.scoreApiPending = false;
      });
    }
  }

  scoreRun(fullScore) {
    var displayRun = "";
    if (fullScore.stateOfBall != undefined) {
      if (fullScore.stateOfBall.appealTypeName == "Not Out") {
        if (fullScore.stateOfBall.dismissalTypeName == "Not Out") {
          if (fullScore.stateOfBall.bye != "0") {
            return (displayRun =
              fullScore.stateOfBall.bye + " Run (Bye)");
          }
          if (fullScore.stateOfBall.legBye != "0") {
            return (displayRun =
              fullScore.stateOfBall.legBye + " Run (Leg Bye)");
          }
          if (fullScore.stateOfBall.wide != "0") {
            return (displayRun =
              fullScore.stateOfBall.wide + " Run (Wide)");
          }
          if (fullScore.stateOfBall.noBall != "0") {
            return (displayRun =
              fullScore.stateOfBall.batsmanRuns + " Run (No Ball)");
          }
          if (fullScore.stateOfBall.batsmanRuns == "0") {
            return (displayRun = "No Run");
          } else if (fullScore.stateOfBall.batsmanRuns == "1") {
            return (displayRun =
              fullScore.stateOfBall.batsmanRuns + " Run");
          } else if (parseInt(fullScore.stateOfBall.batsmanRuns) > 1) {
            return (displayRun =
              fullScore.stateOfBall.batsmanRuns + " Runs");
          }
          // if (fullScore.stateOfBall.batsmanRuns=="0" && fullScore.stateOfBall.legBye=="0") {
          //  displayRun="No Run";
          // }
          // else if (fullScore.stateOfBall.batsmanRuns!="0" && fullScore.stateOfBall.legBye=="0") {
          //  displayRun=fullScore.stateOfBall.batsmanRuns+" Runs";
          // }
          // else if (fullScore.stateOfBall.batsmanRuns=="0" && fullScore.stateOfBall.legBye!="0") {
          //  displayRun=fullScore.stateOfBall.legBye+" Runs (Leg Bye)";
          // }
        } else {
          return (displayRun =
            "WICKET (" + fullScore.stateOfBall.dismissalTypeName + ")");
        }
      } else {
        if (fullScore.stateOfBall.outcomeId == "0") {
          return (displayRun =
            "Appeal : " + fullScore.stateOfBall.appealTypeName);
        } else {
          return (displayRun = "WICKET (Not Out)");
        }
      }
    }

    // return displayRun;
  };

  getCardTeam(card, team) {
    if (card == "Goal" && team == "home") {
      return "ball-soccer team-a";
    } else if (card == "YellowCard" && team == "home") {
      return "card-yellow team-a";
    } else if (card == "Goal" && team == "away") {
      return "ball-soccer team-b";
    } else if (card == "YellowCard" && team == "away") {
      return "card-yellow team-b";
    }
    // else if (card=="SecondHalfKickOff") {
    //  return 'ball-soccer team-a';
    // }
    else if (card <= 10) {
      return 1;
    } else if (card <= 20) {
      return 2;
    } else if (card <= 30) {
      return 3;
    } else if (card <= 40) {
      return 4;
    } else if (card <= 50) {
      return 5;
    } else if (card <= 60) {
      return 6;
    } else if (card <= 70) {
      return 7;
    } else if (card <= 80) {
      return 8;
    } else if (card <= 90) {
      return 9;
    } else if (card <= 100) {
      return 10;
    }
  };


  openTv(match) {              
      this.scoreApiPending = false;
      if (this.selectedMatch) {
        if (this.selectedMatch.eventId != match.eventId) {
          this.setIframeUrl(match);
        }
        else {
          this.selectedMatch = null;
        }
      }
      else {
        // this.selectedMatch = match;
        this.setIframeUrl(match);
      }

  }
  

  setIframeUrl(match) {

    if (match) {
      this.userService.getliveTvApi(match.eventId).subscribe((resp: any) => {
        if (resp) {
          // resp=JSON.parse(resp);
          // console.log(resp)
          if (resp.streamingUrl) {
            this.selectedMatch = match;

            this.liveUrl = resp.streamingUrl;
            this.liveUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveUrl);
            setTimeout(() => {
              this.hideTvControl();
            }, 500)
            // this.selectedMatch=null;

          } else {
            this.selectedMatch = null;
            $('#openTV').css('display', 'none');
          }
          // else {
          // this.liveUrl = "https://streamingtv.fun/live_tv/index.html?eventId=" + this.selectedMatch.eventId;
          // }

          // if (resp.scoreUrl) {
          //   this.score_id = match.eventId;

          //   if (match.eventTypeId < 10) {
          //     this.scoreHeight = 180;
          //      let url = resp.scoreUrl;
          //       match['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          //   }
          // }



        }
      }, err => {
        // console.log(err)
      })
      // this.liveUrl = "https://streamingtv.fun/live_tv/index.html?eventId=" + this.selectedMatch.eventId;
      // this.liveUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveUrl);
      // setTimeout(() => {
      //   this.hideTvControl();
      // }, 500)
    }

  }

  hideTvControl() {
    let a;
    this.showCloseBtn(true);
    if (a) {
      clearTimeout(a);
    }
    a = setTimeout(() => {
      this.showCloseBtn(false);
    }, 5000)
  }

  showCloseBtn(value) {
    console.log(value);
    if (value) {
      $("#closeStreamingBox").fadeIn();
      // $("#mute").fadeIn();
      // $("#changeLineBtn").fadeIn();
      $("#fullScreen").fadeIn()
    } else {
      $("#closeStreamingBox").fadeOut();
      // $("#mute").fadeOut();
      // $("#changeLineBtn").fadeOut();
      $("#fullScreen").fadeOut()
    }
  }

  afterPlaceBetExposure() {
    _.forEach(this.matchData, (item) => {

      if (this.OpenBetForm.value.mtype == "exchange") {
        _.forEach(item.markets, (item2) => {
          if (this.OpenBetForm.value.marketId == item2.MarketId) {
            this.ExposureBook(item2);
          }
        });
      }

      if (this.OpenBetForm.value.mtype == "book") {
        _.forEach(item.markets, (item2) => {
          if (this.OpenBetForm.value.marketId == item2.MarketId) {
            this.getBmExposureBook(item2);
          }
        });
      }


      if (this.OpenBetForm.value.mtype == "fancy") {
        if (this.OpenBetForm.value.matchBfId == item.eventId) {
          this.getFancyExposure(item);
        }
      }

    });
  }


  ExposureBook(market) {
    if (!this.isLogin) {
      return;
    }

    if (this.expoApiPending) {
      return;
    }

    this.expoApiPending = true;
    this.userService.getBookExposure(market.MarketId).subscribe((resp: any) => {
      // if (resp.errorCode == 0) {
      //   market['pnl'] = resp.result[0];
      // }
      // market['pnl'] = resp.result;
      this.marketsPnl[market.MarketId] = resp.result;

      // console.log(this.marketsPnl)
      this.expoApiPending = false;

    }, err => {
      this.expoApiPending = false;

    })
  }

  getBmExposureBook(market) {
    if (!this.isLogin) {
      return;
    }
    if (!market.MarketId) {
      return;
    }
    let MarketId = "";
    let fSource = this.socketService.getFSource();

    // console.log(fSource)
    if (this.matchData[0].eventTypeId == 52) {
      market.MarketId = market.MarketId.replace('bm_', '');
      MarketId = market.MarketId;
    } else {
      market.MarketId = market.MarketId.replace('bm_', '');
      // MarketId = "bm_" + market.MarketId;
      MarketId = (fSource == '0' ? "bm_" : "bm2_") + market.MarketId;
    }
    if (this.expoApiPending) {
      return;
    }

    this.expoApiPending = true;
    this.userService.getBookMakerBook(MarketId).subscribe((resp: any) => {
      // if (resp.errorCode == 0) {
      //   market['pnl'] = resp.result[0];
      // }
      // market['pnl'] = resp.result;
      this.marketsPnl['bm_' + market.MarketId] = resp.result;
      this.expoApiPending = false;
      // console.log(this.marketsPnl)

    }, err => {
      this.expoApiPending = false;
    })
  }

  getFancyExposure(match) {
    if (!this.isLogin) {
      return;
    }
    if (this.fexpoApiPending) {
      return;
    }

    this.fexpoApiPending = true;
    this.userService.getFancyExposure(match.eventId).subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        this.fancyExposures = resp.result[0];
      }
      this.fexpoApiPending = false;

    }, err => {
      this.fexpoApiPending = false;
    });
  }

  getFancyBook(fancy) {
    this.fancyBookData = [];
    this.userService
      .getFancyBook(fancy.mid, fancy.sid, fancy.nat)
      .subscribe((books: any) => {
        if (books.result.length == 0) {
          return;
        }
        let matrix = (<string>Object.values(books.result[0])[0])
          .replace(/\{|\}/g, '')
          .split(',')
          .map((f) => {
            return f.split(':').map((b: any) => (b = +b));
          });
        // console.log(matrix)

        for (let i = 0; i < matrix.length; i++) {
          let run = matrix[i][0];
          let row = [];
          if (i === 0) {
            row[0] = run + ' and below';
          } else if (i === matrix.length - 1) {
            row[0] = matrix[i - 1][0] + 1 + ' and above';
          } else if (matrix[i - 1][0] + 1 === matrix[i][0]) {
            row[0] = matrix[i][0];
          } else {
            row[0] = matrix[i - 1][0] + 1 + '-' + matrix[i][0];
          }
          row[1] = matrix[i][1];
          this.fancyBookData.push(row);
        }

        $('#fancyBetBookLeftSide').css("display", "flex");
        $('#sideWrap').addClass("left-in");
        setTimeout(() => {
          $('#sideWrap').removeClass("left-in");
        }, 1000);

        console.log(this.fancyBookData)
      });
  }

  closeFancyBook() {
    $('#fancyBetBookLeftSide').css("display", "none");
  }

  marketsNewExposure(bet) {
    _.forEach(this.matchData, (match, matchIndex) => {
      _.forEach(match.markets, (market, mktIndex) => {
        if (bet) {
          let newMktExposure = _.cloneDeep((market.pnl));
          if (!newMktExposure) {
            newMktExposure = [];
          }
          if (bet.stake != null && market.MarketId == bet.bfId && bet.mtype == 'exchange') {
            let selectionPnl = {};
            if (newMktExposure.length == 0) {
              _.forEach(market.Runners, (runner) => {
                selectionPnl[runner.SelectionId] = 0;
              })
              newMktExposure.push(selectionPnl);
            }
            _.forEach(newMktExposure[0], (value, selId) => {
              if (bet.backlay == "back" && bet.selId == selId) {
                if (bet.profit != null) {
                  value = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                  newMktExposure[0][selId] = value;
                }
              }
              if (bet.backlay == "back" && bet.selId != selId) {
                value = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
                newMktExposure[0][selId] = value;
              }
              if (bet.backlay == "lay" && bet.selId == selId) {
                if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                  value = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
                  newMktExposure[0][selId] = value;
                }
              }
              if (bet.backlay == "lay" && bet.selId != selId) {
                if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                  value = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                  newMktExposure[0][selId] = value;
                }
              }
            })

            market['newpnl'] = newMktExposure;
          }
        }
        else {
          market['newpnl'] = null;
        }

      })
      _.forEach(match.BMmarket, (book, bookIndex) => {
        if (bet) {
          let newbookExposure = _.cloneDeep((match.BMmarket.pnl));
          if (!newbookExposure) {
            newbookExposure = [];
          }
          let bookId = match.BMmarket.bm1[0].mid;
          if (bet.stake != null && bookId == bet.bfId && bet.mtype == 'book') {
            let selectionPnl = {};
            if (newbookExposure.length == 0) {
              _.forEach(match.BMmarket.bm1, (runner) => {
                selectionPnl[runner.sid] = 0;
              })
              newbookExposure.push(selectionPnl);
            }
            _.forEach(newbookExposure[0], (value, selId) => {
              if (bet.backlay == "back" && bet.selId == selId) {
                if (bet.profit != null) {
                  newbookExposure[0][selId] = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                }
              }
              if (bet.backlay == "back" && bet.selId != selId) {
                newbookExposure[0][selId] = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
              }
              if (bet.backlay == "lay" && bet.selId == selId) {
                if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                  newbookExposure[0][selId] = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
                }
              }
              if (bet.backlay == "lay" && bet.selId != selId) {
                if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                  newbookExposure[0][selId] = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                }
              }
            })

            match.BMmarket['newpnl'] = newbookExposure;
          }
        }
        else {
          match.BMmarket['newpnl'] = null;
        }
      })

    })

    // console.log(this.matchData)
  }

  convertToFloat(value) {
    return parseFloat(value).toFixed(2);
  }


  getPnlValue(runner, Pnl) {

    let pnl = "";
    if (Pnl) {
      _.forEach(Pnl, (value, index) => {
        if (runner.SelectionId) {
          pnl = value[runner.SelectionId];
        }
        if (runner.sid) {
          pnl = value[runner.sid];
        }
        if (runner.id) {
          pnl = value[runner.id];
        }
      })
    }
    return pnl;
  }



  getPnlClass(runner, Pnl) {
    let pnlClass = "black";
    if (Pnl) {
      _.forEach(Pnl, (value, index) => {
        if (runner.SelectionId) {
          if (parseInt(value[runner.SelectionId]) >= 0) {
            pnlClass = 'win';
          }
          if (parseInt(value[runner.SelectionId]) < 0) {
            pnlClass = 'lose';
          }
        }
        if (runner.sid) {
          if (parseInt(value[runner.sid]) >= 0) {
            pnlClass = 'win';
          }
          if (parseInt(value[runner.sid]) < 0) {
            pnlClass = 'lose';
          }
        }
        if (runner.id) {
          if (parseInt(value[runner.id]) >= 0) {
            pnlClass = 'win';
          }
          if (parseInt(value[runner.id]) < 0) {
            pnlClass = 'lose';
          }
        }
      })
    }
    return pnlClass;
  }

  getPnl2Class(runner, Pnl) {
    let pnlClass = "black";
    if (Pnl) {
      _.forEach(Pnl, (value, index) => {
        if (runner.SelectionId) {
          if (parseInt(value[runner.SelectionId]) >= 0) {
            pnlClass = 'to-win';
          }
          if (parseInt(value[runner.SelectionId]) < 0) {
            pnlClass = 'to-lose';
          }
        }
        if (runner.sid) {
          if (parseInt(value[runner.sid]) >= 0) {
            pnlClass = 'to-win';
          }
          if (parseInt(value[runner.sid]) < 0) {
            pnlClass = 'to-lose';
          }
        }
        if (runner.id) {
          if (parseInt(value[runner.id]) >= 0) {
            pnlClass = 'to-win';
          }
          if (parseInt(value[runner.id]) < 0) {
            pnlClass = 'to-lose';
          }
        }
      })
    }
    return pnlClass;
  }

  openparlay() {
    this.callsportbookmultiapi = true
    $('#parlaypopup').fadeIn()
    // this.OpenBetForm.controls['mtype'].setValue('premium');
    this.getparlaydata();
    this.initOpenBetForm();
    this.loadDataFromLocalStorage()
  }
  getparlaydata() {
    this.localstoragedata = JSON.parse(localStorage.getItem('parlayBetSlip'));
    const existingData = JSON.parse(localStorage.getItem('parlayBetSlip'));
    this.existingArray = existingData ? existingData : [];
    this.betslipItemCount = this.existingArray?.length;
  }
  closeparlay() {
    this.callsportbookmultiapi = false
    $('#parlaypopup').fadeOut()
  }
  loadDataFromLocalStorage() {
    if (this.localstoragedata && this.localstoragedata.length > 0) {
      const activeEntries = this.localstoragedata.filter(entry => entry.apiSiteStatus === "ACTIVE");
      if (activeEntries.length > 0) {
        let betListArray = []
        this.localstoragedata.forEach(entry => {          
          if (entry.apiSiteStatus === 'ACTIVE') {
            let newBet = {
              "betType": entry.backlay,
              "marketId": entry.bfId,
              "eventId": entry.matchBfId,
              "odds": entry.odds, 
              "selId": entry.SelectionId
            };
            betListArray.push(newBet);
            this.listBetArray = betListArray
          }
        });
        const lastData = this.localstoragedata[this.localstoragedata.length - 1]; // Assuming you want the last entry
        this.OpenBetForm.patchValue({
          betType: lastData.backlay,
          marketId: lastData.bfId,
          selId: lastData.selId,
          bfId: lastData.bfId,
          bookId: lastData.bookId,
          bookType: lastData.bookType,
          isActive: lastData.isActive,
          isInplay: lastData.isInplay,
          marketName: lastData.marketName,
          matchBfId: lastData.matchBfId,
          matchName: lastData.matchName,
          odds: this.grandtotalodds,
          rate: lastData.rate,
          runnerName: lastData.runnerName,
          gameType: "parlay",
          tourid: lastData.tourid,
          mtype: "parlay",
          // Repeat for other form fields
        });
        // console.log(this.OpenBetForm.value);
      }

    }
  }
  deletefromparlay(matchBfId: any) {
    const index = this.existingArray.findIndex(item => item.matchBfId === matchBfId);
    if (index !== -1) {
      this.existingArray.splice(index, 1); // Remove the item from the array
      localStorage.setItem('parlayBetSlip', JSON.stringify(this.existingArray)); // Update local storage
      this.getparlaydata(); // Update the betslip item count
    }
  }
  acceptanyodds: boolean = true

  takeAnyOdd(acceptanyodds: any) {
    this.acceptanyodds = !this.acceptanyodds

  }



  OpenBetSlip(event, sportId, tourid, matchBfId, bfId, SelectionId, matchName, marketName, isInplay, runnerName, odds, backlay, score, rate, fancyId, bookId, runnerId, bookType, sportBookType) {

    $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3,#back_1,#lay_1").removeClass("select");

    this.ClearAllSelection();

    var element = event.currentTarget.classList;
    element.add("select");

    this.openBet = {
      sportId, tourid, matchBfId, bfId, SelectionId, matchName, marketName, isInplay, runnerName, odds, backlay, score, rate, fancyId, bookId, runnerId, bookType, sportBookType
    }

    let eventHandle = null;


    if (bfId && SelectionId && !bookType && !fancyId) {
      // if(!odds){
      //   return;
      // }
      this.openBet['mtype'] = "exchange";
      eventHandle = $('#selection_' + this.removeSpace(bfId) + '_' + SelectionId);
      // eventHandle = $('#selection_'+ SelectionId);

    }

    if (bookId && bookType) {
      this.openBet['mtype'] = "book";
      eventHandle = $('#bookMakerSelection_' + matchBfId + '_' + this.removeSpace(bfId) + '_' + SelectionId);
    }
    if (fancyId) {
      this.openBet['mtype'] = "fancy";
      eventHandle = $('#fancyBetMarket_' + fancyId);
    }

    if (sportBookType == 'premium') {
      this.openBet['mtype'] = "premium";
      eventHandle = $('#sportsBookMarket_' + matchBfId + '_' + bfId);
    }

    // console.log(this.openBet);

    this.initOpenBetForm();

    $('.bet_slip-wrap').fadeIn();


    let mainPage = $('#mainWrap');
    // console.log(eventHandle,mainPage)

    setTimeout(() => {
      this.scrollToElement(eventHandle, mainPage);
    }, 10)
  }

  OpenBetSlip_premium_parlay(event, sportId, tourid, matchBfId, bfId, SelectionId, matchName, marketName, isInplay, runnerName, odds,isActive, backlay, score, rate, fancyId, bookId, runnerId, bookType, sportBookType ,apiSiteStatus, marketStatus) {

    if (this.isparlay) {
      this.parlaybet = true
      const betObject = {
        event,
        sportId,
        apiSiteStatus,
        marketStatus,
        tourid,
        matchBfId,
        bfId,
        SelectionId,
        matchName,
        marketName,
        isInplay,
        runnerName,
        odds,
        isActive,
        backlay,
        score,
        rate,
        fancyId,
        bookId,
        runnerId,
        bookType,
        sportBookType,
      };
      const maxLocalStorageItems = 10;
      const existingData = JSON.parse(localStorage.getItem('parlayBetSlip'));
      this.existingArray = existingData ? existingData : [];
      const existingBetIndex = this.existingArray.findIndex(
        (item) => item.matchBfId === betObject.matchBfId
      );

      if (existingBetIndex !== -1) {
        this.existingArray[existingBetIndex] = betObject;
      } else {
        if (this.existingArray.length < maxLocalStorageItems) {
          this.existingArray.push(betObject);
        } else {
          this.toastr.errorMsg("Parlay limit has been reached. Maximum allowed limit is 10")
        }
      }
      this.betslipItemCount = this.existingArray?.length
      if (this.existingArray.length <= maxLocalStorageItems) {
        localStorage.setItem('parlayBetSlip', JSON.stringify(this.existingArray));
      }
    }

    $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3,#back_1,#lay_1").removeClass("select");

    this.ClearAllSelection();

    var element = event.currentTarget.classList;
    element.add("select");

    this.openBet = {
      sportId, tourid, matchBfId, bfId, SelectionId, matchName, marketName, isInplay, runnerName, odds, backlay, score, rate, fancyId, bookId, runnerId, bookType, sportBookType
    }

    let eventHandle = null;


    if (bfId && SelectionId && !bookType && !fancyId) {
      // if(!odds){
      //   return;
      // }
      this.openBet['mtype'] = "exchange";
      eventHandle = $('#selection_' + this.removeSpace(bfId) + '_' + SelectionId);
      // eventHandle = $('#selection_'+ SelectionId);

    }

    if (bookId && bookType) {
      this.openBet['mtype'] = "book";
      eventHandle = $('#bookMakerSelection_' + matchBfId + '_' + this.removeSpace(bfId) + '_' + SelectionId);
    }
    if (fancyId) {
      this.openBet['mtype'] = "fancy";
      eventHandle = $('#fancyBetMarket_' + fancyId);
    }

    if (sportBookType == 'premium') {
      this.openBet['mtype'] = "premium";
      eventHandle = $('#sportsBookMarket_' + matchBfId + '_' + bfId);
    }

    // console.log(this.openBet);

    this.initOpenBetForm();

    $('.bet_slip-wrap').fadeIn();


    let mainPage = $('#mainWrap');
    // console.log(eventHandle,mainPage)

    setTimeout(() => {
      this.scrollToElement(eventHandle, mainPage);
    }, 10)
  }
  scrollToElement(f, g) {
    if (f.length == 0) {
      return
    }

    var c = g.offset().top;
    var h = f.offset().top;
    var d = $("body").scrollTop();
    if (this.orientation == 180 || this.orientation == 0) {
      $("html, body").animate({
        scrollTop: h - c
      }, "fast")
    } else {
      if (this.orientation == 90 || this.orientation == -90) {
        $("html, body").animate({
          scrollTop: h + d
        }, "fast")
      }
    }
  }

  removeSpace(value: any) {
    if (value) {
      value = value.toString();
      return value.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '_');
    }
  }

  confirmBetPop() {
    // console.log(this.OpenBetForm)

    if (this.isLogin) {
      $('#confirmBetPop').fadeIn().css('display', 'flex');
    } else {
          this.router.navigate(['/login']);
    }

  }

  closeLoginApi() {
    $('#loginToGoApi').fadeOut();;
  }


  BetSubmit() {

    if (!this.isLogin) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.OpenBetForm.valid) {
      return;
    }
    if (this.showLoader) {
      return;
    }
    this.showLoader = true;

    $('#loading').css('display', 'flex');
    $('#confirmBetPop').fadeOut();

    let fSource = this.socketService.getFSource();

    let placeData = {};

    if (this.OpenBetForm.value.gameType == "exchange") {
      placeData = {
        "marketId": this.OpenBetForm.value.marketId,
        "selId": this.OpenBetForm.value.selId,
        "odds": this.OpenBetForm.value.odds,
        "stake": this.OpenBetForm.value.stake,
        "betType": this.OpenBetForm.value.betType,
        "gameType": this.OpenBetForm.value.gameType,
        "uid": this.accountInfo.userName

      }
      this.showBetCooldown();

    } else if (this.OpenBetForm.value.gameType == "book") {
      placeData = {
        // "marketId": this.OpenBetForm.value.sportId == 52 ? this.OpenBetForm.value.marketId : "bm_" + this.OpenBetForm.value.marketId,
        "marketId": this.OpenBetForm.value.sportId == 52 ? this.OpenBetForm.value.marketId : (fSource == '0' ? "bm_" : "bm2_") + this.OpenBetForm.value.marketId,
        "selId": this.OpenBetForm.value.selId,
        "odds": this.OpenBetForm.value.odds,
        "stake": this.OpenBetForm.value.stake,
        "betType": this.OpenBetForm.value.betType,
        "gameType": this.OpenBetForm.value.gameType,
        "uid": this.accountInfo.userName,
        "source": fSource

      }
    } else if (this.OpenBetForm.value.gameType == "fancy") {
      placeData = {
        "marketId": "df_" + (this.isVirtual ? ('_' + this.OpenBetForm.value.selId) : (this.OpenBetForm.value.marketId + '_' + this.OpenBetForm.value.selId)),
        "marketName": this.OpenBetForm.value.runnerName,
        "odds": +this.OpenBetForm.value.rate,
        "runs": +this.OpenBetForm.value.runs,
        "stake": +this.OpenBetForm.value.stake,
        "betType": this.OpenBetForm.value.yesno,
        "gameType": this.OpenBetForm.value.gameType,
        "uid": this.accountInfo.userName,
        "source": fSource
      }
    } else if (this.OpenBetForm.value.gameType == "premium") {
      placeData = {
        "eventId": this.OpenBetForm.value.matchBfId,
        "marketId": this.OpenBetForm.value.marketId,
        "selId": this.OpenBetForm.value.selId,
        "odds": this.OpenBetForm.value.odds,
        "stake": this.OpenBetForm.value.stake,
        "betType": this.OpenBetForm.value.betType,
        "gameType": this.OpenBetForm.value.gameType,
        "uid": this.accountInfo.userName

      }
      this.showBetCooldown();

    }
    else if (this.OpenBetForm.value.gameType == "parlay") {
      placeData = {
        "gameType": this.OpenBetForm.value.gameType,
        "stake": this.OpenBetForm.value.stake,
        "takeAnyOdd": this.acceptanyodds,
        "listbets": this.listBetArray
        // Add more items to "listbets" array as needed
      };
    }


    // console.log(placeData);
    if (this.OpenBetForm.value.gameType == "premium") {
      this.userService.placeBetsPremium(placeData).subscribe((resp: any) => {

        if (resp.errorCode == 0) {

          if (resp.result[0]?.reqId && resp.result[0]?.result == "pending") {
            let getResp = resp.result[0];
            // getResp.delay = getResp.delay + 1;
            setTimeout(() => {
              this.requestResult(getResp);
            }, (getResp.delay * 1000) + 500);
          } else {
            this.toastr.successMsg(resp.errorDescription);

            setTimeout(() => {
              if (resp.result[1]) {
                let marketBook = [];
                marketBook.push(resp.result[1]);
                if (resp.result[0].gameType == 'premium') {
                  this.marketsPnl[resp.result[0].marketId] = marketBook;
                  this.userService.setPremiumBook(resp.result[0].marketId, marketBook)
                } else if (resp.result[0].gameType == 'book') {
                  resp.result[0].marketId = resp.result[0].marketId.replace('bm2_', 'bm_');
                  this.marketsPnl[resp.result[0].marketId] = marketBook;
                } else {
                  this.afterPlaceBetExposure();
                }
              } else {
                this.afterPlaceBetExposure();
              }
              if (resp.result[2] && resp.result[3]) {
                this.shareService.shareUpdateFundExpo(resp.result);
              } else {
                this.shareService.shareUpdateFundExpo('event');
              }
              this.OpenBetForm.reset();
              this.ClearAllSelection();
              this.showLoader = false;
              $('#loading').css('display', 'none');
            }, 500);
          }
        }
        else {
          // this.toastr.error(resp.errorDescription);
          this.toastr.errorMsg(resp.errorDescription);
          this.showLoader = false;
          $('#loading').css('display', 'none');

        }


      }, err => {
        this.showLoader = false;
        $('#loading').css('display', 'none');

      })
    }
    else if (this.OpenBetForm.value.gameType == "parlay") {
      this.userService.placeBetsParlay(placeData).subscribe((resp: any) => {

        if (resp.errorCode == 0) {

          if (resp.result[0]?.reqId && resp.result[0]?.result == "pending") {
            let getResp = resp.result[0];
            // getResp.delay = getResp.delay + 1;
            setTimeout(() => {
              this.requestResult(getResp);
            }, (getResp.delay * 1000) + 500);
          } else {
            this.toastr.successMsg(resp.errorDescription);

            setTimeout(() => {
              if (resp.result[1]) {
                let marketBook = [];
                marketBook.push(resp.result[1]);
                if (resp.result[0].gameType == 'premium') {
                  this.marketsPnl[resp.result[0].marketId] = marketBook;
                  this.userService.setPremiumBook(resp.result[0].marketId, marketBook)
                } else if (resp.result[0].gameType == 'book') {
                  resp.result[0].marketId = resp.result[0].marketId.replace('bm2_', 'bm_');
                  this.marketsPnl[resp.result[0].marketId] = marketBook;
                } else {
                  this.afterPlaceBetExposure();
                }
              } else {
                this.afterPlaceBetExposure();
              }
              if (resp.result[2] && resp.result[3]) {
                this.shareService.shareUpdateFundExpo(resp.result);
              } else {
                this.shareService.shareUpdateFundExpo('event');
              }
              this.OpenBetForm.reset();
              this.ClearAllSelection();
              this.showLoader = false;
              $('#loading').css('display', 'none');
            }, 500);
          }
          $('#parlaypopup').fadeOut()
          this.getparlaydata()
          this.betslipItemCount = null
          this.callsportbookmultiapi = false
          localStorage.removeItem('parlayBetSlip')

        }
        else {
          // this.toastr.error(resp.errorDescription);
          this.toastr.errorMsg(resp.errorDescription);
          this.showLoader = false;
          $('#loading').css('display', 'none');

        }


      }, err => {
        this.showLoader = false;
        $('#loading').css('display', 'none');

      })
    }
     else {
      this.userService.placeBet(placeData).subscribe((resp: any) => {

        if (resp.errorCode == 0) {

          if (resp.result[0]?.reqId && resp.result[0]?.result == "pending") {
            let getResp = resp.result[0];
            // getResp.delay = getResp.delay + 1;
            setTimeout(() => {
              this.requestResult(getResp);
            }, (getResp.delay * 1000) + 500);
          } else {
            this.toastr.successMsg(resp.errorDescription);

            setTimeout(() => {
              if (resp.result[1]) {
                let marketBook = [];
                marketBook.push(resp.result[1]);
                if (resp.result[0].gameType == 'exchange') {
                  this.marketsPnl[resp.result[0].marketId] = marketBook;
                } else if (resp.result[0].gameType == 'book') {
                  resp.result[0].marketId = resp.result[0].marketId.replace('bm2_', 'bm_');
                  this.marketsPnl[resp.result[0].marketId] = marketBook;
                } else {
                  this.afterPlaceBetExposure();
                }
              } else {
                this.afterPlaceBetExposure();
              }
              if (resp.result[2] && resp.result[3]) {
                this.shareService.shareUpdateFundExpo(resp.result);
              } else {
                this.shareService.shareUpdateFundExpo('event');
              }
              this.OpenBetForm.reset();
              this.ClearAllSelection();
              this.showLoader = false;
              $('#loading').css('display', 'none');
            }, 500);
          }
        }
        else {
          this.toastr.errorMsg(resp.errorDescription); 
          this.showLoader = false;
          $('#loading').css('display', 'none');

        }


      }, err => {
        this.showLoader = false;
        $('#loading').css('display', 'none');

      })
    }



  }

  WLIDMapping(errorDescription: string): number {
    const match = errorDescription.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  requestResult(data) {

    // console.log(data)
    this.userService.requestResult(data.reqId).subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        if (resp.result[0].result == "pending") {
          setTimeout(() => {
            this.requestResult(data);
          }, 500)
        } else {
          if (resp.errorDescription == 'Bet placed successfully') {
            let msgData = {
              msg: 'Bet Matched',
              backlay: resp.result[0].betType,
              runnerName: resp.result[0].selName,
              stake: resp.result[0].stake,
              odds: resp.result[0].odds,
              mtype: resp.result[0].gameType,
              score: resp.result[0].runs,
              rate: resp.result[0].odds,
            }
            this.toastr.successMsg(msgData);
            localStorage.removeItem('parlayBetSlip')

          } else {
            this.toastr.successMsg(resp.errorDescription);
          }
          this.toastr.successMsg(resp.errorDescription);
          

          // this.toastr.success(resp.errorDescription);

          setTimeout(() => {
            if (resp.result[1]) {
              let marketBook = [];
              marketBook.push(resp.result[1]);
              if (resp.result[0].gameType == 'exchange') {
                this.marketsPnl[resp.result[0].marketId] = marketBook;
              } else if (resp.result[0].gameType == 'premium') {
                this.marketsPnl[resp.result[0].marketId] = marketBook;
                this.userService.setPremiumBook(resp.result[0].marketId, marketBook)
              } else if (resp.result[0].gameType == 'book') {
                resp.result[0].marketId = resp.result[0].marketId.replace('bm2_', 'bm_');
                this.marketsPnl[resp.result[0].marketId] = marketBook;
              } else {
                this.afterPlaceBetExposure();
              }
            } else {
              this.afterPlaceBetExposure();
            }
            if (resp.result[2] && resp.result[3]) {
              this.shareService.shareUpdateFundExpo(resp.result);
            } else {
              this.shareService.shareUpdateFundExpo('event');
            }
            this.OpenBetForm.reset();
            this.ClearAllSelection();
            this.showLoader = false;
            $('#loading').css('display', 'none');
          }, 500);
        }
      }
      else {
        // this.toastr.error(resp.errorDescription);
        this.toastr.errorMsg(resp.errorDescription);
        this.showLoader = false;
        $('#loading').css('display', 'none');
      }
    }, err => {
      this.showLoader = false;
      $('#loading').css('display', 'none');

    })
  }

  showBetCooldown() {
    if (this.openBet) {
      _.forEach(this.matchData, (event) => {
        // event.isBettable = !this.showLoader;
        _.forEach(event.markets, (market) => {
          if (market.MarketId == this.openBet.bfId) {
            // market['isBettable'] = this.showLoader;
          }
        })
      });
    }
  }



  //OPEN BET SLIP CALC


  typingSign(type) {
    if (type == "odds") {
      this.OpenBetForm.controls['odds'].setValue('');
      this.OpenBetForm.controls['oddsTyping'].setValue(true);
      this.OpenBetForm.controls['stakeTyping'].setValue(false);
    } else {
      this.OpenBetForm.controls['stake'].setValue('');
      this.OpenBetForm.controls['stakeTyping'].setValue(true);
      this.OpenBetForm.controls['oddsTyping'].setValue(false);
    }
    this.calcProfit();
  }

  buttonInput(input) {
    if (this.OpenBetForm.value.stakeTyping) {
      if (input == ".") {
        return false;
      }
      if (parseInt(this.OpenBetForm.value.stake) >= 100000000) {
        this.OpenBetForm.controls['stake'].setValue(100000000);
      } else {
        this.OpenBetForm.controls['stake'].setValue(this.OpenBetForm.value.stake + input);
      }
    } else if (this.OpenBetForm.value.oddsTyping) {
      var odds = parseFloat(this.OpenBetForm.value.odds);
      if (odds >= 1000) {
        this.OpenBetForm.controls['odds'].setValue(1000);
      } else {
        if (this.OpenBetForm.value.odds.indexOf(".") != -1 && input == ".") {
          return false;
        } else if (this.OpenBetForm.value.odds.indexOf(".") != -1) {
          var number = this.OpenBetForm.value.odds.split(".");
          if (number[1].length > 1) {
            return false;
          }
        }
        this.OpenBetForm.controls['odds'].setValue(this.OpenBetForm.value.odds + input);
      }
    }

    this.calcProfit();
  }
  buttonDelete() {
    if (this.OpenBetForm.value.stakeTyping) {
      if (this.OpenBetForm.value.stake) {
        this.OpenBetForm.controls['stake'].setValue(this.OpenBetForm.value.stake.toString().slice(0, -1));
      }
    } else if (this.OpenBetForm.value.oddsTyping) {
      this.OpenBetForm.controls['odds'].setValue(this.OpenBetForm.value.odds.toString().slice(0, -1));
    }
    this.calcProfit();
  }


  addStake(stake) {
    if (!this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(stake.toFixed(0));
    }
    else if (this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue((parseFloat(this.OpenBetForm.value.stake) + stake).toFixed(0))
    }

    this.calcProfit();
  }

  clearStake() {
    this.OpenBetForm.controls['stake'].setValue(null);
    this.calcProfit();
  }

  ClearAllSelection() {
    this.openBet = null;
    this.marketsNewExposure(this.openBet);
    // $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
    $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3,#back_1,#lay_1").removeClass("select");
    $('#confirmBetPop').fadeOut();
  }


  update() {
    this.calcProfit();
  }

  incOdds() {
    if (!this.OpenBetForm.value.odds) {
      this.OpenBetForm.controls['odds'].setValue(1.00);
    }
    if (parseFloat(this.OpenBetForm.value.odds) >= 1000) {
      this.OpenBetForm.controls['odds'].setValue(1000);
      this.calcProfit();
      return false;
    }
    let odds = parseFloat(this.OpenBetForm.value.odds);
    this.OpenBetForm.controls['odds'].setValue(this.oddsDecimal(odds + this.oddsDiffCalc(odds)));

    this.calcProfit();
    // this.calcExposure(bet);
  }

  decOdds() {
    if (this.OpenBetForm.value.odds == "" || this.OpenBetForm.value.odds == null || parseFloat(this.OpenBetForm.value.odds) <= 1.01) {
      this.OpenBetForm.controls['odds'].setValue(1.01);
      this.calcProfit();
      return false;
    }
    let odds = parseFloat(this.OpenBetForm.value.odds);
    this.OpenBetForm.controls['odds'].setValue(this.oddsDecimal(odds - this.oddsDiffCalc(odds)));

    this.calcProfit();
    // this.calcExposure(bet);
  }

  incStake() {
    if (!this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(0);
    }

    if (this.OpenBetForm.value.stake > -1) {
      let stake = parseInt(this.OpenBetForm.value.stake);
      this.OpenBetForm.controls['stake'].setValue(stake + this.stakeDiffCalc(stake));
      this.calcProfit();
    }
  }

  decStake() {

    if (this.OpenBetForm.value.stake <= 0) {
      this.OpenBetForm.controls['stake'].setValue("");
      return false;
    }

    if (!this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(0);
    }

    if (this.OpenBetForm.value.stake > -1) {
      let stake = parseInt(this.OpenBetForm.value.stake);
      this.OpenBetForm.controls['stake'].setValue(stake - this.stakeDiffCalc(stake));
      this.calcProfit();
    }
  }

  calcProfit() {
    // console.log(this.OpenBetForm.value)
    if (this.OpenBetForm.value.stake === "" || this.OpenBetForm.value.stake === 0) {
      this.OpenBetForm.controls['profit'].setValue(0);
      this.OpenBetForm.controls['loss'].setValue(0);
    }
    if (this.OpenBetForm.value.stake &&
      this.OpenBetForm.value.odds &&
      this.OpenBetForm.value.mtype == 'exchange') {
      if (this.OpenBetForm.value.backlay == "back") {
        this.OpenBetForm.controls['profit'].setValue(
          ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
        this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
      } else {
        this.OpenBetForm.controls['loss'].setValue(
          ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
        this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
      }

    }

    if (this.OpenBetForm.value.stake &&
      this.OpenBetForm.value.odds &&
      this.OpenBetForm.value.mtype == 'book') {

      if (this.OpenBetForm.value.bookType == "Bookmaker") {
        if (this.OpenBetForm.value.backlay == "back") {
          this.OpenBetForm.controls['profit'].setValue(((parseFloat(this.OpenBetForm.value.odds) * this.OpenBetForm.value.stake) / 100).toFixed(2));
          this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
        } else {
          this.OpenBetForm.controls['loss'].setValue(((parseFloat(this.OpenBetForm.value.odds) * this.OpenBetForm.value.stake) / 100).toFixed(2));
          this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
        }
      }

      if (this.OpenBetForm.value.bookType == 2) {
        if (this.OpenBetForm.value.backlay == "back") {
          this.OpenBetForm.controls['profit'].setValue(
            ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
          this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
        } else {
          this.OpenBetForm.controls['loss'].setValue(
            ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
          this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
        }
      }
    }

    if (this.OpenBetForm.value.rate && this.OpenBetForm.value.score && this.OpenBetForm.value.mtype == 'fancy') {
      if (this.OpenBetForm.value.backlay == "back") {
        this.OpenBetForm.controls['profit'].setValue((parseFloat(this.OpenBetForm.value.rate) * this.OpenBetForm.value.stake) / 100);
        this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
      } else {
        this.OpenBetForm.controls['loss'].setValue((parseFloat(this.OpenBetForm.value.rate) * this.OpenBetForm.value.stake) / 100);
        this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
      }
    }
    if (this.OpenBetForm.value.stake == null) {
      this.OpenBetForm.controls['profit'].setValue(0);
    }
    if (this.OpenBetForm.value.stake &&
      this.OpenBetForm.value.odds &&
      this.OpenBetForm.value.mtype == 'premium') {
      if (this.OpenBetForm.value.backlay == "back") {
        this.OpenBetForm.controls['profit'].setValue(
          ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
        this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
      } else {
        this.OpenBetForm.controls['loss'].setValue(
          ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
        this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
      }

    }
    if (this.OpenBetForm.value.stake &&
      this.OpenBetForm.value.odds &&
      this.OpenBetForm.value.mtype == 'parlay') {        
      if (this.OpenBetForm.value.betType == "back") {
        this.OpenBetForm.controls['profit'].setValue(
          ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
        this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
      } else {
        this.OpenBetForm.controls['loss'].setValue(
          ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
        this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
      }

    }
    // console.log(this.OpenBetForm.value);

    this.marketsNewExposure(this.OpenBetForm.value);
  }

  oddsDecimal(value) {
    return (value == null || value == '' || (parseFloat(value) > 19.5)) ? value : ((parseFloat(value) > 9.5) ? parseFloat(value).toFixed(1) : parseFloat(value).toFixed(2));
  }

  oddsDiffCalc(currentOdds) {
    var diff;
    if (currentOdds < 2) {
      diff = 0.01
    } else if (currentOdds < 3) {
      diff = 0.02
    } else if (currentOdds < 4) {
      diff = 0.05
    } else if (currentOdds < 6) {
      diff = 0.10
    } else if (currentOdds < 10) {
      diff = 0.20
    } else if (currentOdds < 20) {
      diff = 0.50
    } else if (currentOdds < 30) {
      diff = 1.00
    } else {
      diff = 2.00
    }
    return diff
  }

  stakeDiffCalc(currentStake) {
    var diff;
    if (currentStake <= 10) {
      diff = 1
    } 
    else if(currentStake <= 50) {
      diff = 5
    } else if (currentStake <= 100) {
      diff = 10
    } else if (currentStake <= 1000) {
      diff = 100
    } else if (currentStake <= 10000) {
      diff = 1000
    } else if (currentStake <= 100000) {
      diff = 10000
    } else if (currentStake <= 1000000) {
      diff = 100000
    } else if (currentStake <= 10000000) {
      diff = 1000000
    } else if (currentStake <= 100000000) {
      diff = 10000000
    } else {
      diff = 100000000
    }


    return diff
  }

  //CLOSE BET SLIP CALC



  trackByEvent(index, item) {
    return item.eventId;
  }
  trackByMkt(index, item) {
    return item.MarketId;
  }
  trackByRunner(index, item) {
    return item.SelectionId;
  }

  trackBybookId(index, item) {
    return item.id;
  }

  trackByBookRunner(index, item) {
    return item.name;
  }

  trackBySportBook(index, item) {
    return item.id;
  }

  trackByFancy(index, item) {
    return item.id;
  }

  trackByFn(index, item) {
    return item.sid;
  }

  trackByBet(bet) {
    return bet.id;
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  getDataByType(data) {

  }

  ngOnDestroy() {
    $('#openTV').css('display', 'none');
    this.shareService.activeMatch.emit(null);
    this.socketService.closeConnection();
    this.subSink.unsubscribe();
    if (this.scoreInterval) {
      clearInterval(this.scoreInterval);
    }
    if (this.matchData[0]) {
      this.matchData[0].markets = [];
      this.matchData[0].BMmarket = [];
      this.matchData[0].Fancymarket = [];
      this.matchData[0].sportsBookMarket = [];

    }
    this.matchData = [];

  }

}
