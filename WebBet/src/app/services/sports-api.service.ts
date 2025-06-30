import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class SportsApiService {

  private oddsUrl!: string;
  private allSportApi!: string;
  private fanApi!: string;
  private premiumApi!: string;



  constructor(private http: HttpClient, private main: MainService) {
    main.apis2$.subscribe((res) => {
      this.oddsUrl = res.sportApi;
      this.allSportApi = res.allSportApi;
      this.fanApi = res.fanApi;
      this.premiumApi = res.premiumApi;

    });
  }

  getMatchOdds(sportId: number, ids: string, isAllSport?) {
    if (isAllSport) {
      return this.http.get(`${this.allSportApi}/matchOdds/${sportId}/?ids=${ids}`);
    } else {
      return this.http.get(`${this.oddsUrl}/matchOdds/${sportId}/?ids=${ids}`);
    }

  }

  getOddsInplay(ids: string, isAllSport?) {
    if (isAllSport) {
      return this.http.get(`${this.allSportApi}/oddsInplay/?ids=${ids}`);
    } else {
      return this.http.get(`${this.oddsUrl}/oddsInplay/?ids=${ids}`);
    }

  }

  // getBmFancy(marketId: string) {
  //   return this.http.get(`${this.fanApi}/api/bm_fancy/${marketId}`);
  // }

  getBmFancy(marketId: string, fSource: string) {
    // if (fSource) {
      return this.http.get(`${this.fanApi}/api/bm_fancy/${marketId}/${fSource}`);
    // } else {
    //   return this.http.get(`${this.fanApi}/api/bm_fancy/${marketId}`);
    // }
  }

  getSportsBook(eventId: string) {
    return this.http.get(`${this.premiumApi}/api/sports_book/${eventId}`);
  }

}
