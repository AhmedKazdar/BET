import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackDisputeService {

  baseUrl: string='https://sc.cricity.net:15552/api';

  constructor(private http: HttpClient) {
   
  }

  sendDispute(data: any) {
    return this.http.post(`${this.baseUrl}/submitDispute`, data);
  }

  sendFeedback(data: any) {
    return this.http.post(`${this.baseUrl}/submitFeedback`, data);
  }

}
