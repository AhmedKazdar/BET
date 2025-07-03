import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl: string;


  constructor(private http: HttpClient, private main: MainService) {
    this.baseUrl = 'https://1881.space/pad=82'; // Set default URL
    main.apis$.subscribe((res) => {
      if (res && res.ip) {
        this.baseUrl = res.ip;
      }
    });
  }


  balance() {
    return this.http.get(`${this.baseUrl}/ping`);
  }
  
  logTransaction() {
    return this.http.get(`${this.baseUrl}/logTransaction`);
  }
  AccountStatement(fromDate: string, toDate: string, filter: string) {
    // Use direct URL for betsReport endpoint
    const url = `https://1881.space/pad=82/betsReport?from=${fromDate}&to=${toDate}&filter=${filter}`;
    return this.http.get(url);
  }

  currentBets() {
    return this.http.get(`${this.baseUrl}/currentBets`);
  }

  BetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/betsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  BOBetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/casinoBOGBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  BOProfitLoss(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/casinoBOGProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }


  casinoBGBetsHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/casinoBGBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  CasinoBGProfitLoss(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/casinoBGProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }
  casinoAWCBetsHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/casinoAWCBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  CasinoAWCProfitLoss(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/casinoAWCProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }
  ProfitLoss(fromDate: string, toDate: string) {

    return this.http.get(
      `${this.baseUrl}/profitLoss?from=${fromDate}&to=${toDate}`
    );
  }
  CasinoBetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/casinoBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  CasinoProfitLoss(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/casinoProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }

  logActivity() {
    return this.http.get(`${this.baseUrl}/logActivity`);
  }
  CasinoProduct() {
    return this.http.get(`https://1881.space/pad=82/listCasinoProduct`);
  }

  getRequests(uid,status,type,from,to){
    return this.http.get(`https://sc.cricbuzzer.io:15552/api/getClientPaymentReport/?uid=${uid}&status=${status}&type=${type}&from=${from}&to=${to}`);
  }
  parlayBetsHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.http.get(
      `${this.baseUrl}/parlayBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  parlayBetsProfitLoss(fromDate: string, toDate: string) {
    return this.http.get(
      `${this.baseUrl}/parlayBetsPNL?from=${fromDate}&to=${toDate}`
    );
  }
  updateKYC(data:any){
    return this.http.post(`https://sc.cricbuzzer.io:15552/api/updateKYC`,data)
  }
  getKYCdetails(userId : number){
    return this.http.get(`https://sc.cricbuzzer.io:15552/api/getKYCdetails/?userId=${userId}`)
  }
}
