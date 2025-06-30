import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepositWithdrawService {

  baseUrl: string = 'https://sc.cricbuzzer.io:15552/api';

  constructor(private http: HttpClient) {
    
  }
  getAdminBankAccounts(uid:any) {
    return this.http.get(`${this.baseUrl}/GetAdminbankaccounts/?uid=${uid}`);
  }

  GetAdminUpilist(uid:any) {
    return this.http.get(`${this.baseUrl}/GetAdminUpi/?uid=${uid}`);
  }

  GetAdminQrCode(uid:any) {
    return this.http.get(`${this.baseUrl}/GetAdminQr/?uid=${uid}`);
  }

  getBankAccountsList(uid:any) {
    return this.http.get(`${this.baseUrl}/Getbankaccountslist/?uid=${uid}`);
  }

  Getupilist(uid:any) {
    return this.http.get(`${this.baseUrl}/Getupilist/?uid=${uid}`);
  }

  doTransactionrequest(data:any,siteName:any){
    if(siteName == 'cricbuzzer' ){
      return this.http.post(`${this.baseUrl}/doCbTransactionrequest`,data);
    }else{
      return this.http.post(`${this.baseUrl}/doTransactionrequest`,data);
    }
  }

  Dopaymentgetway(data:any){
    return this.http.post(`https://streamingtv.fun:58700/api/Payment/PaymentGatwayLogin`,data);
  }

  selfAutoPay(data:any){
    return this.http.post(`${this.baseUrl}/loginPaymentGateway`,data);
  }
  
  
}
