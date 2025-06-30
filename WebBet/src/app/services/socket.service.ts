import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientApiService } from './client-api.service';
import { MainService } from './main.service';
import { ShareDataService } from './share-data.service';
import { SportsApiService } from './sports-api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  siteName = environment.siteName;

  // oddsSocketUrl = environment.oddsSocketUrl;
  // racingSocketApi = environment.racingSocketApi;

  private oddsSocketUrl: string;
  private allSportSocketUrl: string;

  private racingSocketApi: string;
  private fSource: string;

  subject$: WebSocket;

  socketTimeOut: boolean = false;
  intervalSub: Subscription;
  timeOutOdds;

  marketIds = '';
  matchId: any;
  isVir: boolean = false;
  isKabaddi: boolean = false;


  inPlay$ = new Subject();

  matchData: any;

  isLogin: boolean = false;
  isAllSport: boolean = false;

  isOddsPendingApi: boolean = false;
  isFancyPendingApi: boolean = false;
  isSportBookPendingApi: boolean = false;

  constructor(
    private tokenService: TokenService,
    private shareService: ShareDataService,
    private main: MainService,
    private userService: ClientApiService,
    private sportApi: SportsApiService,
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

    // if (this.isLogin) {
    //   this.inPlay$.subscribe((inPlay) => {
    //     this.startOddsInterval(inPlay == 1 ? 1000 : 3000);
    //   });
    // } else {
    //   this.inPlay$.subscribe((inPlay) => {
    //     this.startOddsInterval(inPlay == 1 ? 10000 : 30000);
    //   });
    // }

    main.apis2$.subscribe((res) => {
      this.oddsSocketUrl = res.sportSocketApi;
      this.allSportSocketUrl = res.allSportSocketApi;
      this.racingSocketApi = res.racingSocketApi;
      this.fSource = res.fSource;
      // console.log(this.fSource )

    });
  }

  checkAuthToken() {
    this.shareService.shareOddsData(null);
    // console.log(this.tokenService.getToken())
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

    if (this.isLogin) {
      this.inPlay$.subscribe((inPlay) => {
        this.startOddsInterval(inPlay == 1 ? 1000 : 3000);
      });
    } else {
      this.inPlay$.subscribe((inPlay) => {
        this.startOddsInterval(inPlay == 1 ? 2000 : 5000);
      });
    }
  }

  getFSource() {
    // return this.fSource;
    if (this.matchData.eventTypeId != 4 || this.isVir) {
      return '0';
    } else {
      return this.fSource;
    }
  }



  startOddsInterval(intervalTime) {

    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
    if (this.matchId) {
      this.getAllApiData();
      this.getSportsBook();
    }
    // console.log(this.matchId)
    this.intervalSub = interval(intervalTime).subscribe(() => {

      if (!this.socketTimeOut && this.matchId) {
        this.getAllApiData();
      }
      this.getSportsBook();
      // if (this.matchId && this.siteName == "cricbuzzer") {
      //   if (this.matchData.eventTypeId == 4) {
      //       this.getSportsBook();
      //   }
      // }
    });
  }


  getAllApiData() {

    if (!this.isVir && !this.isKabaddi) {

      if (this.isOddsPendingApi) {
        return;
      }
      this.isOddsPendingApi = true;
      this.sportApi.getOddsInplay(this.marketIds, this.isAllSport).subscribe((data: any) => {
        this.shareService.shareOddsData(data);
        this.isOddsPendingApi = false;
      }, err => {
        this.isOddsPendingApi = false;
      });
    }


    if (this.matchData.eventTypeId == 4 || this.isKabaddi) {
      if (this.isFancyPendingApi) {
        return;
      }
      this.isFancyPendingApi = true;

      let fSource;
      if (this.matchData.eventTypeId != 4 || this.isVir) {
        fSource = '0';
      } else {
        fSource = this.fSource;
      }
      this.sportApi.getBmFancy(this.matchId, fSource).subscribe((data: any) => {
        this.shareService.shareOddsData(data);
        this.isFancyPendingApi = false;
      }, err => {
        this.isFancyPendingApi = false;
      });
    }
  }

  getSportsBook() {
    if (this.matchData.isSportBook == undefined) {
      this.matchData.isSportBook = true;
    }
    // if (this.matchId && this.siteName == "cricbuzzer") {
      if ((this.matchData.eventTypeId == 4 || this.matchData.eventTypeId == 1 || this.matchData.eventTypeId == 2 || this.matchData.eventTypeId == 52) && this.matchData.isSportBook && this.matchData.isPremium && this.isLogin && !this.isVir && this.siteName != 'betswiz222') {
        if (this.isSportBookPendingApi) {
        return;
      }
      this.isSportBookPendingApi = true;
      this.sportApi.getSportsBook(this.matchId).subscribe((data: any) => {
        if (!data.data && !data.sportsBookMarket) {
          data['sportsBookMarket'] = [];
        }
        this.shareService.shareOddsData(data);
        this.isSportBookPendingApi = false;
      }, err => {
        this.isSportBookPendingApi = false;
      });
    }
    // }
  }




  getWebSocketData(match) {
    this.checkAuthToken();


    if (!match) {
      return false;
    }

    // console.log(match)
    this.matchData = match;

    if (!match.isRacing && !match.isVirtual) {
      this.matchId = match.eventId;
      this.isVir = match.isVir;
      this.isKabaddi = match.isKabaddi;
      if ((match.eventTypeId == 4 || match.eventTypeId == 1 || match.eventTypeId == 2)) {
      // if ((match.eventTypeId == 4 || match.eventTypeId == 1 || match.eventTypeId == 2) && match.markets[0]?.marketId.length < 13) {
        this.isAllSport = false;
        // console.log(this.isAllSport);
        
      } else {
        this.isAllSport = true;
        // console.log(this.isAllSport);

      }

      let ids = match.markets.reduce((acc, c) => [...acc, c.marketId], []);
      this.marketIds = ids.join(',');
      if (this.isLogin) {
        this.startOddsInterval(match.isInPlay == 1 ? 1000 : 5000);
      } else {
        this.startOddsInterval(match.isInPlay == 1 ? 10000 : 50000);
      }

    } else if (match.isVirtual) {
      this.matchId = match.eventId;
      this.socketTimeOut = false;
      this.isVir = match.isVir;
      if (this.isLogin) {
        this.startOddsInterval(match.isInPlay == 1 ? 1000 : 5000);
      } else {
        this.startOddsInterval(match.isInPlay == 1 ? 10000 : 50000);
      }
      return false;
    }

    if (match && match.port > 0) {

      let socketUrl = this.oddsSocketUrl;
      if (match.isRacing) {
        socketUrl = this.racingSocketApi;
      }
      if (this.isAllSport) {
        socketUrl = this.allSportSocketUrl;
      }
      // console.log('hhh')
      var url = `${socketUrl}:${match.port}/${this.isLogin ? '?logged=true&source=' + this.fSource : '?logged=false&source=' + this.fSource}`;
      if (location.protocol === 'https:' && !match.isRacing) {
        url = `${socketUrl}/spport=${match.port}/${this.isLogin ? '?logged=true&source=' + this.fSource : '?logged=false&source=' + this.fSource}`;
      }
      if (location.protocol === 'https:' && match.isRacing) {
        url = `${socketUrl}/hgport=${match.port}/${this.isLogin ? '?logged=true' : '?logged=false'}`;
      }

      if (!this.subject$ || this.subject$.CLOSED) {
        this.subject$ = this.createConnection(url);
        // console.log(this.subject$);

        this.subject$.onopen = ((error: any) => {
          // console.log(`[success]: connected to socket`);
        });
        this.subject$.onmessage = (message: any) => {
          message = JSON.parse(message.data);
          if (!match.isRacing && !match.isVirtual) {
            this.socketTimeOut = true;
            clearTimeout(this.timeOutOdds);
            this.timeOutOdds = setTimeout(() => {
              this.socketTimeOut = false;
            }, match.isInPlay == 1 ? 3000 : 10000);
          }
          this.shareService.shareOddsData(message);
          // console.log(message);
        };
        this.subject$.onerror = ((error: any) => {
          // console.log(`[error]: Error connecting to socket`);
        });
        // this.subject$.onclose = (e) => {
        // console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        // };
      }
    } else if (!match.isVirtual) {
      this.socketTimeOut = false;

    }
  }

  createConnection(url) {
    return new WebSocket(url);
  }

  closeConnection() {
    this.shareService.shareOddsData(null);
    if (this.subject$ && this.subject$.OPEN) {
      this.subject$.close();
      this.shareService.shareOddsData(null);
      this.matchId = null;
    }
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
  }
}
