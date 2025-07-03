import { Component, OnInit } from '@angular/core';
import { ClientApiService } from 'src/app/services/client-api.service';
import { MainService } from 'src/app/services/main.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  news: string = "";
  vnews: string = "";
  siteName: string = environment.siteName;


  newsPending: boolean = false;
  newsPending2: boolean = false;
  isLogin: boolean = false;
  intervalSub;

  constructor(
    private userService: ClientApiService,
    private main: MainService,
    private tokenService: TokenService,

  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

    if (this.isLogin) {
      this.main.apis$.subscribe((res) => {
        this.getticker();
        this.getNews();
      });
    }
  }

  ngOnInit() {
  }


  getNews() {
    if (this.newsPending) {
      return;
    }
    this.newsPending = true;
    this.vnews = "";
    this.userService.getTicker().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        resp.result = resp.result.map(t => { t.ticker = atob(t.ticker); return t });
        resp.result.forEach((element: any) => {
          this.vnews = this.vnews + " | " + element.ticker;
        });
      }
      this.newsPending = false;
    }, err => {
      this.newsPending = false;
    })
  }

  getticker() {
    if (this.newsPending2) {
      return;
    }
    this.newsPending2 = true;
    this.userService.get_ticker().subscribe((resp: any) => {
      if (!this.news) {
      }
      this.news = resp.ticker;

      this.newsPending2 = false;
    }, err => {
      this.newsPending2 = false;
    })
  }




}
