import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { ClientApiService } from 'src/app/services/client-api.service';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-col-right',
  templateUrl: './col-right.component.html',
  styleUrls: ['./col-right.component.scss']
})
export class ColRightComponent implements OnInit, OnDestroy {
  private readonly idToNameMap: { [key: number]: string } = {
    2: "Whitelabel",
    3: "Admin",
    4: "Subadmin",
    5: "Supermaster",
    6: "Master",
    7: "Agent",
    8: "Client"
  };

  siteName = environment.siteName;
  
  OpenBetForm: FormGroup;
  stakeSetting = [];

  openBet: any;
  showLoader: boolean = false;

  deviceInfo: any;
  context: any;

  status: string = "";
  msgData: any;
  timeoutReset: any;

  eventBets = [];
  totalBets = 0;
  marketBets: any;
  selectedMarket: any = "";

  isCheckedBetInfo: boolean = false;
  isCheckedAverageOdds: boolean = false;

  isLogin: boolean = false;

  BetSlipSubscription!: Subscription;
  BetStakeSubscription!: Subscription;
  toasterSubscription!: Subscription;
  eventBetsSubscription!: Subscription;

  accountInfo: any;
  OneClickBet: any;
  Update: any;

  constructor(
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private fb: FormBuilder,
    private deviceService: DeviceDetectorService,
    private tokenService: TokenService,
    private toastr: ToastMessageService,
    private userService: ClientApiService
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

  }

  ngOnInit(): void {
    this.OpenBetSlip();
    this.getBetStakeSetting();
    this.epicFunction();
    this.UserDescription();
    this.getToastMessage();
    this.getMatchedUnmatchBets();
    this.getlanguages();
  }

  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
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
    if (this.openBet) {
      this.initOpenBetForm();
    }

  }

  initOpenBetForm() {
    this.OpenBetForm = this.fb.group({
      sportId: [this.openBet.sportId],
      tourid: [this.openBet.tourid],
      matchBfId: [this.openBet.matchBfId],
      matchId: [this.openBet.matchId],
      eventId: [this.openBet.matchId],
      bfId: [this.openBet.bfId],
      marketId: [this.openBet.bfId],
      mktBfId: [this.openBet.bfId],
      mktId: [this.openBet.mktId],
      selId: [this.openBet.SelectionId],
      matchName: [this.openBet.matchName],
      marketName: [this.openBet.marketName],
      mktname: [this.openBet.marketName],
      isInplay: [this.openBet.isInplay],
      runnerName: [this.openBet.runnerName],
      odds: [this.openBet.odds],
      bookodds: [{ value: this.openBet.odds, disabled: true }],
      backlay: [this.openBet.backlay],
      betType: [this.openBet.backlay],
      yesno: [this.openBet.backlay == "back" ? 'yes' : 'no'],
      score: [this.openBet.score],
      runs: [this.openBet.score],
      rate: [this.openBet.rate],
      fancyId: [this.openBet.fancyId],
      bookId: [this.openBet.bookId],
      runnerId: [this.openBet.runnerId],
      bookType: [this.openBet.bookType],
      stake: [this.openBet.stake],
      profit: [0],
      loss: [0],
      mtype: [this.openBet.mtype],
      gameType: [this.openBet.mtype],
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

  getToastMessage() {
    this.toasterSubscription = this.toastr.successMsgSource.subscribe(data => {
      // console.log(data)
      this.status = 'success';
      this.msgData = data;
      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    })
    this.toastr.errorMsgSource.subscribe(data => {
      // console.log(data)

      this.status = 'error';
      this.msgData = data;

      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    })
  }

  removeMsg() {
    this.msgData = null;
    clearTimeout(this.timeoutReset);
  }

 

  OpenBetSlip() {
    if (this.BetSlipSubscription) {
      this.openBet = null;
      this.BetSlipSubscription.unsubscribe();
    }
    this.BetSlipSubscription = this.shareService.betSlipData$.subscribe(data => {
      if (data) {
        // console.log(data);
        this.openBet = data;
        this.initOpenBetForm();
        $('.slip-wrap').removeClass('close');
        if (this.dfService.getOneClickSetting()) {
          this.OneClickBet = JSON.parse(this.dfService.getOneClickSetting());
        }
        if (this.OneClickBet?.isOneClickBet) {
          this.BetSubmit();
        }
      }
    })
  }


  BetSubmit() {
    // console.log(this.OpenBetForm)
    if (!this.isLogin) {
      return;
    }

    if (!this.OpenBetForm.valid || this.showLoader) {
      return;
    }
    // console.log(this.OpenBetForm.value)
    this.showLoader = true;

    // this.dfService.showBetLoader.emit(this.showLoader);

    // $('#loading').css('display', 'flex');
    $('#confirmBetPop').fadeOut();

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
      // this.showBetCooldown();

    } else if (this.OpenBetForm.value.gameType == "book") {
      placeData = {
        "marketId": "bm_" + this.OpenBetForm.value.marketId,
        "selId": this.OpenBetForm.value.selId,
        "odds": this.OpenBetForm.value.odds,
        "stake": this.OpenBetForm.value.stake,
        "betType": this.OpenBetForm.value.betType,
        "gameType": this.OpenBetForm.value.gameType,
        "uid": this.accountInfo.userName
      }
    }
    else if (this.OpenBetForm.value.gameType == "casino") {
      placeData = {
        "selId": this.OpenBetForm.value.selId,
        "odds": this.OpenBetForm.value.odds,
        "stake": this.OpenBetForm.value.stake,
        "betType": this.OpenBetForm.value.betType,
        "gameType": this.OpenBetForm.value.matchName,
        "round": this.OpenBetForm.value.matchBfId,
        "cards": this.openBet.cards,
        "uid": this.accountInfo.userName
      }
    }

    // console.log(placeData);

    if (this.OpenBetForm.value.gameType == "exchange") {
      this.userService.placeBet(placeData).subscribe((resp: any) => {

        if (resp.errorCode == 0) {
          if (resp.result[0].reqId && resp.result[0].result == "pending") {
            let getResp = resp.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              this.requestResult(getResp, placeData);
            }, (getResp.delay * 1000)+500);
          } else {
            let respData = this.OpenBetForm.value;
            respData['msg'] = resp.errorDescription;
            this.toastr.successMsg(respData);
            // this.toastr.successMsg(resp.errorDescription);

            setTimeout(() => {
              // this.afterPlaceBetExposure();
              if (resp.result[1]) {
                this.marketsNewExposure(resp);
              } else {
                this.marketsNewExposure('afterPlace');
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
          let respData = this.OpenBetForm.value;
          const match = resp.errorDescription?.match(/Bet Blocked On This Sport By (\d+)/);
            if (match) {
              const id = parseInt(match[1], 10);
              if (this.idToNameMap[id]) {
                resp.errorDescription = `Bet Blocked On This Sport By ${this.idToNameMap[id]}`;
              }
            }
          respData['msg'] = resp.errorDescription;
          this.toastr.errorMsg(respData);
          // this.toastr.errorMsg(resp.errorDescription);
          this.showLoader = false;
          $('#loading').css('display', 'none');

        }
      }, err => {
        this.showLoader = false;
        $('#loading').css('display', 'none');

      })
    } else if (this.OpenBetForm.value.gameType == "casino") {
      this.userService.placeTpBet(placeData).subscribe((resp: any) => {
        if (resp.errorCode == 0) {
          if (resp.result[0].reqId && resp.result[0].result == "pending") {
            let getResp = resp.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              this.requestResult(getResp, placeData);
            }, (getResp.delay * 1000)+500);
          } else {
            let respData = this.OpenBetForm.value;
            respData['msg'] = resp.errorDescription;
            this.toastr.successMsg(respData);
            // this.toastr.successMsg(resp.errorDescription);
            setTimeout(() => {
              // this.afterPlaceBetExposure();
              // this.marketsNewExposure('afterPlace');
              if (resp.result[1]) {
                this.shareService.shareCallTpExpoData(resp.result[1]);
              } else {
                this.shareService.shareCallTpExpoData(placeData);
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
          let respData = this.OpenBetForm.value;
          const match = resp.errorDescription?.match(/Bet Blocked On This Sport By (\d+)/);
            if (match) {
              const id = parseInt(match[1], 10);
              if (this.idToNameMap[id]) {
                resp.errorDescription = `Bet Blocked On This Sport By ${this.idToNameMap[id]}`;
              }
            }
          respData['msg'] = resp.errorDescription;
          this.toastr.errorMsg(respData);
          // this.toastr.errorMsg(resp.errorDescription);
          this.showLoader = false;
          $('#loading').css('display', 'none');

        }
      }, err => {
        this.showLoader = false;
        $('#loading').css('display', 'none');

      })
    }



  }

  requestResult(data, placeData) {

    // console.log(data)
    this.userService.requestResult(data.reqId).subscribe((resp: any) => {

      if (resp.errorCode == 0) {
        if (resp.result[0].result == "pending") {
          setTimeout(() => {
            this.requestResult(data, placeData);
          }, 500)
        } else {
          let respData = this.OpenBetForm.value;
          respData['msg'] = resp.errorDescription;
          this.toastr.successMsg(respData);
          // this.toastr.successMsg(resp.errorDescription);

          setTimeout(() => {
            // this.afterPlaceBetExposure();
            if (resp.result[0].gameType == 'exchange') {
              if (resp.result[1]) {
                this.marketsNewExposure(resp);
              } else {
                this.marketsNewExposure('afterPlace');
              }
            } else {
              if (resp.result[1]) {
                resp.result[1]['gt'] = resp.result[0].gameType;
                this.shareService.shareCallTpExpoData(resp.result[1]);
              } else {
                this.shareService.shareCallTpExpoData(placeData);
              }
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
        let respData = this.OpenBetForm.value;
        const match = resp.errorDescription?.match(/Bet Blocked On This Sport By (\d+)/);
            if (match) {
              const id = parseInt(match[1], 10);
              if (this.idToNameMap[id]) {
                resp.errorDescription = `Bet Blocked On This Sport By ${this.idToNameMap[id]}`;
              }
            }
        respData['msg'] = resp.errorDescription;
        this.toastr.errorMsg(respData);
        // this.toastr.errorMsg(resp.errorDescription);
        this.showLoader = false;
        $('#loading').css('display', 'none');

      }
    }, err => {
      this.showLoader = false;
      $('#loading').css('display', 'none');

    })
  }


  marketsNewExposure(bet) {
    this.shareService.shareBetExpoData(bet);
  }

  //OPEN BET SLIP CALC

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
    this.shareService.shareBetSlipData(this.openBet);
    this.shareService.shareCallTpExpoData('clearSelection');

    $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
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
    console.log(this.OpenBetForm.value)
    if (this.OpenBetForm.value.stake &&
      this.OpenBetForm.value.odds &&
      this.OpenBetForm.value.mtype == 'exchange' || this.OpenBetForm.value.mtype == 'casino') {
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


    if (currentStake <= 50) {
      diff = 1
    } else if (currentStake <= 100) {
      diff = 5
    } else if (currentStake <= 500) {
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



  getMatchedUnmatchBets() {

    this.eventBetsSubscription = this.shareService.listBets$.subscribe((data: any) => {
      // console.log(data, "list");
      if (data) {
        this.eventBets = data.matchWiseBets;
        this.totalBets = data.totalBets;

        // console.log(this.eventBets);
        if (this.eventBets.length > 0) {
          this.openMarketBets(this.eventBets[0].markets[0]);
        }

        if (this.totalBets != data.totalBets) {
          this.eventBets = data.matchWiseBets;
          this.totalBets = data.totalBets;

          if (this.eventBets.length > 0) {
            this.openMarketBets(this.eventBets[0].markets[0]);
          }
        }

        _.forEach(data.matchWiseBets, match => {
          _.forEach(match.markets, market => {
            if (market.name == this.marketBets.name && market.marketId == this.marketBets.marketId) {
              this.marketBets = market;
            }
          });
        });
      }
    })


    // let allbets;
    // this.eventBetsSubscription = this.dfService.allMatchUnmatchBetsSource.subscribe(data => {
    //   // console.log(data);

    //   if (data != null) {
    //     allbets = this.dfService.matchUnmatchBetsMarketWise(data._userMatchedBets);
    //     // this.eventBets = allbets.matchWiseBets;
    //     // console.log(allbets)
    //     if (!this.eventBets) {
    //       this.eventBets = allbets.matchWiseBets;
    //       this.totalBets = allbets.totalBets;

    //       if (this.eventBets.length > 0) {
    //         this.openMarketBets(this.eventBets[0].markets[0]);
    //       }
    //     }
    //     if (this.totalBets != allbets.totalBets) {
    //       this.eventBets = allbets.matchWiseBets;
    //       this.totalBets = allbets.totalBets;

    //       if (this.eventBets.length > 0) {
    //         this.openMarketBets(this.eventBets[0].markets[0]);
    //       }
    //     }

    //     // this.totalBets = allbets.totalBets;

    //     _.forEach(allbets.matchWiseBets, match => {
    //       _.forEach(match.markets, market => {
    //         if (market.name == this.marketBets.name && market.marketId == this.marketBets.marketId) {
    //           this.marketBets = market;
    //         }
    //       });
    //     });


    //     // console.log(allbets.matchWiseBets)
    //   }
    // })
  }



  openMarketBets(marketBets) {
    this.marketBets = marketBets;
    // console.log(this.marketBets)
    this.selectedMarket = this.marketBets;
  }





  trackByMatch(match) {
    return match.matchId;
  }
  trackByMarket(market) {
    return market.marketId;
  }
  trackByBetType(bet) {
    return bet.betType;
  }
  trackByBet(bet) {
    return bet.id;
  }


  betInfo() {
    this.isCheckedBetInfo = !this.isCheckedBetInfo;
  }
  averageOdds() {
    this.isCheckedAverageOdds = !this.isCheckedAverageOdds;
  }

  ngOnDestroy(): void {
    this.openBet = null;
    this.shareService.shareBetSlipData(null);
    if (this.BetSlipSubscription) {
      this.BetSlipSubscription.unsubscribe();
    }
  }

}
