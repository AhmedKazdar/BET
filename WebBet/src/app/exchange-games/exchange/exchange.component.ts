import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ExchGamesService } from 'src/app/services/exchgames.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {

  gameName: string;
  gameId: number;
  gameStartDate: any;
  toasterSubscription!: Subscription;
  apiPending: boolean = true;


  exchData: any;
  gameData: any;
  runnerGameData: any = {};

  markets: any;

  previousMarket = 0;
  marketId = 0;


  selectIndex = 0;

  exchPnl: any

  marketsMap = {
    MainBets: 'Main market',
    SideBets: 'Side bets market',
  };

  statusMap = {
    SUSPENDED_GAME_SETTLING: 'Game Over Settiling in Progress',
    SUSPENDED_GAME_PLAYING: 'Dealing',
    SUSPENDED_GAME_ROUND_OVER: 'Round Over',
  };
  playerStatusMap = {
    IN_PLAY: '',
    STOOD: 'Stand',
    LOSER: 'Loser',
    WINNER: 'Winner',
    HIT: 'Dealing',
  };


  status: string = "";
  msgData: any;
  timeoutReset;
  holdemRoundList = [
    { id: 1, name: 'Deal' },
    { id: 2, name: 'Preflop' },
    { id: 3, name: 'Flop' },
    { id: 4, name: 'Turn' },
    { id: 5, name: 'River' },
  ];

  exchSource = interval(1000);

  isShowResults = false;
  results: any;
  isShowRules = false


  OpenBetForm!: FormGroup;
  openBet: any;
  stakeSetting = [];
  showLoader: boolean = false;

  exchSubscription;

  orientation: number = 0;

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    // console.log('orientationChanged');
    // console.log("the orientation of the device is now " + event.target.screen.orientation.angle);
    this.orientation = event.target.screen.orientation.angle;
  }

  constructor(
    private route: ActivatedRoute,
    private exchService: ExchGamesService,
    private main: MainService,
    private fb: FormBuilder,
    private shareService: ShareDataService,
    private toastr: ToastMessageService,
  ) {
    this.route.params.subscribe(params => {
      console.log(params);
      this.gameName = params.gameName;
      $('#page_loading').css('display', 'block');

    });
  }

  ngOnInit(): void {

    this.getToastMessage()
    this.main.apis$.subscribe((res) => {

      this.exchSubscription = this.exchSource.subscribe((val) => {
        if (!this.isShowResults) {
          this.getGameData(false);
        }
      });
      this.getGameData(true);
    });
    this.getBetStakeSetting();

  }

  getBetStakeSetting() {
    this.shareService.stakeButton$.subscribe(data => {
      if (data != null) {
        this.stakeSetting = data;
      }
    });
  }

  initOpenBetForm() {

    this.OpenBetForm = this.fb.group({
      gameType: [this.openBet.gameType],
      betType: [this.openBet.betType],
      gid: [this.openBet.gid],
      marketId: [this.openBet.marketId],
      odds: [this.openBet.odds],
      selId: [this.openBet.selId],
      stake: [""],
      stakeTyping: [true],
    })

  }

  get f() {
    return this.OpenBetForm.controls;
  }


  getGameData(firstData) {

    if (!this.apiPending) {
      return;
    }
    this.apiPending = false;
    this.exchService.getGameData(this.gameName, firstData).subscribe((resp: any) => {
      this.apiPending = true;


      // console.log(resp)

      if (
        resp &&
        resp.channel?.game?.markets?.markets &&
        resp.channel?.game.markets.markets[0]
      ) {
        if (!this.exchData) {
          this.gameId = resp.channel?.id;
          // this.getResults(resp.channel?.id);
        }
        this.exchData = resp;
        this.gameData = resp.channel?.game?.gameData;

        this.markets = resp.channel?.game?.markets;
        this.marketId = resp.channel?.game?.markets?.markets[0].id;


        // console.log(this.markets)

        if (this.gameData) {
          this.gameData?.objects?.forEach((obj) => {
            this.runnerGameData[obj.name] = obj;
          });

          // console.log(this.runnerGameData)
        }

        if (this.previousMarket != this.marketId) {
          // this.marketLiability = 0;
          // this.userService.getBets();
          // setTimeout(() => {
          //   this.userService.getBalance();
          // }, 1000);
          this.listBooks(this.marketId);
          this.previousMarket = this.marketId;
        }
      }

      $('#page_loading').css('display', 'none');
    })
    this.apiPending = true;
  }

  showGames() {
    this.isShowResults = false;
    this.gameStartDate = null;
    this.results = null;
    this.selectIndex = 0;
    // this.gameData = null;
    // this.markets = null;
    // this.runnerGameData = {};
    this.getGameData(true);
  }

  Showplacebetrules() {
    this.isShowRules = false;
  }

  Showrules() {
    this.isShowRules = true;
  }

  showResults() {
    this.isShowResults = true;
    this.getResults();
  }

  getResults() {
    this.exchService.exchResults(this.gameId).subscribe((res: string) => {
      if (res) {
        this.results = JSON.parse(res);

        console.log(this.results);

        if (this.results) {
          this.getResultByMarketId(0);
        }
      }
    });
  }

  getResultByMarketId(index) {
    this.selectIndex = index;

    this.gameData = this.results.channel?.games?.games[index]?.gameData;
    this.gameStartDate = this.results.channel?.games?.games[index]?.gameStartDate;
    this.markets = this.results.channel?.games?.games[index]?.markets;

    // console.log(this.markets)

    if (this.gameData) {
      this.gameData?.objects?.forEach((obj) => {
        this.runnerGameData[obj.name] = obj;
      });
      // console.log(this.runnerGameData)
    }
  }

  trackByIndex(index, item) {
    return index;
  }
  trackByIdRunner(index, item) {
    if (item) {
      return item.id;
    }
  }

  trackByCon(index, item) {
    return item.consolidateId;
  }

  trackByRunnerGame(index, item) {
    return item.id;
  }




  BetSubmit() {

    if (!this.OpenBetForm.valid) {
      return;
    }
    this.showLoader = true;

    $('#loading').css('display', 'block');

    this.exchService.placeBetsExG(this.OpenBetForm.value).subscribe((resp: any) => {

      if (resp.errorCode == 0) {
        if (resp.result[0].reqId && resp.result[0].result == "pending") {
          let getResp = resp.result[0];
          setTimeout(() => {
            this.requestResult(getResp);
          }, (getResp.delay * 1000)+500);
        } else {
          // this.toastr.success(resp.errorDescription);
          this.toastr.successMsg(resp.errorDescription);
          this.showLoader = false


          setTimeout(() => {
            this.listBooks(this.OpenBetForm.value.marketId);
            if (resp.result[2] && resp.result[3]) {
              this.shareService.shareUpdateFundExpo(resp.result);
            } else {
              this.shareService.shareUpdateFundExpo('event');
            }
            this.OpenBetForm.reset();
            this.ClearAllSelection();
            this.showLoader = false;
            $('#loading').css('display', 'none');
          }, 3000);
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


  requestResult(data) {

    // console.log(data)
    this.exchService.requestResult(data.reqId).subscribe((resp: any) => {

      if (resp.errorCode == 0) {
        if (resp.result[0].result == "pending") {
          setTimeout(() => {
            this.requestResult(data);
          }, 500)
        } else {
          // this.toastr.success(resp.errorDescription);
          this.toastr.successMsg(resp.errorDescription);
          this.showLoader = false


          setTimeout(() => {
            this.listBooks(this.OpenBetForm.value.marketId);
            if (resp.result[2] && resp.result[3]) {
              this.shareService.shareUpdateFundExpo(resp.result);
            } else {
              this.shareService.shareUpdateFundExpo('event');
            }
            this.OpenBetForm.reset();
            this.ClearAllSelection();
            this.showLoader = false;
            $('#loading').css('display', 'none');
          }, 3000);
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
      $('#page_loading').css('display', 'none');

    })
  }

  getToastMessage() {
    this.toasterSubscription = this.toastr.successMsgSource.subscribe(data => {
      // console.log(data)
      this.status = 'success';
      this.msgData = data;
      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
        this.msgData = null;

      }, 5000);
    })
    this.toastr.errorMsgSource.subscribe(data => {
      // console.log(data)

      this.status = 'error';
      this.msgData = data;

      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
        this.msgData = null;
      }, 5000);
    })
  }

  removeMsg() {
    this.msgData = null;
    clearTimeout(this.timeoutReset);
  }

  listBooks(marketId) {

    if (!marketId) {
      return;
    }
    this.exchService.listBooks(marketId).subscribe((data: any) => {
      this.exchPnl = data.result;
    })
  }

  getPnlValue(runner) {

    let pnl = "0";
    if (this.exchPnl) {
      _.forEach(this.exchPnl, (value, index) => {
        // console.log(value)

        if (this.gameName == 'blackjack' || this.gameName == 'blackjack-turbo') {
          if (runner.id) {
            pnl = value[runner.id + '_l'];
          }
          if (runner.sid) {
            pnl = value[runner.sid + '_l'];
          }
          if (!pnl) {
            pnl = "0";
          }
        } else {
          if (runner.id) {
            pnl = value[runner.id];
          }
          if (runner.sid) {
            pnl = value[runner.sid];
          }
          if (!pnl) {
            pnl = "0";
          }
        }

      })
    }
    return pnl;
  }

  getPnlClass(runner) {
    let pnlClass = "black";
    if (this.exchPnl) {
      _.forEach(this.exchPnl, (value, index) => {
        if (this.gameName == 'blackjack' || this.gameName == 'blackjack-turbo') {
          if (runner.id) {
            if (parseInt(value[runner.id + '_l']) >= 0) {
              pnlClass = 'win';
            }
            if (parseInt(value[runner.id + '_l']) < 0) {
              pnlClass = 'lose';
            }
          }
        } else {
          if (runner.id) {
            if (parseInt(value[runner.id]) >= 0) {
              pnlClass = 'win';
            }
            if (parseInt(value[runner.id]) < 0) {
              pnlClass = 'lose';
            }
          }
        }
      })
    }
    return pnlClass;
  }


  openExchbetSlip(
    event,
    betType: any,
    runnerName: any,
    selId: any,
    gameType: any,
    odds: any,
    gid: string,
    marketId: string,
  ) {

    if (this.openBet) {
      if (this.openBet.betType != betType) {
        this.ClearAllSelection();
      }
    }
    $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3,#back_1,#lay_1").removeClass("select");

    var element = event.currentTarget.classList;
    element.add("select");

    this.openBet = {
      betType,
      odds,
      runnerName,
      selId,
      gid,
      gameType,
      marketId
    }


    let eventHandle = null;
    eventHandle = $('#selection_' + selId);
    let mainPage = $('#mainWrap');

    console.log(this.openBet)

    this.initOpenBetForm();

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


  typingSign(type) {

    this.OpenBetForm.controls['stake'].setValue('');
    this.OpenBetForm.controls['stakeTyping'].setValue(true);
    this.OpenBetForm.controls['oddsTyping'].setValue(false);
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
    }
  }
  buttonDelete() {
    if (this.OpenBetForm.value.stakeTyping) {
      if (this.OpenBetForm.value.stake) {
        this.OpenBetForm.controls['stake'].setValue(this.OpenBetForm.value.stake.toString().slice(0, -1));
      }
    }
  }


  addStake(stake) {
    if (!this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(stake.toFixed(0));
    }
    else if (this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue((parseFloat(this.OpenBetForm.value.stake) + stake).toFixed(0))
    }
  }

  clearStake() {
    this.OpenBetForm.controls['stake'].setValue(null);
  }


  incStake() {
    if (!this.OpenBetForm.value.stake) {
      this.OpenBetForm.controls['stake'].setValue(0);
    }

    if (this.OpenBetForm.value.stake > -1) {
      let stake = parseInt(this.OpenBetForm.value.stake);
      this.OpenBetForm.controls['stake'].setValue(stake + this.stakeDiffCalc(stake));
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
    }
  }
  stakeDiffCalc(currentStake) {
    var diff;

    if (currentStake <= 50) {
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

  ClearAllSelection() {
    this.openBet = null;
    $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3,#back_1,#lay_1").removeClass("select");
  }

  openrules() {
    $('#rulespop').css('display', 'block')
  }
  closerules() {
    $('#rulespop').css('display', 'none')
  }

  ngOnDestroy(): void {
    if (this.exchSubscription) {
      this.exchSubscription.unsubscribe();
    }
  }


}
