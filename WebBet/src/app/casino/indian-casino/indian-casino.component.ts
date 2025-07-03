import { Component, OnInit } from '@angular/core';
import { ClientApiService } from 'src/app/services/client-api.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-indian-casino',
  templateUrl: './indian-casino.component.html',
  styleUrls: ['./indian-casino.component.scss']
})
export class IndianCasinoComponent implements OnInit {
  siteName: string = environment.siteName;

  casinoList: any = [];
  casinoLists: any = [];
  isLogin: boolean = false;
  casinoListlist: any = [];
  casinoListssports365: any = [];
  loadrainbow: boolean=false;
  Update: any;

  constructor(
    private shareService: ShareDataService,
    private main: MainService,
    private tokenService: TokenService,
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

    if (this.isLogin) {
      this.main.apis$.subscribe((res) => {
        $('#loading').css('display', 'block');
        this.listCasinoTable();
      });
    }

  }

  ngOnInit(): void {
    this.getlanguages();
    this.casinoListlist = [
      
  
        { "tableName": "Live Teenpatti", "CasinoName": "LiveTP", "opentable": 56767 },
        { "tableName": "Andar Bahar", "CasinoName": "Andar-Bahar", "opentable": 87564 },
       { "tableName": "Poker", "CasinoName": "Poker1Day", "opentable": 67564 },
       { "tableName": "7 up & Down", "CasinoName": "7Up-Down", "opentable": 98789 },
       { "tableName": "Roulette", "CasinoName": "Roulette", "opentable": 98788 },
       { "tableName": "Sicbo", "CasinoName": "Sicbo", "opentable": 98566 },
       { "tableName": "32 cards casino", "CasinoName": "32Cards", "opentable": 56967 },
       { "tableName": "Hi Low", "CasinoName": "Hi-Low", "opentable": 56968 },
       { "tableName": "Worli Matka", "CasinoName": "Matka", "opentable": 92037 },
       { "tableName": "Baccarat", "CasinoName": "Baccarat", "opentable": 92038 },
       { "tableName": "Six player poker", "CasinoName": "Poker6P", "opentable": 67565 },
       { "tableName": "Teenpatti T20", "CasinoName": "TP T20", "opentable": 56768 },
       { "tableName": "Amar Akbar Anthony", "CasinoName": "AAA", "opentable": 98791 },
        { "tableName": "Dragon Tiger", "CasinoName": "Dragon-Tiger", "opentable": 98790 },
       { "tableName": "Race 20-20", "CasinoName": "Race 20-20", "opentable": 90100 },
       { "tableName": "Bollywood Casino", "CasinoName": "Bollywood", "opentable": 67570 },
       { "tableName": "Casino Meter", "CasinoName": "Casino Meter", "opentable": 67575 },
       { "tableName": "Casino War", "CasinoName": "Casino War", "opentable": 67580 },
       { "tableName": "Poker 20-20", "CasinoName": "Poker2020", "opentable": 67567 },
       { "tableName": "Muflis Teenpatti", "CasinoName": "MuflisTP", "opentable": 67600 },
       { "tableName": "Trio", "CasinoName": "MuflisTP", "opentable": 67610 },
       { "tableName": "2 Cards Teenpatti", "CasinoName": "2CardTP", "opentable": 67660 },
       { "tableName": "The Trap", "CasinoName": "Trap", "opentable": 67680 },
       { "tableName": "Teenpatti Test", "CasinoName": "TPTest", "opentable": 67630 },
       { "tableName": "Queen", "CasinoName": "Queen", "opentable": 67620 },
       { "tableName": "Teenpatti Open", "CasinoName": "Race to 17", "opentable": 67640 },
       { "tableName": "29 Card Baccarat", "CasinoName": "29 Card Baccarat", "opentable": 67690 },
       { "tableName": "Race to 17", "CasinoName": "Race to 17", "opentable": 67710 },



    
       
       { "tableName": "Six player poker (Virtual)", "CasinoName": "Poker6P (V)", "opentable": 67566 },
       { "tableName": "Teenpatti One-Day (Virtual)", "CasinoName": "TPOneDay (V)", "opentable": 56766 },
       { "tableName": "Andar Bahar (Virtual)", "CasinoName": "AB (V)", "opentable": 87565 },
       { "tableName": "Teenpatti T20 (Virtual)", "CasinoName": "TP T20 (V)", "opentable": 56769 },
       { "tableName": "Hi Low (Virtual)", "CasinoName": "High-Low (V)", "opentable": 56969 },
       { "tableName": "Poker  (Virtual)", "CasinoName": "Poker (V)", "opentable": 67563 },
       { "tableName": "Matka (Virtual)", "CasinoName": "Mataka (V)", "opentable": 92036 },
       { "tableName": "7 up & Down (Virtual)", "CasinoName": "7Up-Down (V)", "opentable": 98793 },
       { "tableName": "Dragon Tiger (Virtual)", "CasinoName": "DT (V)", "opentable": 98794 },
       { "tableName": "Amar Akbar Anthony (Virtual)", "CasinoName": "AAA (V)", "opentable": 98795 },
       { "tableName": "Roulette (Virtual)", "CasinoName": "Roulette (V)", "opentable": 98792 },
       { "tableName": "32 cards casino (Virtual)", "CasinoName": "32Cards (V)", "opentable": 56966 },
    
    
  
    
     ];

  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }
  dosomething(){
    this.loadrainbow=true
  }

  listCasinoTable() {
    this.shareService.casinoList$.subscribe((resp: any) => {
      if (resp) {
        this.casinoList = resp;
        $('#loading').css('display', 'none');
      }
    });
  }

  trackByFn(item, index) {
    return item.matchId;
  }

}

