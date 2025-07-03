import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
  selector: 'app-casino-game',
  templateUrl: './casino-game.component.html',
  styleUrls: ['./casino-game.component.scss']
})
export class CasinoGameComponent implements OnInit, OnDestroy {
  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent: ElementRef<any>;
  @ViewChild('widgetsContent1', { read: ElementRef })
  public widgetsContent1: ElementRef<any>;
  @ViewChild('widgetsContent2', { read: ElementRef })
  public widgetsContent2: ElementRef<any>;
  @ViewChild('widgetsContent3', { read: ElementRef })
  public widgetsContent3: ElementRef<any>;
  @ViewChild('widgetsContent4', { read: ElementRef })
  public widgetsContent4: ElementRef<any>;
  @ViewChild('widgetsContent5', { read: ElementRef })
  public widgetsContent5: ElementRef<any>;
  @ViewChild('widgetsContent6', { read: ElementRef })
  public widgetsContent6: ElementRef<any>;
  @ViewChild('widgetsContent7', { read: ElementRef })
  public widgetsContent7: ElementRef<any>;

  tableName: string;
  tableId: string;
  gType: string;
  tpData: any;
  tpMarkets: any = [];
  tpFMarkets: any = [];

  AndarValues: any = [];
  BaharValues: any = [];
  Aallcards = [];
  Ballcards = [];
  Aresults = [];
  Bresults: any;
  DescValues: any = [];

  casinoPnl: any = [];
  oldRoundId = 0;
  roundId = 0;

  lastResults = [];
  roundResult: any;

  casinoSource = interval(1000);
  clock: any;

  OpenBetForm!: FormGroup;
  openBet: any;
  stakeSetting = [];
  showLoader: boolean = false;

  cards = [
    { cardNo: 1, cardName: 'A' },
    { cardNo: 2, cardName: '2' },
    { cardNo: 3, cardName: '3' },
    { cardNo: 4, cardName: '4' },
    { cardNo: 5, cardName: '5' },
    { cardNo: 6, cardName: '6' },
    { cardNo: 7, cardName: '7' },
    { cardNo: 8, cardName: '8' },
    { cardNo: 9, cardName: '9' },
    { cardNo: 10, cardName: '10' },
    { cardNo: 11, cardName: 'J' },
    { cardNo: 12, cardName: 'Q' },
    { cardNo: 13, cardName: 'K' },
  ];
  seletedCards = [];


  type = 'PieChart';
  mydata = [
    ['Player', 45.0],
    ['Banker', 26.8],
    ['Tie', 12.8],

  ];
  columnNames = ['Browser', 'Percentage'];
  options = {
    is3D: true,
    backgroundColor: '#eee',
    slices: [{ color: 'rgb(8, 108, 184)' }, { color: 'rgb(131, 25, 36)' }, { color: 'rgb(39, 149, 50)' }],
    legend: {
      'position': 'right'
    },
    chartArea: {
      'left': '2%',
      'top': '2%',
      'bottom': '2%',
      'width': '100%',
      'height': '100%'
    },
  };
  width = 209;
  height = 160;

  orientation: number = 0;
  resultCards: any;

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    // console.log('orientationChanged');
    // console.log("the orientation of the device is now " + event.target.screen.orientation.angle);
    this.orientation = event.target.screen.orientation.angle;
  }

  activatedTab = "hands";

  casinoSubscription: Subscription;

  minStake: number = 0;
  maxStake: number = 0;

  isShowMinMax: boolean = false;

  winner: string;
  winnerPair: string;
  perfect: string;
  either: string;
  bigSmall: string;
  constructor(
    private route: ActivatedRoute,
    private casinoApi: CasinoApiService,
    private main: MainService,
    private fb: FormBuilder,
    private shareService: ShareDataService,
    private toastr: ToastMessageService,

  ) {
    this.route.params.subscribe(params => {
      console.log(params)
      this.tableName = params.tableName;
      this.tableId = params.tableId;
      this.gType = params.gType;
      $('#page_loading').css('display', 'block');

    })

  }

  ngOnInit(): void {
    this.main.apis$.subscribe((res) => {
      this.getCasinoRate();
      this.getLastResult();
      this.loadTableSettings();
      this.getTpExpoCalls();
      this.casinoSubscription = this.casinoSource.subscribe((val) => {
        this.getCasinoRate();
      });
    });
    this.getBetStakeSetting();

    if (this.tableName == "DT2020") {
      this.activatedTab = "dragon";
    }

  }
  ngAfterViewInit() {
    this.setClock();
    if (this.tableName == "3CardsJud") {
      this.owlCarousel();
    }
  }

  setClock() {
    this.clock = (<any>$(".clock")).FlipClock(99, {
      clockFace: "Counter"
    });
  }
  owlCarousel() {
    // (<any>$("#andar_div,#bahar_div")).owlCarousel({
    //   loop: false,
    //   margin: 10,
    //   responsiveClass: false,
    //   slideBy: 5,
    //   dots: false,
    //   responsive: {
    //     0: {
    //       items: 5,
    //       nav: true,
    //     },
    //     600: {
    //       items: 5,
    //       nav: true,
    //     },
    //     1000: {
    //       items: 14,
    //       nav: true,
    //       loop: false,
    //     },
    //   },
    // });
  };

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
      round: [this.openBet.round],
      odds: [this.openBet.odds],
      selId: [this.openBet.selId],
      stake: [""],
      stakeTyping: [true],
      cards: [this.seletedCards],
    })

  }

  get f() {
    return this.OpenBetForm.controls;
  }

  activeTab(tab) {
    this.activatedTab = tab;
  }


  showMinMax(sid) {

    this.isShowMinMax = !this.isShowMinMax;
    if (this.isShowMinMax) {
      $('#min-max-info_' + sid).fadeIn().css('display', 'block');
    } else {
      $('#min-max-info_' + sid).fadeOut().css('display', 'none');
    }
  }

  getCasinoRate() {

    this.casinoApi.casinoRate(this.gType).subscribe((resp: any) => {
      // console.log(resp)
      if (this.tableName != "TP1Day") {
        _.forEach(resp.data.t1, element => {
          element['min'] = this.minStake;
          element['max'] = this.maxStake;
        });
        _.forEach(resp.data.t2, element => {
          element['min'] = this.minStake;
          element['max'] = this.maxStake;
        });
        this.tpData = resp.data.t1[0];
        this.tpMarkets = resp.data.t2;
      } else {
        _.forEach(resp.data.bf, element => {
          element['min'] = this.minStake;
          element['max'] = this.maxStake;
        });
        this.tpMarkets = resp.data.bf;
        this.tpData = {};
        this.tpData['mid'] = resp.data.bf[0].marketId;
        this.tpData['autotime'] = resp.data.bf[0].lasttime;
      }
      if (this.tableName == "TPOpen") {
        if (this.tpData.cards) {
          this.tpData.cards = this.tpData.cards.split(',');
          _.forEach(this.tpData.cards, (item, index) => {
            this.tpData.cards[index] = item.split('#')[0];
          })
        }
      }
      if (this.tableName == "32Cards" || this.tableName == "32CardsB") {
        if (this.tpData.desc) {
          this.tpData.desc = this.tpData.desc.split(',');
        }

        this.tpData['t1'] = [];
        this.tpData['t2'] = [];
        this.tpData['t3'] = [];
        this.tpData['t4'] = [];

        _.forEach(this.tpData.desc, (value: any, index: number) => {
          if (index == 0 || index == 4 || index == 8 || index == 12 || index == 16 || index == 20 || index == 24 || index == 28) {
            this.tpData.t1.push(value);
          }
          if (index == 1 || index == 5 || index == 9 || index == 13 || index == 17 || index == 21 || index == 25 || index == 29) {
            this.tpData.t2.push(value);
          }
          if (index == 2 || index == 6 || index == 10 || index == 14 || index == 18 || index == 22 || index == 26 || index == 30) {
            this.tpData.t3.push(value);
          }
          if (index == 3 || index == 7 || index == 11 || index == 15 || index == 119 || index == 23 || index == 27 || index == 31) {
            this.tpData.t4.push(value);
          }
        });

        // console.log(this.tpData)
      }

      if (this.tableName == "3CardsJud") {
        if (this.casinoPnl.length == 0) {
          setTimeout(() => {
            this.owlCarousel();
          }, 200)
        }
      }
      if (this.tableName == "CasinoMeter") {

        if (this.tpData.cards) {
          this.tpData.cards = this.tpData.cards.split(',');
        }
        this.tpData['high'] = [];
        this.tpData['low'] = [];
        _.forEach(this.tpData.cards, (item: any) => {
          if (item != 1) {
            let firstChr = item.substr(0, 1);
            if (item.length == 4) {
              firstChr = item.substr(0, 2);
            }
            if (firstChr == '10' || firstChr == 'J' || firstChr == 'Q' || firstChr == 'K') {
              this.tpData.high.push(item);
            } else {
              this.tpData.low.push(item);
            }
          }
        })
      }

      if (this.tableName == "Poker1Day") {
        this.tpFMarkets = resp.data.t3;
      }




      if (this.tpData.autotime) {
        if (this.clock) {
          this.clock.setValue(this.tpData.autotime);
        } else {
          this.setClock();
        }
      }

      if (this.tpData.mid.indexOf('.') > -1) {
        this.roundId = this.tpData.mid.split('.')[1];
      } else {
        this.roundId = this.tpData.mid;
      }

      if (this.oldRoundId != this.roundId) {
        this.casinoPnl = [];
        setTimeout(() => {
          this.listBooks(this.roundId);
          if (this.oldRoundId != 0) {
            this.getLastResult();
          }
        }, 500)
        this.oldRoundId = this.roundId;
      }

      if (this.tableName == 'AB') {
        this.AndarValues = [];
        this.BaharValues = [];
        this.Aallcards = [];
        this.Ballcards = [];
        this.Aresults = [];
        this.Bresults = [];
        if (resp.data.t3[0].aall != '') {
          this.Aallcards = resp.data.t3[0].aall.split(',');
          // console.log("this.Aallcards ",this.Aallcards );
        }
        if (resp.data.t3[0].ball != '') {
          this.Ballcards = resp.data.t3[0].ball.split(',');
          // console.log("this.Ballcards ",this.Ballcards );
        }
        if (resp.data.t3[0].ar != '') {
          this.Aresults = resp.data.t3[0].ar.split(',');
          // console.log("this.Aresults",this.Aresults);
        }
        if (resp.data.t3[0].br != '') {
          this.Bresults = resp.data.t3[0].br.split(',');
          // console.log("this.Bresults",this.Bresults);
        }
        _.forEach(this.tpMarkets, (item, index) => {
          var andarbaharnat = item.nation.split(' ');
          if (andarbaharnat[0] == 'Ander') {
            this.AndarValues.push(item);
            // console.log( " this.AndarValues",this.AndarValues);
          }
          if (andarbaharnat[0] == 'Bahar') {
            this.BaharValues.push(item);
          }
        });
      }

      if (this.tpData.Cards != "") {
        this.DescValues = this.tpData.Cards.split(',');
        console.log("andarbaharresult", this.DescValues )
      }

      $('#page_loading').css('display', 'none');


    })
  }


  trackByIndex(index: number, item: any) {
    return item.sid;
  }

  getCardSymbolImg(cardName) {
    if (cardName == "1") {
      return "";
    }
    let char = "";
    let type = "";
    let className = "";
    let value = "";
    // let value = {};

    if (cardName.length == 4) {
      char = cardName.substring(0, 2);
      type = cardName.slice(2);
    } else {
      char = cardName.charAt(0);
      type = cardName.slice(1);
    }
    switch (type) {
      case "HH":
        type = "}";
        className = "card-black1";
        break;
      case "DD":
        type = "{";
        className = "card-red1";
        break;
      case "CC":
        type = "]";
        className = "card-black1";
        break;
      case "SS":
        type = "[";
        className = "card-red1";
        break;
    }

    value = char + '<span class="' + className + '">' + type + "</span>";

    return value;


    // return value = { type, className, char };
  };

  loadTableSettings() {
    this.casinoApi.loadTable(this.tableName).subscribe((resp: any) => {
      // console.log(resp)
      if (resp.errorCode == 0) {
        this.minStake = resp.result[0].min;
        this.maxStake = resp.result[0].max.toString();
      }
    });
  }


  andarValues = [];
  bharValues = [];
  getLastResult() {
    this.casinoApi.lastResult(this.gType).subscribe((resp: any) => {
      if (resp.data) {
        _.forEach(resp.data, (item) => {
          if (item.result == 0) {
            item['player'] = 'playerb';
            item['winner'] = 'R';
          }
          if (item.result == 1) {
            item['player'] = 'playera';
            item['winner'] = 'A';
          }
          if (item.result == 2) {
            item['player'] = 'playerb';
            item['winner'] = 'B';
          }
          if (item.result == 3) {
            item['player'] = 'playerb';
            item['winner'] = 'B';
          }
          if (this.tableName == "Lucky7A" || this.tableName == "Lucky7B") {
            if (item.result == 1) {
              item['player'] = 'playera';
              item['winner'] = 'L';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = 'H';
            }
            if (item.result == 0) {
              item['player'] = 'playerc';
              item['winner'] = 'T';
            }
          }
          if (this.tableName == "32Cards" || this.tableName == "32CardsB") {
            if (item.result == 1) {
              item['player'] = 'playerb';
              item['winner'] = '8';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = '9';
            }
            if (item.result == 3) {
              item['player'] = 'playerb';
              item['winner'] = '10';
            }
            if (item.result == 4) {
              item['player'] = 'playerb';
              item['winner'] = '11';
            }
          }
          if (this.tableName == "AAA" || this.tableName == "Bollywood") {
            if (item.result == 1) {
              item['player'] = 'playerb';
              item['winner'] = 'A';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = 'B';
            }
            if (item.result == 3) {
              item['player'] = 'playerb';
              item['winner'] = 'C';
            }
            if (item.result == 4) {
              item['player'] = 'playerb';
              item['winner'] = 'D';
            }
            if (item.result == 5) {
              item['player'] = 'playerb';
              item['winner'] = 'E';
            }

            if (item.result == 6) {
              item['player'] = 'playerb';
              item['winner'] = 'F';
            }
          }
          if (this.tableName == "Baccarat" || this.tableName == "Baccarat2") {
            if (item.result == 1) {
              item['player'] = 'cplayer';
              item['winner'] = 'P';
            }
            if (item.result == 2) {
              item['player'] = 'cbanker';
              item['winner'] = 'B';
            }
            if (item.result == 3) {
              item['player'] = 'ctie';
              item['winner'] = 'T';
            }
            if (resp.graphdata) {
              this.mydata = [];
              this.mydata.push(['Player', resp.graphdata.P]);
              this.mydata.push(['Banker', resp.graphdata.B]);
              this.mydata.push(['Tie', resp.graphdata.T]);
            }
          }
          if (this.tableName == "Poker2020" || this.tableName == "Poker1Day") {
            if (item.result == 0) {
              item['player'] = 'playert';
              item['winner'] = 'T';
            }
            if (item.result == 11) {
              item['player'] = 'playera';
              item['winner'] = 'A';
            }
            if (item.result == 21) {
              item['player'] = 'playerb';
              item['winner'] = 'B';
            }
          }
          if (this.tableName == "Poker6P") {
            if (item.result == 0) {
              item['player'] = 'playert';
              item['winner'] = 'T';
            }
            if (item.result == 11) {
              item['player'] = 'playera';
              item['winner'] = '1';
            }
            if (item.result == 12) {
              item['player'] = 'playera';
              item['winner'] = '2';
            }
            if (item.result == 13) {
              item['player'] = 'playera';
              item['winner'] = '3';
            }
            if (item.result == 14) {
              item['player'] = 'playera';
              item['winner'] = '4';
            }
            if (item.result == 15) {
              item['player'] = 'playera';
              item['winner'] = '5';
            }
            if (item.result == 16) {
              item['player'] = 'playera';
              item['winner'] = '6';
            }
          }
          if (this.tableName == "DT2020" || this.tableName == "DT1Day") {
            if (item.result == 1) {
              item['player'] = 'playera';
              item['winner'] = 'D';
            }
            if (item.result == 2) {
              item['player'] = 'playerb';
              item['winner'] = 'T';
            }
          }
          if (this.tableName == "DTL2020") {
            if (item.result == 1) {
              item['player'] = 'playera';
              item['winner'] = 'D';
            }
            if (item.result == 21) {
              item['player'] = 'playerb';
              item['winner'] = 'T';
            }
            if (item.result == 41) {
              item['player'] = 'playerc';
              item['winner'] = 'L';
            }
          }
        })
      }
      this.lastResults = resp.data;
    })
  }

  getRoundResult(gameRound) {

    this.casinoApi.roundResult(this.gType, gameRound.mid).subscribe((resp: any) => {
      if (resp.data) {
        this.roundResult = resp.data[0];
        this.roundResult.cards = this.roundResult.cards.split(',');
        this.roundResult.mid = this.roundResult.mid.split('.')[1];

        if (this.tableName == "32Cards" || this.tableName == "32CardsB") {

          this.roundResult['t1'] = [];
          this.roundResult['t2'] = [];
          this.roundResult['t3'] = [];
          this.roundResult['t4'] = [];

          _.forEach(this.roundResult.cards, (value: any, index: number) => {
            if (index == 0 || index == 4 || index == 8 || index == 12 || index == 16 || index == 20 || index == 24 || index == 28) {
              this.roundResult.t1.push(value);
            }
            if (index == 1 || index == 5 || index == 9 || index == 13 || index == 17 || index == 21 || index == 25 || index == 29) {
              this.roundResult.t2.push(value);
            }
            if (index == 2 || index == 6 || index == 10 || index == 14 || index == 18 || index == 22 || index == 26 || index == 30) {
              this.roundResult.t3.push(value);
            }
            if (index == 3 || index == 7 || index == 11 || index == 15 || index == 119 || index == 23 || index == 27 || index == 31) {
              this.roundResult.t4.push(value);
            }
          });
        }

        if (this.tableName == "CasinoMeter") {

          this.roundResult['high'] = [];
          this.roundResult['low'] = [];
          this.roundResult['hlwin'] = [];

          _.forEach(this.roundResult.cards, (item: any) => {
            if (item != 1) {
              if (item == "10HH" || item == "9HH") {
                this.roundResult.hlwin.push(item);
                return;
              }
              let firstChr = item.substr(0, 1);
              if (item.length == 4) {
                firstChr = item.substr(0, 2);
              }
              if (firstChr == '10' || firstChr == 'J' || firstChr == 'Q' || firstChr == 'K') {
                this.roundResult.high.push(item);
              } else {
                this.roundResult.low.push(item);
              }
            }
          })
        }

        if (this.tableName == 'AB') {
          let gostar = false;
          this.roundResult.cards.forEach((item) => {
            if (item == '*') {
              gostar = true;
            } else if (gostar) {
              this.bharValues.push(item);
            } else {
              this.andarValues.push(item);
            }
          });
        }

        if (this.tableName == 'AB2') {
          this.resultCards = this.roundResult.cards;
        }

        if (this.roundResult.desc) {
          const descArray = this.roundResult.desc.split('#');
          this.winner = descArray[0]; 
          this.winnerPair = descArray[1]; 
          this.perfect = descArray[2]; 
          this.either = descArray[3]; 
          this.bigSmall = descArray[4]; 
        }
        $('#casinoResultWrap').fadeIn();

      }
    });

  }

  openCasinoRules() {
    $('#casinoRulesWrap').fadeIn();
  }

  closeCasinoResult() {
    $('#casinoResultWrap').fadeOut();
  }

  closeCasinoRules() {
    $('#casinoRulesWrap').fadeOut();
  }

  getTpExpoCalls() {
    this.shareService.callTpExpo$.subscribe((data) => {
      if (data) {
        console.log(data)

        if (data == 'clearSelection') {
          this.ClearAllSelection();
        } else if (data?.gameType) {
          this.openBet = data;
          this.listBooks(this.openBet.round);
        } else {
          if (this.casinoPnl.length > 0) {
            this.casinoPnl.forEach((element,index) => {
              if (element.gt == data.gt) {
                this.casinoPnl[index] = data;
              } else {
                this.casinoPnl.push(data);
              }
            });
          } else {
            this.casinoPnl.push(data);
          }
          // console.log(this.casinoPnl)

        }

      } else {
        this.openBet = data;
      }
    })
  }

  listBooks(roundId) {

    if (roundId == 0) {
      return false;
    }
    let selId = 1;
    if (this.openBet) {
      selId = this.openBet.selId;
      roundId = this.openBet.round;
    }
    this.casinoApi.listBooks(this.tableName, roundId, selId).subscribe((data: any) => {
      if (this.casinoPnl.length == 0) {
        this.casinoPnl = data.result;
      } else {
        this.casinoPnl.push(data.result[0]);
      }
      this.openBet = null;
    })
  }

  getPnlValue(runner) {

    let pnl = "0";
    if (this.casinoPnl) {
      _.forEach(this.casinoPnl, (value, index) => {

        if (!pnl || pnl == '0') {
          if (runner.sectionId) {
            pnl = value[runner.sectionId];
          }
          if (runner.sid) {
            pnl = value[runner.sid];
          }
          if (!pnl) {
            pnl = "0";
          }
        }

        // return pnl;

      })
    }
    return pnl;
  }

  // getPnlValue(runner) {

  //   let pnl = "0";
  //   if (this.casinoPnl) {
  //     _.forEach(this.casinoPnl, (value, index) => {
  //       if (runner.sectionId) {
  //         pnl = value[runner.sectionId];
  //       }
  //       if (runner.sid) {
  //         pnl = value[runner.sid];
  //       }
  //       if (!pnl) {
  //         pnl = "0";
  //       }
  //     })
  //   }
  //   return pnl;
  // }

  getPnlClass(runner) {
    let pnlClass = "black";
    if (this.casinoPnl) {
      _.forEach(this.casinoPnl, (value, index) => {
        if (runner.sectionId) {
          if (parseInt(value[runner.sectionId]) >= 0) {
            pnlClass = 'win';
          }
          if (parseInt(value[runner.sectionId]) < 0) {
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
      })
    }
    return pnlClass;
  }


  openTPbetSlip(
    event,
    betType: any,
    odds: any,
    runnerName: any,
    selId: any,
    round: string,
    gameType: any,
    cardName: any
  ) {

    if (this.openBet) {
      if (this.openBet.backlay != betType) {
        this.ClearAllSelection();
      }
    }

    round = round.split('.')[1];
    if (gameType == "TP1Day") {
      odds = "1." + odds;
    }
    if (gameType == "Baccarat" || gameType == "Baccarat2") {
      if (odds) {
        odds = parseFloat(odds) + 1;
      }
    }
    this.openBet = {
      backlay: betType,
      odds,
      runnerName,
      SelectionId: selId,
      matchBfId: round,
      matchName: gameType,
      cardName,
      mtype: 'casino'
    }

    let eventHandle = null;
    eventHandle = $('#selection_' + selId);
    let mainPage = $('#mainWrap');

    if (this.tableName == "3CardsJud") {
      if (this.seletedCards.length < 3) {
        let indexcheck = this.seletedCards.indexOf(cardName);
        if (indexcheck == -1) {
          this.seletedCards.push(cardName);
        }
      }
      if (this.seletedCards.length > 2) {

        this.openBet.runnerName = this.openBet.runnerName + ' ' + this.seletedCards.toString().replace(/,/g, "");

        this.openBet['cards'] = this.seletedCards;
        // this.initOpenBetForm();
        // console.log(this.openBet)
        this.shareService.shareBetSlipData(this.openBet);

      }


    } else {
      // this.initOpenBetForm();
      // console.log(this.openBet)
      this.shareService.shareBetSlipData(this.openBet);


    }


  }



  selected3cardj(card: any, betType: any): any {
    let selected = false;
    if (!this.openBet) {
      return selected;
    }

    if (this.openBet.backlay == betType) {
      let indexcheck = this.seletedCards.indexOf(card);
      if (indexcheck > -1) {
        return selected = true;
      }
    }
  };



  ClearAllSelection() {
    this.openBet = null;
    this.seletedCards = [];
    this.shareService.shareBetSlipData(this.openBet);
  }

  ngOnDestroy(): void {
    if (this.casinoSubscription) {
      this.casinoSubscription.unsubscribe();
    }
  }

  public scrollRight(): void {this.widgetsContent.nativeElement.scrollTo({left: this.widgetsContent.nativeElement.scrollLeft + 100,behavior: 'smooth',});
}
public scrollLeft(): void {this.widgetsContent.nativeElement.scrollTo({left: this.widgetsContent.nativeElement.scrollLeft - 100,behavior: 'smooth',});
}

public scrollRight1(): void {this.widgetsContent1.nativeElement.scrollTo({left: this.widgetsContent1.nativeElement.scrollLeft + 100,behavior: 'smooth',});
}
public scrollLeft1(): void {this.widgetsContent1.nativeElement.scrollTo({left: this.widgetsContent1.nativeElement.scrollLeft - 100,behavior: 'smooth',});
}

public scrollRight2(): void {this.widgetsContent2.nativeElement.scrollTo({left: this.widgetsContent2.nativeElement.scrollLeft + 100,behavior: 'smooth',});
}
public scrollLeft2(): void {this.widgetsContent2.nativeElement.scrollTo({left: this.widgetsContent2.nativeElement.scrollLeft - 100,behavior: 'smooth',});
}

public scrollRight3(): void {this.widgetsContent3.nativeElement.scrollTo({left: this.widgetsContent3.nativeElement.scrollLeft + 100,behavior: 'smooth',});
}
public scrollLeft3(): void {this.widgetsContent3.nativeElement.scrollTo({left: this.widgetsContent3.nativeElement.scrollLeft - 100,behavior: 'smooth',});
}

public scrollRight4(): void {this.widgetsContent4.nativeElement.scrollTo({left: this.widgetsContent4.nativeElement.scrollLeft + 100,behavior: 'smooth',});
}
public scrollLeft4(): void {this.widgetsContent4.nativeElement.scrollTo({left: this.widgetsContent4.nativeElement.scrollLeft - 100,behavior: 'smooth',});
}

public scrollRight5(): void {this.widgetsContent5.nativeElement.scrollTo({left: this.widgetsContent5.nativeElement.scrollLeft + 100,behavior: 'smooth',});
}
public scrollLeft5(): void {this.widgetsContent5.nativeElement.scrollTo({left: this.widgetsContent5.nativeElement.scrollLeft - 100,behavior: 'smooth',});
}

public scrollRight6(): void {this.widgetsContent5.nativeElement.scrollTo({left: this.widgetsContent6.nativeElement.scrollLeft + 100,behavior: 'smooth',});
}
public scrollLeft6(): void {this.widgetsContent5.nativeElement.scrollTo({left: this.widgetsContent6.nativeElement.scrollLeft - 100,behavior: 'smooth',});
}

public scrollRight7(): void {this.widgetsContent5.nativeElement.scrollTo({left: this.widgetsContent7.nativeElement.scrollLeft + 100,behavior: 'smooth',});
}
public scrollLeft7(): void {this.widgetsContent5.nativeElement.scrollTo({left: this.widgetsContent7.nativeElement.scrollLeft - 100,behavior: 'smooth',});
}



}
