import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MainService } from './main.service';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ClientApiService {

  private baseUrl!: string;
  private scoreApi!: string;
  private liveTvApi!: string;

  private betUrl!: string;


  accountInfo: any;


  private _pingResSub = new BehaviorSubject<any>(null);
  pingRes$ = this._pingResSub.asObservable();

  constructor(private http: HttpClient, private main: MainService, private tokenService: TokenService) {
    main.apis2$.subscribe((res) => {
      if (res) {
        this.baseUrl = res.ip;
        this.betUrl = res.ip;
        this.scoreApi = res.scoreApi;
        this.liveTvApi = res.liveTvApi;

       
        this.UserDescription();

      }
    });
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();

    // console.log(this.accountInfo)
  }


  balance(activeEventId) {
    if (activeEventId) {
      return this.http.get(`${this.betUrl}/ping/loadEvent/${activeEventId}`);
    } else {
      return this.http.post(`${this.betUrl}/ping`, { uid: this.accountInfo?.userName });
    }
  }

  getTicker() {
    return this.http.get(`${this.baseUrl}/getTicker`);
  }

  myMarkets() {
    return this.http.get(`${this.baseUrl}/liveBetsByMarket`)
  }

  stakeSetting(stakes: any) {
    return this.http.get(`${this.baseUrl}/stakeSetting/${stakes}`)
  }

  listGames() {
    return this.http.get(`${this.baseUrl}/listGames`);
  }

  loadEvent(eventId: any) {
    return this.http.get(`${this.baseUrl}/loadEvent/${eventId}`);
  }

  listBets() {
    return this.http.post(`${this.betUrl}/listBets`, { uid: this.accountInfo?.userName });
  }

  getBookExposure(marketId: any) {
    return this.http.post(`${this.betUrl}/listBooks/${marketId}`, { uid: this.accountInfo?.userName, marketId: marketId })
  }

  getFancyExposure(eventId: any) {
    return this.http.post(`${this.betUrl}/fancyExposure/${eventId}`, { uid: this.accountInfo?.userName });
  }

  placeBet(betData: any) {
    return this.http.post(`${this.betUrl}/placeBets`, betData);
  }
  placeTpBet(data: any) {
    return this.http.post(`${this.betUrl}/TPplaceBets`, data
    );
  }
  placeBetsPremium(betData: any) {
    return this.http.post(`${this.betUrl}/placeBetsPremium`, betData);
  }
  placeBetsParlay(betData: any){
    return this.http.post(`${this.betUrl}/placeBetsParlay`, betData);
  }
  requestResult(reqId: any) {
    return this.http.get(`${this.baseUrl}/requestResult/${reqId}`);
  }

  getBookMakerBook(marketId: any) {
    return this.http.post(`${this.betUrl}/listBooks/${marketId}`, { uid: this.accountInfo?.userName });
  }

  getFancyBook(marketId: any, fancyId: any, fname: any) {
    return this.http.post(`${this.betUrl}/listBooks/df_${marketId}_${fancyId}_${fname}`, { uid: this.accountInfo?.userName });
  }

  get_ticker() {
    return this.http.get(`${this.scoreApi}/api/get_ticker`);
  }

  listCasinoTable() {
    return this.http.get(`${this.baseUrl}/listCasinoTable`);
  }
  listCasinoProduct() {
    return this.http.get(`${this.baseUrl}/listCasinoProduct`);
  }

  profile() {
    return this.http.get(`${this.baseUrl}/profile`);
  }
  getEvent(id: any) {
    return this.http.get(`https://access.streamingtv.fun:3440/api/getEventsDetails/${id}`);
  }
  getreport(id: any) {
    return this.http.get(`https://access.streamingtv.fun:3440/api/getLatestResults/${id}`);
  }

  getliveTvApi(eventId: any) {
    return this.http.get(`${this.liveTvApi}/api/get_live_tv_url/${eventId}`);
  }

  getAuthCasino(userName: string, userId, prod_code, prod_type) {
    // return this.http.post(`http://185.225.233.199:33333/api/auth`, { userName, userId, prod_code, prod_type });
    return this.http.post(`https://etg.globlethings.com/api/auth`, { userName, userId, prod_code, prod_type });

  }
  QuitCasino(userName: string, userId) {
    // return this.http.post(`http://185.225.233.199:33333/api/quit`, { userName, userId });
    return this.http.post(`https://etg.globlethings.com/api/quit`, { userName, userId });

  }


  setPremiumBook(marketId, bookData) {
    localStorage.setItem(marketId, JSON.stringify(bookData));
  }
  getPremiumBook(marketId) {
    return JSON.parse(localStorage.getItem(marketId));
  }


  queryMarketDepths(marketId: string, selectionId: string) {
    // return this.http.get(`http://localhost:3036/api/queryMarketDepth/${marketId}/${selectionId}`);
    return this.http.get(`https://api2.streamingtv.fun:3440/api/queryMarketDepth/${marketId}/${selectionId}`);

  }
  LoadRunnerInfoChartAction(marketId: string, selectionId: string, logarithmic: boolean) {
    return this.http.get(`https://api2.streamingtv.fun:3440/api/LoadRunnerInfoChartAction/${marketId}/${selectionId}/${logarithmic}`);

  }

  getEventresults(sportId: string, type: string) {
    return this.http.get(`https://api2.streamingtv.fun:3440/api/eventresults/${sportId}/${type}`);
  }

  getActivePlayers() {
    return this.http.get(`https://sc.cricity.net:15552/api/GetActivePlayers?site_id=1`);
  }
  getlanguage() {
    return this.http.get('/../assets/languagemobile.json');
  }

  getWhatsappNumber(){
    return this.http.get('https://sc.cricity.net:15552/api/getWhatsappNumber');
  }
  getb2cid() {
    return this.http.get(`https://api2.streamingtv.fun:3481/get-b2cID?domain=${environment.origin}`);
  }
}
