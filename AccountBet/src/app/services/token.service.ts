import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const AUTH_TOKEN = 'AuthToken';
export const USER_INFO = 'UserInfo';
export const LANGUAGE = 'LANGUAGE';
@Injectable({
  providedIn: 'root'
})
export class TokenService {



  constructor(private cookieService: CookieService, private router: Router) { }
  setTC(data) {
    this.cookieService.set('tc', data);
  }
  getTC() {
    return this.cookieService.get('tc');
  }

  setToken(token) {
    this.cookieService.set(AUTH_TOKEN, token);
  }
  getToken() {
    return this.cookieService.get(AUTH_TOKEN);
  }
  removeToken() {
    this.cookieService.delete(AUTH_TOKEN);
    this.cookieService.deleteAll();
    // this.router.navigate(['/login']);
    // window.location.href = "highlight";
    // window.location.href = window.location.origin + window.location.pathname;
    window.location.href = window.location.origin + "/";


  }

  setUserInfo(userInfo) {
    this.cookieService.set(USER_INFO, JSON.stringify(userInfo));
  }
  getUserInfo() {
    return this.cookieService.get(USER_INFO) ? JSON.parse(this.cookieService.get(USER_INFO)) : null;
  }
  removeUserInfo() {
    this.cookieService.delete(USER_INFO);
    this.cookieService.deleteAll();
  }
  setLanguage(lang){
    localStorage.setItem(LANGUAGE, lang);
  }
  getLanguage() {
    return localStorage.getItem(LANGUAGE);
  }
}
