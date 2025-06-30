import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountUp } from 'countup.js';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CasinoApiService } from '../services/casino-api.service';
import { ClientApiService } from '../services/client-api.service';
import { DataFormatsService } from '../services/data-formats.service';
import { LoginService } from '../services/login.service';
import { MainService } from '../services/main.service';
import { ShareDataService } from '../services/share-data.service';
import { ToastMessageService } from '../services/toast-message.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  AferLoginChangePassword: boolean = environment.AferLoginChangePassword;
  siteName: string = environment.siteName;
  isb2c: boolean = environment.isb2c;


  accountInfo: any;
  fundInfo: any;

  activeEventId: any;

  status: string = "";
  msgData: any;
  timeoutReset;

  pingPending: boolean = false;
  isClicked: boolean = true;
  listBetsPending: boolean = false;
  ispendingactiveplayer: boolean = false;


  isLogin: boolean = false;
  fundInterval;
  lowBalanceInterval;
  eventBetsSubscription: Subscription;
  mainInterval;
  displaypluseight: any = "displaynone";
  displayplusWallet: any = "displaynone";
  activePlayerTimer;
  activePlayer:string='';
  Update: any;
  isCross: boolean = true;
  currency:any

  private readonly idToNameMap: { [key: number]: string } = {
    2: "Whitelabel",
    3: "Admin",
    4: "Subadmin",
    5: "Supermaster",
    6: "Master",
    7: "Agent",
    8: "Client"
  };

  constructor(
    private tokenService: TokenService,
    private loginService: LoginService,
    private toastr: ToastMessageService,
    private main: MainService,
    private clientApi: ClientApiService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private router: Router,
    private casinoapiService: CasinoApiService,
    private apiService: ClientApiService,
    private casino: CasinoApiService,

  ) {
    this.listAWCLocal()
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

  }

  ngOnInit(): void {
    this.getlanguages();
    this.shareService.activeMatch.subscribe(data => {
      this.activeEventId = data;
    })
    this.mainInterval = setInterval(() => {
      let maintain = this.tokenService.getMaintanance()
      if (maintain == '1') {
        this.router.navigate(['maintenance']);
      }
    }, 1000)
    this.getToastMessage();
    if (this.isLogin) {
      this.main.apis$.subscribe((res) => {
        // this.myMarketMatch();
        this.UserDescription();
        // this.QuitCasino(null);
        this.FundExpo('click');
        this.listAWC();
        
        this.listBets();

        this.shareService.updateFundExpo$.subscribe(data => {
          if (data == 'event') {
            // console.log(data,"this.fundInfo");
            // 
            this.FundExpo('refresh');
            // this.listBets();
          } else if (data) {
            this.fundInfo = data[3][0];

            let allbets = this.dfService.matchUnmatchBetsMarketWise(data[2]);
            this.shareService.shareListBets(allbets);
          }
          // this.FundExpo('refresh');
          // // this.listBets();
        })
        if (this.accountInfo) {
          if (this.accountInfo.newUser == 1 && this.AferLoginChangePassword) {
            this.router.navigate(['change_pass']);
          }
        }
    

      });

      this.fundInterval = setInterval(() => {
        this.FundExpo(null);
        if (this.accountInfo.newUser == 1 && this.AferLoginChangePassword) {
          this.router.navigate(['change_pass']);
        }
      }, 60000)
      if (this.tokenService.getNewUser() == null) {
        if(this.isb2c){
          this.open18plusPop();
        }
      } else {
        this.close18plusPop();
      }

      setTimeout(() => {
        if (this.accountInfo?.currencyCode == "INR") {
          if (this.fundInfo?.balance < 100 && this.fundInfo?.exposure == 0) {
            if(this.isb2c){
            this.lowBalancePop();
            }
          }
        }
      }, 1000);
      this.lowBalanceInterval = setInterval(() => {
        if (this.accountInfo?.currencyCode == "INR") {
          if (this.fundInfo?.balance < 100 && this.fundInfo?.exposure == 0) {
            if(this.isb2c){
            this.lowBalancePop();
            }
          }
        }
      }, 300000)
    }
    if(this.siteName=='cricbuzzer' || this.siteName == 'cricbuzzerlive'){
      this.getActivePlayer();
      this.activePlayerTimer = setInterval(() => {
        this.getActivePlayer();
      }, 10000)
    }
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      if(this.Update?.Login=="প্রবেশ করুন" || this.Update?.Login=="inicio sesión" || this.Update?.Login=="Conecte-se" || this.Update?.Login=="Giriş yapm" ){
        console.log("",this.Update?.Login)
        $("#logcls").css('font-size', '10px');
        $("#logcls1").css('font-size', '10px');
      }else{
        $("#logcls").css('font-size', 'inherit');
        $("#logcls1").css('font-size', 'inherit');
      }
      // console.log(this.Update);

    })
  }
  getActivePlayer(){
    if(this.ispendingactiveplayer){
      return;
    }
    this.ispendingactiveplayer = true;
    this.apiService.getActivePlayers().subscribe((resp: any) => {
      if(resp.status=='Success'){        
        this.tokenService.setActivePlayer(resp.data.activePlayer);
        this.startAnimation(resp.data.activePlayer);
      }
      this.ispendingactiveplayer = false;     
    }, err => {
      this.ispendingactiveplayer = false;
    });
  }

  startAnimation(player:any){
    let demo = new CountUp('activePlayer', player,{startVal:Number(this.activePlayer)});
    this.activePlayer = player;
    if (!demo.error) {
      demo.start();
    } else {
      console.error(demo.error);
    }
  }

  close18plusPop() {
    this.displaypluseight = "displaynone"
    this.tokenService.setNewUser(1);
  }

  open18plusPop() {
    this.displaypluseight = "displayblock"

  }

  lowBalancePop() {
    this.displayplusWallet = "displayblock"
  }

  closeLowBalance() {
    this.displayplusWallet = "displaynone"
  }

  gotoDeposit() {
    this.closeLowBalance();
    this.router.navigate(['dw']);
    // var j = $("#dwSlide");
    // var s = $("#dwDiv");
    // s.css("display", "flex");
    // j.addClass("right-in");
    // window.setTimeout(function () {
    //   j.removeClass("right-in")
    // }, 1000)
  }

  ngAfterViewInit() {
    this.openBetsBtn();
    this.openSettingBtn();
  }

  Logout() {
    this.loginService.logout().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        this.tokenService.removeToken();
      } else {
        this.tokenService.removeToken();
      }
    }, err => {
      this.tokenService.removeToken();
    })
  }

  showTv() {
    if (this.fundInfo?.balance < 1 && this.fundInfo?.exposure < 1 && this.isb2c) {
      this.toastr.errorMsg('Insufficient balance to view live stream');
    } else {
      this.shareService.showLiveTv.emit(true);
    }
  }

  getToastMessage() {
    this.toastr.successMsgSource.subscribe(data => {
      // console.log(data)
      this.status = 'success';
      this.msgData = data;
      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    })
    this.toastr.errorMsgSource.subscribe(data => {
      this.status = 'error';
      this.msgData = data;
    
      const match = this.msgData?.match(/Bet Blocked On This Sport By (\d+)/);
      const matchCasino = this.msgData?.match(/This Casino is blocked by (\d+)/);
      if (match) {
        const id = parseInt(match[1], 10);
        if (this.idToNameMap[id]) {
          this.msgData = `Bet Blocked On This Sport By ${this.idToNameMap[id]}`;
        }
      }
      if (matchCasino) {
        const id = parseInt(matchCasino[1], 10);
        if (this.idToNameMap[id]) {
          this.msgData = `This Casino is blocked by ${this.idToNameMap[id]}`;
        }
      }

      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    })
    this.toastr.warningMsgSource.subscribe(data => {
      this.status = 'warning';
      this.msgData = data;
      
        if (this.msgData == "Parlay Bets Enable") {
          this.isCross = false
        } else {
          this.isCross = true
        }
      
      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    })
  }

  removeMsg() {
    this.msgData = null;
    clearTimeout(this.timeoutReset);
  }


  openBetsBtn() {
    var V = $("#openBetsLeftSide");
    var W = V.find("#openBetSlide");
    $("#openBetsBtn").unbind("click").click(function () {
      V.show();
      W.css("display", "flex");
      W.addClass("left-in");

      window.setTimeout(function () {
        W.removeClass("left-in")
      }, 1000)
    })

    $("a#close").bind("click", function () {
      V.fadeOut();
    });
  }

  openSettingBtn() {
    var j = $("#settingSlide");
    var s = $("#settingDiv");

    $("a.a-setting").off("click").on("click", function () {

      s.css("display", "flex");
      j.addClass("right-in");
      window.setTimeout(function () {
        j.removeClass("right-in")
      }, 1000)
    });

    $("#settingClose").bind("click", function () {
      s.fadeOut();
      s.css("display", "none");
    });
    // $("#settingCancel").bind("click", function () {
    //   s.fadeOut();
    //   s.css("display", "none");
    // });
    // $("#settingSave").bind("click", function () {
    //   s.fadeOut();
    //   s.css("display", "none");
    // });
  }

  openDWBtn() {
    this.router.navigate(['dw']);

    // var j = $("#dwSlide");
    // var s = $("#dwDiv");

    // $("#dw").off("click").on("click", function () {
    //   s.css("display", "flex");
    //   j.addClass("right-in");
    //   window.setTimeout(function () {
    //     j.removeClass("right-in")
    //   }, 1000)
    // });

    // $("#dwClose").bind("click", function () {
    //   s.fadeOut();
    //   s.css("display", "none");
    // });
  }


  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
   this.currency = this.accountInfo?.currencyCode
  }
  // QuitCasino(isdata) {
  //   if (this.isIcasino || !this.accountInfo) {
  //     return
  //   }

  //   // if (this.siteName == 'cricbuzzer' || this.siteName == 'runbet' || this.siteName == 'sports365' || this.siteName == 'lc247' || this.siteName == 'wskyexch' || this.siteName == 'nayaludis' || this.siteName == 'ninewicket') {
  //   this.clientApi.QuitCasino(this.accountInfo.userName, this.accountInfo.userId).subscribe((resp: any) => {
  //     // console.log(resp);
  //     if (resp.errorCode == 0) {

  //     }
  //     setTimeout(() => {
  //       if (!isdata) {
  //         this.FundExpo(null);
  //       }
  //     }, 500);

  //   }, err => {
  //   })
  //   // }

  // }


  FundExpo(isdata) {

    if (this.pingPending) {
      return;
    }
    this.pingPending = true;
    if (isdata) {
      // this.QuitCasino(isdata);
      this.isClicked = this.pingPending;
    }
    // if (!this.router.url.includes('/pokercasino')) {
    //   this.quitPoker();
    // }

    this.clientApi.balance(this.activeEventId).subscribe((resp: any) => {

      if (resp) {
        if (resp.errorCode == 0) {
          this.fundInfo = resp.result[0];

          // if (this.fundInfo.listBets == 1) {
          //   this.listBets();
          // }
        }
      }

      this.pingPending = false;
      this.isClicked = this.pingPending;

    }, err => {
      this.pingPending = false;
      this.isClicked = this.pingPending;

    });
  }

  listAWCLocal() {
    this.casino.getAWCTable().subscribe((resp: any) => {
      this.shareService.shareawcLocalList(resp);
    })

  }

  listAWC() {
    this.casino.awclist().subscribe((resp: any) => {
      this.shareService.shareawcList(resp);
    })

  }

  listBets() {
    if (this.listBetsPending) {
      return;
    }
    this.listBetsPending = true;
    this.clientApi.listBets().subscribe((resp: any) => {
      // console.log(resp);
      if (resp.errorCode == 0) {
        let allbets = this.dfService.matchUnmatchBetsMarketWise(resp.result);
        // console.log(allbets);

        this.shareService.shareListBets(allbets);
      }
      this.listBetsPending = false;
    }, err => {
      this.listBetsPending = false;
    })
  }

  ngOnDestroy(): void {
    if (this.fundInterval) {
      clearInterval(this.fundInterval);
    }
    if (this.lowBalanceInterval) {
      clearInterval(this.lowBalanceInterval);
    }
    if(this.activePlayerTimer){
      clearInterval(this.activePlayerTimer);
    }
  }
}
