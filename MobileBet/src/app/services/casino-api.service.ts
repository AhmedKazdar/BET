import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MainService } from './main.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CasinoApiService {

  private baseUrl: string;
  private casinoUrl: string;
  private awcUrl: string;
  siteName: string;

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private main: MainService) {
  this.siteName = environment.siteName

    main.apis2$.subscribe((res) => {
      if (res) {
        this.baseUrl = res.ip;
        this.casinoUrl = res.casApi;
        this.awcUrl = res.awcApi;
      }
    });
  }

  casinoRate(gtype: string) {
    let url = `${this.casinoUrl}/api/d_rate/${gtype}`;
    return this.http.get(url)
  }

  lastResult(gtype: string) {
    let url = `${this.casinoUrl}/api/l_result/${gtype}`;
    return this.http.get(url)

  }

  roundResult(gtype: string, roundId: number) {
    let url = `${this.casinoUrl}/api/r_result/${gtype}/${roundId}`;
    return this.http.get(url)

  }

  loadTable(casinoType) {
    return this.http.get(`${this.baseUrl}/loadTable/${casinoType}`);
  }

  placeTpBet(data: any) {
    return this.http.post(`${this.baseUrl}/TPplaceBets`, data
    );
  }
  requestResult(reqId: any) {
    return this.http.get(`${this.baseUrl}/requestResult/${reqId}`);
  }

  listBooks(tableName: string, roundId: any, selectionId: any) {
    let url = `${this.baseUrl}/listBooks/${tableName}/${roundId}/${selectionId}`;
    return this.http.get(url)
  }

  listProviders() {
    return this.http.get(`${this.baseUrl}/listProviders`);
  }

  betgamesdata(data){
    return this.http.post(`https://betgames.cricity.net/pad=401/auth`, data);
  }
  awclist(){
    return this.http.get(`${this.baseUrl}/listAWCCasinoPlatforms`);
  }
  // awcAuth(params){
  //   return this.http.post(`https://awc.vrnl.net/pad=500/api/auth`, params);
  // }
  awcAuth(params){
    return this.http.post(`${this.awcUrl}/api/auth`, params);
  }
  getAWCTable() {
    return this.http.get(`/assets/awc_json/${this.siteName}.json`);
  }
  bolist() {
    return this.http.get(`${this.baseUrl}/listBOGCasinoPlatforms`);
  }
  boAuth(params){
    return this.http.post(`https://blueocean.vrnl.net/pad=700/api/auth`, params);
  }
  boGames(provider:string){
    return this.http.get(`https://blueocean.vrnl.net/pad=700/api/Games/${provider}`);
  }
  amanAuthNew(data:any){
    if(this.siteName=="cricbuzzercom"){
      return this.http.post(`https://casino.cricity.net/pad=93/api/poker/auth/`, data);
    }else{
    return this.http.post(`https://aura.vrnl.net/pad=93/api/poker/auth/`, data);
    }
  }

  getAuraOperators() {
    const domain = origin.replace(/(^\w+:|^)\/\/(www\.)?/, '');
    return this.http.get(`https://api3.vrnlapi.live:3479/api/getAuraOperators/${domain}`);
  }

}
