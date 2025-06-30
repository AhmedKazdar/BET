import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataFormatsService } from '../services/data-formats.service';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-promote-banner',
  templateUrl: './promote-banner.component.html',
  styleUrls: [
    './promote-banner.component.scss'
  ]
})
export class PromoteBannerComponent implements OnInit, AfterViewInit {
  siteName = environment.siteName;

  isLogin: boolean = false;
  sportSubscription: Subscription;
  sportList = [];
  accountInfo: any;
  ishkdCurrency: boolean = false;
  IPLBanner: any;
  constructor(
    private tokenService: TokenService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private main: MainService
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }

  ngOnInit() {
    this.sportWise();
    this.UserDescription();
    this.main.apis2$.subscribe((res) => {
     this.IPLBanner = res.bannerImg          
    })

  }
  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    if (this.accountInfo) {
      if (this.accountInfo.currencyCode == 'HKD' && this.siteName == 'cricbuzzer' || this.siteName == 'cricbuzzerlive') {
        this.ishkdCurrency = true;
      }
    }

    // console.log(this.accountInfo)
  }

  sportWise() {
    $('#page_loading').css('display', 'flex');

    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        this.sportList = this.dfService.sportEventWise(data, 0);
        $('#page_loading').css('display', 'none');
      }
    });
  }
  ngAfterViewInit(): void {
    (<any>$('.promo-banner')).flexslider({
      start: function () {
        $(".promo-banner-wrap").addClass("active");
        $(".promo-banner").resize()
      },
      namespace: "promo-",
      animation: "slide",
      direction: "horizontal",
      slideshowSpeed: 4000,
      animationSpeed: 500,
      pauseOnHover: false,
      controlNav: true,
      directionNav: true,
      allowOneSlide: false,
      prevText: "",
      nextText: ""
    });
  }
}
