import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class ClientApiService {

  private baseUrl!: string;
  private scoreApi!: string;


  private _pingResSub = new BehaviorSubject<any>(null);
  pingRes$ = this._pingResSub.asObservable();

  constructor(private http: HttpClient, private main: MainService) {
    main.apis$.subscribe((res) => {
      this.baseUrl = res.ip;
      this.scoreApi = res.scoreApi;
    });
  }

  balance() {
    return this.http.get(`${this.baseUrl}/ping`);
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
    return this.http.get(`${this.baseUrl}/listBets`);
  }

  getBookExposure(marketId: any) {
    return this.http.get(`${this.baseUrl}/listBooks/${marketId}`)
  }

  getFancyExposure(eventId: any) {
    return this.http.get(`${this.baseUrl}/fancyExposure/${eventId}`);
  }

  placeBet(betData: any) {
    return this.http.post(`${this.baseUrl}/placeBets`, betData);
  }
  placeTpBet(data: any) {
    return this.http.post(`${this.baseUrl}/TPplaceBets`, data
    );
  }

  getBookMakerBook(marketId: any) {
    return this.http.get(`${this.baseUrl}/listBooks/bm_${marketId}`);
  }

  getFancyBook(marketId: any, fancyId: any, fname: any) {
    return this.http.get(`${this.baseUrl}/listBooks/df_${marketId}_${fancyId}_${fname}`);
  }

  get_ticker() {
    return this.http.get(`${this.scoreApi}/api/get_ticker`);
  }

  listCasinoTable() {
    return this.http.get(`${this.baseUrl}/listCasinoTable`);
  }

  sendDispute(data: any) {
    return this.http.post(`https://sc.cricbuzzer.io:15552/api/submitDispute`, data);
  }

  sendFeedback(data: any) {
    return this.http.post(`https://sc.cricbuzzer.io:15552/api/submitFeedback`, data);
  }
  getlanguage() {
    return this.http.get('/../assets/languagereport.json');
  }

}
