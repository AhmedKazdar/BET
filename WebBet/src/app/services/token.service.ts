import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const AUTH_TOKEN = 'AuthToken';
export const USER_INFO = 'UserInfo';
export const NEW_USER = 'NewUser';
export const LANGUAGE = 'LANGUAGE';
export const OFFER_ID = 'OFFER_ID';
export const CLICK_ID = 'CLICK_ID';
export const AFF_ID = 'AFF_ID';
@Injectable({
  providedIn: 'root'
})
export class TokenService {


  stakeButtons = [1000, 5000, 10000, 25000, 50000, 100000, 200000, 500000, 1000000, 2500000];


  constructor(private cookieService: CookieService, private router: Router,private fireAuth: AngularFireAuth) { }
  setTC(data) {
    this.cookieService.set('tc', data);
  }
  getTC() {
    return this.cookieService.get('tc');
  }

  setCasBanner(data) {
    this.cookieService.set('CasBanner', data);
  }
  getCasBanner() {
    return this.cookieService.get('CasBanner');
  }

  setToken(token) {
    this.cookieService.set(AUTH_TOKEN, token);
    // localStorage.setItem(AUTH_TOKEN, token);
  }
  getToken() {
    if (this.getLocalToken()) {
      return this.getLocalToken();
    } else {
      return this.cookieService.get(AUTH_TOKEN);
    }
  }
  setLocalToken(token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
  getLocalToken() {
    return localStorage.getItem(AUTH_TOKEN);
  }
  async removeToken() {
    await this.fireAuth.signOut();
    this.cookieService.delete(AUTH_TOKEN);
    this.cookieService.deleteAll();
    var newUser = this.getNewUser();
    localStorage.clear();
    if(newUser!=null){
      this.setNewUser(1);
    }
    // this.router.navigate(['/login']);
    // window.location.href = "/home";
    // window.location.href = window.location.origin+ "/#/home";
    // window.location.href = window.location.origin +"/" ;
    window.location.href = window.location.origin + window.location.pathname;
  }

  setUserInfo(userInfo) {
    this.cookieService.set(USER_INFO, JSON.stringify(userInfo));
    localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
  }
  getUserInfo() {
    // console.log(this.getLocalUserInfo())
    if (this.getLocalUserInfo()) {
      return this.getLocalUserInfo();
    } else {
      return this.cookieService.get(USER_INFO) ? JSON.parse(this.cookieService.get(USER_INFO)) : null;
    }
  }
  getLocalUserInfo() {
    return localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : null;
  }
  setMaintanance(value) {
    this.cookieService.set('isMaintanance',value);
  }
  getMaintanance() {
    return this.cookieService.get('isMaintanance');
  }
  removeMaintanance() {
    this.cookieService.delete('isMaintanance');
  }
  setStakeButtons(stakes) {
    this.cookieService.set("stakeValue", JSON.stringify(stakes));
  }
  getStakeButtons() {
    return this.cookieService.get("stakeValue") ? JSON.parse(this.cookieService.get("stakeValue")) : this.stakeButtons;
  }
  removeUserInfo() {
    this.cookieService.delete(USER_INFO);
    this.cookieService.deleteAll();
  }

  setNewUser(newUser){
    localStorage.setItem(NEW_USER, newUser);
  }

  getNewUser(){
    return localStorage.getItem(NEW_USER);
  }
  setLanguage(lang){
    localStorage.setItem(LANGUAGE, lang);
  }
  getLanguage() {
    return localStorage.getItem(LANGUAGE);
  }

  setOfferId(offerId){
    localStorage.setItem(OFFER_ID, offerId);
  }

  getOfferId(){
    return localStorage.getItem(OFFER_ID);
  }

  setClickID(clickId){
    localStorage.setItem(CLICK_ID, clickId);
  }

  getClickID(){
    return localStorage.getItem(CLICK_ID);
  }

  setAffId(affId){
    localStorage.setItem(AFF_ID, affId);
  }

  getAffId(){
    return localStorage.getItem(AFF_ID);
  }
}
