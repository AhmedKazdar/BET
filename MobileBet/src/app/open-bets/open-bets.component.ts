import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShareDataService } from '../services/share-data.service';
import _ from 'lodash';
import { ToastMessageService } from '../services/toast-message.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-open-bets',
  templateUrl: './open-bets.component.html',
  styles: [
  ]
})
export class OpenBetsComponent implements OnInit {

  eventBets = [];
  totalBets = 0;
  totalUBets = 0;
  marketBets: any;

  isCheckedBetInfo: boolean = false;
  isCheckedAverageOdds: boolean = false;
  parlayOptions: any
  Parlayenable: boolean = false
  parlayDetailBets = [];
  parlayDetailBetsArray = [];
  marketID: any
  accountInfo:any
  status: string = "";
  msgData: any;
  timeoutReset;
  consolidateId: any;
  matchingDetails: any[];


  eventBetsSubscription: Subscription;
  Update: any;

  constructor(
    private shareService: ShareDataService,
    private toastr: ToastMessageService,
    private tokenService:TokenService
  ) { }

  ngOnInit(): void {
    this.listBets();
    this.getlanguages();
    this.UserDescription()
  }

  listBets() {
    this.eventBetsSubscription = this.shareService.listBets$.subscribe((data: any) => {
      // console.log(data, "list");
      if (data) {
        let parlayDetailBetsArray = [];
        this.eventBets = data.matchWiseBets;
        this.eventBets.forEach(element => {
          element.markets.forEach(markets => {
            markets.betType.forEach(betType => {
              betType.bets.forEach(bets => {

                if (bets.details && bets.details.length > 1) {
                  bets['countName'] = `Double`;
                }
                if (bets.details && bets.details.length > 2) {
                  bets['countName'] = `Triple`;
                }
                if (bets.details && bets.details.length > 3) {
                  bets['countName'] = `Quadruple`;
                }
                if (bets.details && bets.details.length > 4) {
                  bets['countName'] = `Quintuple`;
                }
                if (bets.details && bets.details.length > 5) {
                  bets['countName'] = `Sextuple`;
                }
                if (bets.details && bets.details.length > 6) {
                  bets['countName'] = `Septuple`;
                }
                if (bets.details && bets.details.length > 7) {
                  bets['countName'] = `Octuple`;
                }
                if (bets.details && bets.details.length > 8) {
                  bets['countName'] = `Nonuple`;
                }
                if (bets.details && bets.details.length > 9) {
                  bets['countName'] = `Decuple`;
                }
                if (bets.type && bets.type) {
                  element['isType'] = bets.type;
                }
                if (bets.consolidateId.indexOf('PAR-') > -1) {
                  parlayDetailBetsArray.push(bets)
                }


              });
            });
          });

        });
        

        this.parlayDetailBets = parlayDetailBetsArray
        let matchId = "0";
        if (window.location.hash.indexOf('event') > -1) {
          matchId = window.location.hash.replace('#/event/', '');
        }


        if (this.totalBets != data.totalBets) {
          this.totalBets = data.totalBets

        }
        if (this.totalUBets != data.totalUBets) {
          this.totalUBets = data.totalUBets;
          _.forEach(data.matchWiseBets, match => {
            if (match.eventId == matchId) {
              this.shareService.shareBetExpoData({ isUnmatchedBet: true, matchId: matchId });
            }
          });

        }

        // console.log(this.parlayDetailBets)
        // _.forEach(data.matchWiseBets, match => {
        //   _.forEach(match.markets, market => {
        //     if (market.name == this.marketBets.name && market.marketId == this.marketBets.marketId) {
        //       this.marketBets = market;
        //     }
        //   });
        // });

        // console.log(matchId)
        // console.log(this.marketBets)
      }
    })
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);
      
    })
  }
  

  openMarketBets(marketBets) {
    this.marketBets = marketBets;
    // console.log(this.marketBets)
  }

  openMarketBetparlay(marketBets, type) {
    // console.log(marketBets)
    this.marketBets = marketBets;
    this.consolidateId = type;
    let matchingDetails = [];
    this.parlayDetailBets.forEach(element => {
      if (element.consolidateId === this.consolidateId) {
        this.matchingDetails = matchingDetails.concat(element.details);        
      }
    });
  }
  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    this.parlayOptions = this.accountInfo?.parlayOption
    if (this.parlayOptions == 1) {
      this.Parlayenable = true
    }
    else {
      this.Parlayenable = false
    }
  }

  toggle(parlayID) {
    this.marketID = parlayID
  }


  getToastMessage() {
    this.toastr.successMsgSource.subscribe(data => {
      this.status = 'success';
      this.msgData = data;
      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    })
    this.toastr.errorMsgSource.subscribe(data => {
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

  goBack() {
    this.marketBets = null;
  }

  betInfo() {
    this.isCheckedBetInfo = !this.isCheckedBetInfo;
  }
  averageOdds() {
    this.isCheckedAverageOdds = !this.isCheckedAverageOdds;
  }

  trackByMatch(match) {
    return match.eventId;
  }
  trackByMarket(market) {
    return market.name;
  }
  trackByBetType(bet) {
    return bet.betType;
  }
  trackByBet(bet) {
    return bet.consolidateId;
  }

  ngOnDestroy() {
    if (this.eventBetsSubscription) {
      this.eventBetsSubscription.unsubscribe();
    }
  }

}
