import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-awclist',
  templateUrl: './awclist.component.html',
  styleUrls: ['./awclist.component.scss']
})
export class AwclistComponent implements OnInit {

  @ViewChild('tab1', { read: ElementRef }) public tab: ElementRef<any>;
  isAuthPending: boolean = false;
  isAuthPending_direct: boolean = false;

  accountInfo: any;
  awccasinoList = [
    { "platform": "E1SPORT", "gameType": "ESPORTS", "gameCode": "E1-ESPORTS-001", "gameName": "eSports" },
    { "platform": "SV388", "gameType": "LIVE", "gameCode": "SV-LIVE-001", "gameName": "CockFight" },
    { "platform": "SEXYBCRT", "gameType": "LIVE", "gameCode": "MX-LIVE-001", "gameName": "Baccarat Classic" },
    { "platform": "KINGMAKER", "gameType": "SLOT", "gameCode": "KM-SLOT-001", "gameName": "Sugar Blast" },
    { "platform": "JILI", "gameType": "FH", "gameCode": "JILI-FISH-001", "gameName": "Royal Fishing" },
    { "platform": "HORSEBOOK", "gameType": "LIVE", "gameCode": "HRB-LIVE-001", "gameName": "Horsebook" },
    { "platform": "JDBFISH", "gameType": "FH", "gameCode": "JDB-FISH-002", "gameName": "CaiShenFishing" },
    { "platform": "JDB", "gameType": "SLOT", "gameCode": "JDB-SLOT-001", "gameName": "Burglar" },
    { "platform": "FC", "gameType": "EGAME", "gameCode": "FC-EGAME-001", "gameName": "MONEY TREE DOZER" },
    { "platform": "FASTSPIN", "gameType": "SLOT", "gameCode": "FastSpin-SLOT-001", "gameName": "Royale House" },
    { "platform": "LUCKYPOKER", "gameType": "TABLE", "gameCode": "LUCKYPOKER-TABLE-001", "gameName": "Gao Gae" },
    { "platform": "LUDO", "gameType": "TABLE", "gameCode": "LUDO-TABLE-001", "gameName": "LUDO" },
    { "platform": "PG", "gameType": "SLOT", "gameCode": "PG-SLOT-001", "gameName": "Honey Trap of Diao Chan" },
    { "platform": "PP", "gameType": "LIVE", "gameCode": "PP-LIVE-001", "gameName": "Baccarat 1" },
    { "platform": "PT", "gameType": "LIVE", "gameCode": "PT-LIVE-001", "gameName": "Baccarat" },
    { "platform": "RT", "gameType": "SLOT", "gameCode": "RT-SLOT-001", "gameName": "AncientScript" },
    { "platform": "SABA", "gameType": "VIRTUAL", "gameCode": "SABA-VIRTUAL-001", "gameName": "Virtual Sports" },
    { "platform": "FASTSPIN", "gameType": "SLOT", "gameCode": "FastSpin-SLOT-021", "gameName": "Oceanic Melodies" },
    { "platform": "SPADE", "gameType": "EGAME", "gameCode": "SG-EGAME-001", "gameName": "DerbyExpress" },
    { "platform": "VENUS", "gameType": "LIVE", "gameCode": "VN-LIVE-001", "gameName": "Baccarat Classic" },
    { "platform": "YESBINGO", "gameType": "BINGO", "gameCode": "YesBingo-BINGO-001", "gameName": "WinCaiShen" },
    { "platform": "YL", "gameType": "EGAME", "gameCode": "YL-EGAME-002", "gameName": "Gold Shark" },
  ];
  listawc: { platform: string; gameType: string; gameCode: string; gameName: string; };
  AWClists: any;
  awclists: any;
  data: any[];
  awcGames: any;
  awcPlatform: any;
  Platform: string;
  isLogin: boolean = false;
  openURL: any;
  openYL: boolean = false;
  awcOpenGame: any;

  constructor(
    private casino: CasinoApiService,
    private tokenService: TokenService,
    private main: MainService,
    private share: ShareDataService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    $('#page_loading').css('display', 'flex');
    this.accountInfo = this.tokenService.getUserInfo();
    if (this.tokenService.getToken()) {
      this.isLogin = true;
      this.main.apis$.subscribe((res) => {
        this.AWCList();
        this.route.params.subscribe(params => {
          this.Platform = params.Platform;
          this.AWCFilter(this.Platform)
        })
      });
    }

  }

  AWCList() {
    this.casino.awclist().subscribe((resp: any) => {
      this.AWClists = resp.result
      this.AWClists?.sort((a, b) => a?.Platform?.localeCompare(b?.Platform));
        this.AWClists.forEach(element => {
          if (element.Platform == this.Platform) {
            this.AWCFilter(element)
          }
        });
      $('#page_loading').css('display', 'none');

    })
  }
  AWCFilter(filter) {
    this.awcGames = filter.Games
    this.awcPlatform = filter.Platform

  }
  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  }



  openAWC(gameType: any, platform: any, gameCode: any) {
    if (!this.isLogin) {
      return;
    }

    if (this.isAuthPending) {
      return;
    }
    this.isAuthPending = true;

    // if (platform == 'YL' || this.accountInfo.currencyCode == 'INR' || this.accountInfo.currencyCode == 'BDT') {
    //   $('#coming_soon').css('display', 'block');
    // }
    let data = {
      "userName": this.accountInfo.userName,
      "gameType": gameType,
      "isMobile": true,
      "externalUrl": window.origin,
      "platform": platform,
      "gameCode": gameCode,
      "isLaunchGameTable": true,
    }
    this.awcOpenGame = data

    // if (platform != 'YL' && this.accountInfo.currencyCode != 'INR' && this.accountInfo.currencyCode != 'BDT') {
      this.casino.awcAuth(data).subscribe((resp: any) => {
        if (resp.errorCode == 0 && resp.url) {
          window.open(resp.url, "_self");
        } else {
          const idNameMap = {
            2: 'whitelabel',
            3: 'admin',
            4: 'subadmin',
            5: 'supermaster',
            6: 'master',
            7: 'agent',
            8: 'client'
          };
    
          const errorDescription = resp.errorDescription;
          const id = this.WLIDMapping(errorDescription);
          const name = idNameMap[id];
    
          if (name) {
            const ErrorDescription = errorDescription.replace(id.toString(), name);
          alert(ErrorDescription);
          } else {
            alert(resp.errorDescription); 
          }
        }
        setTimeout(()=>{
          this.isAuthPending = false;
        },1000)

      }, err => {
        this.isAuthPending = false;
      }
      )
    // }
  }

  WLIDMapping(errorDescription: string): number {
    const match = errorDescription.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }
  hideOverlayInfo(value) {
    if (this.isAuthPending_direct) {
      return;
    }
    this.isAuthPending_direct = true;
    this.casino.awcAuth(this.awcOpenGame).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        window.open(resp.url, "_self");
      } else {
        alert(resp.errorDescription);
      }
      setTimeout(()=>{
        this.isAuthPending_direct = false;
      },1000)
    }, err => {
      this.isAuthPending_direct = false;
    }
    )
    $('#YL').css('display', 'none');
    $(value).fadeOut();
  }


  public scrollRight(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft + 200), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft - 200), behavior: 'smooth' });
  }
  showOverlayInfo(value) {
    $(value).css('display', 'flex');
  }



}
