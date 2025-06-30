import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterState } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MainService } from './services/main.service';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  siteName = environment.siteName;
  intervalSub;
  allApiRes = {
    "devAdminIp": "https://333333.digital/pad=81",
    "devIp": "https://333333.digital/pad=82",
    "awcApi": "https://awc.vrnl.net/pad=500",
    "snApi": "https://sn.vrnl.net/pad=111",
    "slotApi": "https://slots.vrnl.net/pad=201",
    "betGameApi": "https://betgames.cricbuzzer.io/pad=401",
    "sportApi": "http://209.250.242.175:33332",
    "sportSocketApi": "ws://209.250.242.175",
    "liveTvApi": "https://api3.streamingtv.fun:3475",
    "scoreApi": "https://api3.streamingtv.fun:3441",
    "fanApi": "https://api3.streamingtv.fun:3455",
    "fancyApi": "https://api3.streamingtv.fun:3455",
    "premiumApi": "https://api3.streamingtv.fun:3450",
    "casApi": "https://api3.streamingtv.fun:3440",
    "casinoApi": "https://api3.streamingtv.fun:3440",
    "sslRacingApi": "https://apiallsports.xyz",
    "sslracingSocketApi": "wss://apiallsports.xyz",
    "sslAllSportApi": "https://allsportsapi.xyz",
    "sslAllSportSocketApi": "wss://allsportsapi.xyz",
    "sslExchangeGamesApi": "https://apiallsports.xyz",
    "sslSportApi": "https://141414.live",
    "sslsportSocketApi": "wss://141414.life",
    "ssladmin": "https://222222.digital/pad=81",
    "adminReport": "https://222222.digital/pad=81",
    "sslclient": "https://111111.info/pad=82",
    "fSource": 0,
    "maintanance": 0,
    "betwinImg": "",
    "bannerImg": [
    ]
  }
  testWhatsApp() {
    console.log('Test WhatsApp button clicked');
    const whatsappComp = document.querySelector('app-whatsapp');
    console.log('WhatsApp component found:', !!whatsappComp);
    const whatsappButton = document.querySelector('.whatsapp-float');
    console.log('WhatsApp button found:', !!whatsappButton);
    if (whatsappButton) {
      (whatsappButton as HTMLElement).click();
    }
  }

  constructor(
    public router: Router,
    private mainService: MainService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
    private tokenService: TokenService
  ) {
    if (localStorage.getItem('AllApi')) {
      this.allApiRes = JSON.parse(localStorage.getItem('AllApi'));
      this.mainService.apis2$.next(this.allApiRes);
      this.mainService.apis$.next(this.allApiRes);
    } else {
      this.mainService.apis2$.next(this.allApiRes);
      this.mainService.apis$.next(this.allApiRes);
    }
      // this.handleRouteEvents();
    
    if (this.siteName == "exch1") {
      let siteName = "exchange 1";
      this.titleService.setTitle(siteName.toUpperCase());
    } else if (this.siteName == "nayaludis") {
      let siteName = "9WICKETS";
      this.titleService.setTitle(siteName.toUpperCase());
    } else {
      this.titleService.setTitle(this.siteName.toUpperCase());
    }
    // this.titleService.setTitle(this.siteName.toUpperCase());

    let favicon = this.document.querySelector('#appIcon') as HTMLLinkElement;
    favicon.href = "https://b2c.static112233.com/assets/images/" + this.siteName + "/favicon.ico";
    // this.loadStyle('assets/theme/' + this.siteName + '.css');
    let bodytag = document.getElementsByTagName("BODY")[0];
    bodytag.classList.add(this.siteName);


    this.getAllApi(null);

    this.intervalSub = setInterval(() => {
      this.getAllApi('data')
    }, 60000)
  }

  getAllApi(data) {
    this.mainService.getApis().subscribe((res: any) => {
      localStorage.setItem('AllApi', JSON.stringify(res));
      this.mainService.apis2$.next(res);
      if (!data && !this.allApiRes) {
        this.mainService.apis$.next(data);
      }
    });
  }

  loadStyle(styleName: string) {
    const head = this.document.getElementsByTagName('head')[0];

    let themeLink = this.document.getElementById(
      'client-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }
  handleRouteEvents() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(this.router.routerState, this.router.routerState.root).join('-');
        this.titleService.setTitle(title);
        gtag('event', 'page_view', {
          page_title: title,
          page_path: event.urlAfterRedirects,
          page_location: this.document.location.href
        })
      }
    });
  }

  getTitle(state: RouterState, parent: ActivatedRoute): string[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data['title']) {
      data.push(parent.snapshot.data['title']);
    }
    if (state && parent && parent.firstChild) {
      data.push(...this.getTitle(state, parent.firstChild));
    }
    return data;
  }
  ngOnInit() {
  }
  
  ngOnDestroy(): void {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
  }

 
}
