import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CasinoApiService } from '../../services/casino-api.service';
import { TokenService } from '../../services/token.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { ActivatedRoute } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-betgames',
  templateUrl: './betgames.component.html',
  styleUrls: ['./betgames.component.scss']
})
export class BetgamesComponent implements OnInit {
  accountInfo: any;
  Token: any;
  betgamesUrl: SafeResourceUrl;
  isAuthPending_betgame: boolean = false;
  paramid: any;

  constructor(private casinoapiService: CasinoApiService,
    private toastr: ToastMessageService,
    private sanitizer: DomSanitizer, 
       private route: ActivatedRoute,
    private tokenService: TokenService,
  private shareService:ShareDataService) {
      this.route.params.subscribe(params => {
        this.paramid = params.Id
  
      })
      this.shareService.getgameStatus$.subscribe((data)=>{
        const betgamecasinoBlocked = data?.some(market => market?.sport === 'betgames' && market?.blocked);
        if(betgamecasinoBlocked){
         alert('This Casino is blocked by upper level.')
        }
      })
     }

  ngOnInit(): void {
    this.accountInfo = this.tokenService.getUserInfo();
    this.betgamesdata();


  }
  betgamesdata() {
    if (this.isAuthPending_betgame) {
      return;
    }
    this.isAuthPending_betgame = true;
    let data = {
      "userName": this.accountInfo.userName,
    }
    this.casinoapiService.betgamesdata(data).subscribe((res: any) => {
      this.Token = res.token
      if (res && this.Token) {
        let url = `https://webiframe.betgames.tv//#/auth?apiUrl=https://game3.betgames.tv/&partnerCode=lc247_co&partnerToken=${this.Token}&language=en&timezone=2`
        this.betgamesUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
      if (res && this.Token && this.paramid) {
        // let url=`https://integrations01-webiframe.betgames.tv//#/auth?apiUrl=https://integrations01.betgames.tv/&partnerCode=cricbuzzer_io_dev&partnerToken=${this.Token}&language=en&timezone=2`
        let url = `https://webiframe.betgames.tv//#/auth?apiUrl=https://game3.betgames.tv/&partnerCode=lc247_co&partnerToken=${this.Token}&language=en&timezone=2&gameId=${this.paramid}`
        this.betgamesUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
      else{
        this.toastr.errorMsg(res.errorDescription);

      }
      setTimeout(() => {
        this.isAuthPending_betgame = false;
      }, 1000)
    }, err => {
      this.isAuthPending_betgame = false;
    })
  }


}
