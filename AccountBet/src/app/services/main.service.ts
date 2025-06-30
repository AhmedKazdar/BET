import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private apisUrl = environment.apisUrl;
  apis$ = new ReplaySubject<any>();
  private apis: any;

  constructor(private http: HttpClient) {
    this.apis$.subscribe((res: any) => {
      let hostname = window.origin;
      if (hostname.indexOf('cricbuzzer') > -1 || hostname.indexOf('cricbuzzerlive') > -1  || hostname.indexOf('localhost1') > -1) {
        res.ip = res.devIp;
      }else{
        res.ip = res.sslclient;
      }
      if (location.protocol === 'https:') {
        if (hostname.indexOf('cricbuzzer') > -1 || hostname.indexOf('cricbuzzerlive') > -1 || hostname.indexOf('localhost1') > -1) {
          res.ip = res.devIp;
        }else{
          res.ip = res.sslclient;
        }
        res.racingApi = res.sslRacingApi;
        res.sportApi = res.sslSportApi;
        res.sportSocketApi = res.sslsportSocketApi;
        res.racingSocketApi = res.sslracingSocketApi;
      }
      this.apis = res;
    })
  }

  getApis() {
    return this.http.get(`${this.apisUrl}`);
  }
}
