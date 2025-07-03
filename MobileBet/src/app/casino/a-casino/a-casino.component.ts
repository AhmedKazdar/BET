import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-a-casino',
  templateUrl: './a-casino.component.html',
  styleUrls: ['./a-casino.component.scss']
})
export class ACasinoComponent implements OnInit {
  token: any;
  amanUrl: any;
  opentable: any;
  refresh: any = '1234';
  constructor(private tokenService: TokenService, private sanitizer: DomSanitizer, private route: ActivatedRoute,
    private toastr:ToastMessageService,
    private shareService:ShareDataService
  ) {
    this.route.params.subscribe(params => {
      this.opentable = params.opentable;

    })
    this.shareService.getgameStatus$.subscribe((data) => {
      if (data) {
        const amancasinoBlocked = data?.some(market => market?.sport === 'amancasino' && market?.blocked);
        if (amancasinoBlocked) {
          this.toastr.errorMsg('This Casino is blocked by upper level.')
          window.location.href = '/404';
        }
      }
    })
  }

  ngOnInit(): void {
    this.token = this.tokenService.getToken();
    let operatorId = "9714";
    let url = 'https://m2.fawk.app/#/splash-screen/' + this.token + '/' + operatorId + '?' + 'opentable=' + this.opentable + '&' + 'refresh=' + this.refresh;
    this.amanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    $('#page_loading').css('display', 'none');
  }


}
