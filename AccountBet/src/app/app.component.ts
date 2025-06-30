import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ClientApiService } from './services/client-api.service';
import { DataFormatsService } from './services/data-formats.service';
import { MainService } from './services/main.service';
import { ShareDataService } from './services/share-data.service';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  siteName = environment.siteName;
  stakeSettingData: any;
  isGameApiCall = true;

  constructor(
    private mainService: MainService,
    private clientApi: ClientApiService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private tokenService: TokenService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
    ) {
      this.titleService.setTitle(this.siteName.toUpperCase());

    let favicon = this.document.querySelector('#appIcon') as HTMLLinkElement;
    favicon.href = "https://b2c.static112233.com/myAccount/assets/images/" + this.siteName + "/favicon.ico";

    let bodytag = document.getElementsByTagName("BODY")[0];
    bodytag.classList.add(this.siteName);

    this.mainService.getApis().subscribe((res: any) => {
      this.mainService.apis$.next(res);
      this.sportWise();
      this.GetBetStakeSetting();
    });

  }

  GetBetStakeSetting() {
    let accountInfo = this.tokenService.getUserInfo();
    if (!accountInfo) {
      this.stakeSettingData = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100, 500, 1000, 5000]
      this.shareService.shareStakeButton(this.stakeSettingData);
      return;
    }

    if (accountInfo.stakeSetting) {
      this.stakeSettingData = accountInfo.stakeSetting.split(',');
    } else {
      this.stakeSettingData = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100, 500, 1000, 5000]
    }
    this.stakeSettingData.forEach((element: any, index: number) => {
      this.stakeSettingData[index] = parseInt(element);
    });
    this.shareService.shareStakeButton(this.stakeSettingData);
  }

  sportWise() {
    if (!this.isGameApiCall) {
      return;
    }
    this.isGameApiCall = false;

    this.clientApi.listGames().subscribe((resp: any) => {
      if (resp.result) {
        if (resp.result) {
          resp.result.forEach((item: any) => {
            if (item.sportsName == "Virtual Cricket") {
              item.sportsName = "cricket";
              item.sportId = "4";
              item.eventTypeId = "4";
              item['isVirtual'] = true;
              item['isBm'] = true;
            }
            if (item.sportsName == "Kabaddi") {
              item.competitionName = "Pro Kabaddi 2021-22";
              item['isKabaddi'] = true;
              item['isBm'] = true;
              // item['isFancy'] = true;
            }
            if (item.sportsName == "Election") {
              item['isKabaddi'] = true;
              // item['isBm'] = true;
              item['isFancy'] = true;
              item['marketName'] = "Assembly Election 2022";

            }

            if (item.eventName.indexOf(' T10 v ') > -1) {
              item.competitionId = "505540854";

              item.competitionName = "T10 Virtual Cricket League";
            }

          })
        }

        if (this.siteName != 'cricbuzzer' && this.siteName != 'cricbuzzerlive' ) { //Remove new all sport
          resp.result = resp.result.filter(item => {
            return parseInt(item.eventTypeId) < 100 && parseInt(item.eventTypeId) != 6;
          });
        }
        this.shareService.shareListGamesData(resp.result);
        this.shareService.shareSportData(this.dfService.getSportDataFormat(resp.result));

        this.isGameApiCall = true;
      }
    }, err => {
      this.isGameApiCall = true;
    });
  }


}
