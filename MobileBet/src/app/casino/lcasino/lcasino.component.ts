import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lcasino',
  templateUrl: './lcasino.component.html',
  styleUrls: ['./lcasino.component.scss']
})
export class LcasinoComponent implements OnInit {
  opentable: any;
  refresh: any = '1234';

  iframe: any;
  iframeurl: any;
  unno: any = '9404';
  unno1: any = '9412';
  casinotoken: any;
  token: any;
  loader: boolean = false;
  operatorId = 1234;

  constructor(private tokenService: TokenService, private sanitizer: DomSanitizer,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.opentable = params.opentable;
    })

  }

  ngOnInit(): void {
    this.token = this.tokenService.getToken();
    this.casinotoken = (btoa(this.token))
    let url = 'https://casinolaser.laserbook247.com/m/#/' + 'token/' + this.token + '/' + this.operatorId;
    this.iframe = url;
    this.iframeurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframe);
    $('#page_loading').css('display', 'none');
    this.loader = true;
  }

}
