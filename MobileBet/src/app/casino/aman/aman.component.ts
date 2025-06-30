import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-aman',
  templateUrl: './aman.component.html',
  styleUrls: ['./aman.component.scss']
})
export class AmanComponent implements OnInit {
  token: any;
  amanUrl: any;
  siteName = environment.siteName
  opentable: any;
  refresh: any = '1234';
  AuthResData: any;
  accountInfo: any;
  constructor(
    private tokenService: TokenService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private shareService: ShareDataService,
    private casinoApi: CasinoApiService,
    private toastr:ToastMessageService,
  ) {
    this.token = this.tokenService.getToken();
    this.route.params.subscribe(params => {
      this.opentable = params.opentable;

    })
    this.shareService.getgameStatus$.subscribe((data) => {
      if (data) {
        const amancasinoBlocked = data?.some(market => market?.sport === 'amancasino' && market?.blocked);
        if (amancasinoBlocked) {
          this.toastr.errorMsg('This Casino is blocked by upper level.')
        }
      }
    })
  }

  ngOnInit(): void {
    this.accountInfo = this.tokenService.getUserInfo();
    this.casinoApi.getAuraOperators().subscribe(
      (response: any) => {
        const operatorId = response.result;
        
        const data = {
          token: this.token,
          operatorId: operatorId,
        };

        this.casinoApi.amanAuthNew(data).subscribe((resp: any) => {
          this.AuthResData = resp;
          let url = 'https://aura.fawk.app/' + this.AuthResData.token + '/' + this.AuthResData.operatorId;
          this.amanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          $('#page_loading').css('display', 'none');
        });
      },
    );
  }

}
