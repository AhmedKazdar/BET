import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-twain',
  templateUrl: './twain.component.html',
  styleUrls: ['./twain.component.scss']
})
export class TwainComponent implements OnInit {
  accountInfo: any;
  Token: any;
  twainUrl: SafeResourceUrl;
  isAuthPending_twain: boolean = false;

  constructor(private casinoapiService: CasinoApiService,
    private sanitizer: DomSanitizer,
    private toastr: ToastMessageService,
    private tokenService: TokenService,
    private shareService:ShareDataService) { 
      this.shareService.getgameStatus$.subscribe((data)=>{
        const betgamecasinoBlocked = data?.some(market => market?.sport === 'betgames' && market?.blocked);
        if(betgamecasinoBlocked){
          this.toastr.errorMsg('This Casino is blocked by upper level.')
          
        }
      })
    }

  ngOnInit(): void {
    this.accountInfo = this.tokenService.getUserInfo();
    this.betgamesdata();


  }
  betgamesdata() {
    let data = {
      "userName": this.accountInfo.userName,
    }
    if (this.isAuthPending_twain) {
      return;
    }
    this.isAuthPending_twain = true;

    this.casinoapiService.betgamesdata(data).subscribe((res: any) => {
      this.Token = res.token
      // console.log(res.token)
      if (res && this.Token) {
        // let url=`https://integrations-ag-iframe.betgames.tv//#/auth?apiUrl=https://integrations-ag-bp.betgames.tv/&wsUrl=https://integrations-ag-ws.betgames.tv&partnerCode=cricbuzzer_io_dev_twain&token=${this.Token}&language=en&timezone=2`
        let url = `https://web.twainsports.com//#/auth?apiUrl=http://7ds0t9ij.twainsports.com/&wsUrl=https://ws.twainsports.com&partnerCode=lc247_co_twain&token=${this.Token}&language=en&timezone=2`
        this.twainUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        this.toastr.errorMsg(res.errorDescription);
      }
      setTimeout(() => {
        this.isAuthPending_twain = false;
      }, 1000)
    }, err => {
      this.isAuthPending_twain = false;
    }
    )
  }


}
