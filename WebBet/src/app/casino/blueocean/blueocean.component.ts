import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { MainService } from 'src/app/services/main.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-blueocean',
  templateUrl: './blueocean.component.html',
  styleUrls: ['./blueocean.component.scss']
})
export class BlueoceanComponent implements OnInit {
  @ViewChild('tab1', { read: ElementRef }) public tab: ElementRef<any>;
  blueocean: any;
  provider;
  listgame: any;
  gameCode: any;
  accountInfo: any;
  BOUrl: string | URL;

  constructor(private casinoapiService: CasinoApiService,
    private main: MainService,
    private tokenService: TokenService,
    private sanitizer: DomSanitizer,
    private toastr: ToastMessageService,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.accountInfo = this.tokenService.getUserInfo();
    this.main.apis$.subscribe((res) => {
      this.bolistProvider();
      this.route.params.subscribe(params => {
        this.provider = params.provider;
      })
    });
  }

  bolistProvider() {
    this.casinoapiService.bolist().subscribe((res: any) => {
      this.blueocean = res.result
      this.blueocean.forEach(element => {
        if (element.provider === this.provider) {
          this.bogamesdata(this.provider);
        } else{
          return
        }
      });
    })
  }

  bogamesdata(provider) {
    this.provider = provider
    this.casinoapiService.boGames(provider).subscribe((res: any) => {
      this.listgame = res
    })
  }

  opengame(o: any) {
    this.gameCode = o
    let data = {
      "userName": this.accountInfo.userName,
      "gameId": this.gameCode,
      "externalUrl": window.origin,
    }
    console.log(data)
    this.casinoapiService.boAuth(data).subscribe((resp: any) => {
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

      $('#page_loading').css('display', 'none');
    })
  }
  WLIDMapping(errorDescription: string): number {
    const match = errorDescription.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }
  public scrollRight(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft + 200), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft - 200), behavior: 'smooth' });
  }

}
