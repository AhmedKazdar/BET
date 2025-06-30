import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  private scoreApi!: string;

  constructor(private http: HttpClient, private main: MainService) {
    main.apis2$.subscribe((res) => {
      if (res) {
        this.scoreApi = res.scoreApi;
      }
    });
  }

  getScore(eventId): Observable<any> {
    return this.http.get(`${this.scoreApi}/score_api/${eventId}`);
  }

  getAllScore(): Observable<any> {
    return this.http.get(`${this.scoreApi}/get_all_score`);
  }

  GetScoreId(eventId): Observable<any> {
    // return this.http.get(`https://sportbet.id/VRN/v1/api/scoreid/get?eventid=${eventId}`);
    return this.http.get(`${this.scoreApi}/api/getScoreId/${eventId}`);

  }
}
