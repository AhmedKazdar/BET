import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-col-center',
  templateUrl: './col-center.component.html',
  styleUrls: ['./col-center.component.scss']
})
export class ColCenterComponent implements OnInit {

  siteName = environment.siteName;

  isHome: boolean = false;
  isInplay: boolean = false;
  isMarkets: boolean = false;

  isLogin: boolean = false;
  iscasino: boolean = false;

  constructor(
    public router: Router,
    private tokenService: TokenService,
    private dfService: DataFormatsService
  ) {

    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

    // console.log(this.router.url)

    if (this.router.url == '/dash' || this.router.url.indexOf('/tpp') > -1 || this.router.url.indexOf('/aman') > -1 || this.router.url.indexOf('/lcasino') > -1 ||this.router.url.indexOf('/Other-Games') > -1 ||this.router.url.indexOf('/betgames') > -1 ||this.router.url.indexOf('/twain') > -1) {
      this.isHome = true;
      if(this.router.url.indexOf('/tpp') > -1 || this.router.url.indexOf('/aman') > -1 ||  this.router.url.indexOf('/lcasino') > -1 ||this.router.url.indexOf('/betgames') > -1 ||this.router.url.indexOf('/twain') > -1){
        this.iscasino = true;
      }else{
        this.iscasino = false;
      }
      this.isInplay = false;
      this.isMarkets = false;
    } else if (this.router.url == '/running') {
      this.isHome = false;
      this.isInplay = true;
      this.isMarkets = false;
      this.iscasino = false;

    } else if (this.router.url.indexOf('/fullmarkets')>-1 || this.router.url.indexOf('/casino')>-1) {
      this.isHome = false;
      this.isInplay = false;
      this.isMarkets = true;
      this.iscasino = false;

    }
    else {
      this.isHome = false;
      this.isInplay = false;
      this.isMarkets = false;
      this.iscasino = false;


    }

    this.router.events.subscribe((event: NavigationStart) => {
      if (event instanceof NavigationStart) {

        if (event.url == '/dash'  || event.url.indexOf('/tpp') > -1  || event.url.indexOf('/aman') > -1 || event.url.indexOf('/lcasino') > -1 || event.url.indexOf('/Other-Games') > -1 || event.url.indexOf('/betgames') > -1 || event.url.indexOf('/twain') > -1) {
          this.isHome = true;
          if(event.url.indexOf('/tpp') > -1 || event.url.indexOf('/aman') > -1 || event.url.indexOf('/lcasino') > -1 || event.url.indexOf('/betgames' ) > -1 || event.url.indexOf('/twain' ) > -1){
            this.iscasino = true;
          }else{
            this.iscasino = false;
          }
          this.isInplay = false;
          this.isMarkets = false;
        } else if (event.url == '/running') {
          this.isHome = false;
          this.isInplay = true;
          this.isMarkets = false;
        this.iscasino = false;

        } else if (event.url.indexOf('/fullmarkets')>-1) {
          this.isHome = false;
          this.isInplay = false;
          this.isMarkets = true;
        this.iscasino = false;

        }
        else {
          this.isHome = false;
          this.isInplay = false;
          this.isMarkets = false;
        this.iscasino = false;

        }
      }
    });
  }

  ngOnInit(): void {

    let isBlock = false;
    setInterval(() => {

      let OneClickBet;

      if (this.dfService.getOneClickSetting()) {
        OneClickBet = JSON.parse(this.dfService.getOneClickSetting());
        if (OneClickBet.isConfirmOneClickBet && OneClickBet.isOneClickBet && !isBlock) {
          setTimeout(() => {
            $('#oneClickBetStakeBox').css('display', 'block');
            // $('#overWrap').css('height', '26px');
          }, 200)
          isBlock = true;
        } else if (!OneClickBet.isOneClickBet) {
          isBlock = false;
        }
        if (OneClickBet.isOneClickBet) {
          this.setOverWrapHeight(true);
        } else {
          this.setOverWrapHeight(false);
        }
      }

    }, 10)
  }


  setOverWrapHeight(value) {
    let height;
    if (document.getElementById("overWrap")) {
      height = document.getElementById("overWrap").style.height;
      if (height) {
        height = parseInt(height.split('-')[1].replace('px)', ''));
      }
    }
    if (value) {
      if (height == 26) {
        height = height + 31;
      }
      if (height == 74) {
        height = height + 31;
      }
      if (height == 129) {
        height = height + 31;
      }
    } else {
      if (height == 57) {
        height = height - 31;
      }
      if (height == 105) {
        height = height - 31;
      }
      if (height == 160) {
        height = height - 31;
      }
    }

    $('#overWrap').css('height', 'calc(100% - ' + height + 'px)');
  }

}
