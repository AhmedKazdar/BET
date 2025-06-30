import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalDetailsService {

  baseUrl: string = 'https://sc.cricity.net:15552/api';

  constructor(private http: HttpClient) {
    
  }
  getBankAccountsList(uid:any) {
    return this.http.get(`${this.baseUrl}/Getbankaccountslist/?uid=${uid}`);
  }

  Getupilist(uid:any) {
    return this.http.get(`${this.baseUrl}/Getupilist/?uid=${uid}`);
  }

  addBank(bankdetails:any) {
    return this.http.post(`${this.baseUrl}/Addbankdetails`,bankdetails);
  }

  updateBank(bankdetails:any) {
    return this.http.patch(`${this.baseUrl}/Updatebankdetails`,bankdetails);
  }

  setPrefferedBank(bankdetails:any) {
    return this.http.patch(`${this.baseUrl}/Updatebankdetailpreferred`,bankdetails);
  }

  deleteBank(bank_id:any) {
    return this.http.delete(`${this.baseUrl}/Deletebankdetails/?bank_id=${bank_id}`);
  }

  addUpi(upidetails:any) {
    return this.http.post(`${this.baseUrl}/Addupidetails`,upidetails);
  }

  updateUpi(upidetails:any) {
    return this.http.patch(`${this.baseUrl}/Updateupi`,upidetails);
  }

  setPrefferedUpi(upidetails:any) {
    return this.http.patch(`${this.baseUrl}/Updateupipreferred`,upidetails);
  }

  deleteUpi(upi_id:any) {
    return this.http.delete(`${this.baseUrl}/Deleteupi/?upi_id=${upi_id}`);
  }
}
