import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { CasinoApiService } from 'src/app/services/casino-api.service';
import { ClientApiService } from 'src/app/services/client-api.service';
import { DataFormatsService } from 'src/app/services/data-formats.service';
import { LoginService } from 'src/app/services/login.service';
import { MainService } from 'src/app/services/main.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';
import { DepositWithdrawService } from '../../services/depositwithdraw.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  accountInfo: any;
  fundInfo: any;
  isTraslate: boolean = environment.isTraslate;
  isBlueOcean = environment.isBlueOcean;

  siteName: string = environment.siteName;
  isEtgcasino: boolean = environment.isEtgcasino;
  isb2c: boolean = environment.isb2c;
  isCasinoTab: boolean = environment.isCasinoTab;
  isExchangeGames: boolean = environment.isExchangeGames;
  ishorseRace: boolean = environment.ishorseRace;
  intervalId: any;
  auto = environment.auto;
  Automanuals = true;
  fundExpoPending: boolean = false;
  activeEventId: any;
  isLogin: boolean = false;
  clickevent: any;

  sportList: any = [];
  currency: any;
  isToggle: boolean = true;
  loader: boolean = false;
  showqrcode: boolean = false;
  showupi: boolean = false;
  showbank: boolean = false;
  listdata: boolean = false;
  withdrawInTransit: boolean = false;
  depositInTransit: boolean = false;
  WithdrawForm: FormGroup;
  DepositForm: FormGroup;
  getwayForm: FormGroup;
  currentUser: any;
  bankList: any = [];
  upiList: any = [];
  qrList: any = [];
  preferredWithdraw: any = [];
  selectedProvider: string = '';
  allPreferredAcc = [];
  imageURL: string;
  userName: string = '';
  userId: string = '';
  parentId: string = '';
  OneClickBet: any = {
    isConfirmOneClickBet: false,
    isOneClickBet: false,
    oneClickBetStakeIndex: 0
  }
  public langx:any;


  pingPending: boolean = false;
  isClicked: boolean = true;
  listBetsPending: boolean = false;
  fundInterval;
  lowBalanceInterval;
  isAuthPending: boolean = false;
  isTrnNo = environment.isTrnNo

  sportSubscription!: Subscription;
  private routeSubscription: Subscription = new Subscription();
  eventBetsSubscription!: Subscription;
  mainInterval;
  cricbuzzerheader: boolean = true;
  selectedlanguage: string = '';
  language: any;
  range = "en";
  GameStatus:any
  Alllanguage: any;
  Update: any;
  currentlanguage: string;
  selectedlang: any;
  isaura: boolean = false;
  winnerMarket: any;

  constructor(
    private tokenService: TokenService,
    private main: MainService,
    private clientApi: ClientApiService,
    private dfService: DataFormatsService,
    private shareService: ShareDataService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private depositWithdrawService: DepositWithdrawService,
    public toastr: ToastrService,
    private casinoapiService: CasinoApiService,
    
  ) {
    // Get the current URL
    const currentUrl = window.location.href;
    
    // Check if we're using hash-based routing
    if (currentUrl.includes('#/')) {
      const parts = currentUrl.split('#/');
      if (parts.length > 1) {
        // Get the first part after #/ and split by / to get the language
        const pathParts = parts[1].split('/');
        this.langx = pathParts[0];
      }
    } else {
      // Fallback to path-based routing
      const pathParts = window.location.pathname.split('/').filter(part => part);
      this.langx = pathParts[0] || 'en';
    }
    
    // Map language codes - 'pg' should be treated as 'pt' for Portuguese
    const languageMap: {[key: string]: string} = {
      'pg': 'pg',  // Map 'pg' to 'pt' for Portuguese
      'en': 'en',
      'es': 'es',
      'tu': 'tu',
      'bd': 'bd',
    };
    
    // Get the mapped language or default to 'en'
    this.langx = languageMap[this.langx] || 'en';
    
    console.log("Detected language:", this.langx);
    
    // Set the language
    if (this.tokenService.getLanguage()) {
      this.selectedlang = this.tokenService.getLanguage();
      this.selectlanguage(this.langx);
    } else {
      this.selectlanguage(this.langx);
    }
    this.listAWCLocal();
    
    // Listen for route changes
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLanguageFromUrl();
    });
    
    this.shareService.getgameStatus$.subscribe((resp) => {
      this.GameStatus = resp
    })

    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
    this.mainInterval = setInterval(() => {
      let maintain = this.tokenService.getMaintanance()
      if (maintain == '1') {
        this.router.navigate(['maintenance']);
      }
    }, 1000)
    if (this.isLogin) {
      this.shareService.activeMatch.subscribe(data => {
        this.activeEventId = data;
      })

      if (!this.dfService.getOneClickSetting()) {
        this.dfService.saveOneClickSetting(this.OneClickBet);
      } else {
        this.OneClickBet = JSON.parse(this.dfService.getOneClickSetting());
      }
      this.main.apis$.subscribe((res) => {
        // this.myMarketMatch();
        this.UserDescription();
        // this.QuitCasino(null);
        this.FundExpo(null);
        this.listAWC();

        this.listBets();
        this.sportWise();
        this.shareService.updateFundExpo$.subscribe(data => {
          if (data == 'event') {
            this.FundExpo('refresh');
            this.listBets();
          } else if (data) {
            this.fundInfo = data[3][0];
            let allbets = this.dfService.matchUnmatchBetsMarketWise(data[2]);
            this.shareService.shareListBets(allbets);
          }
          // this.FundExpo('refresh');
          // this.listBets();
        })
      });

      this.fundInterval = setInterval(() => {
        this.FundExpo(null);
      }, 60000)
    } else {
      this.sportWise();
    }
    if (this.router.url == '/dash') {
      this.cricbuzzerheader = false;
    } else {
      this.cricbuzzerheader = true;
    }
    this.router.events.subscribe((event: NavigationStart) => {
      if (event instanceof NavigationStart) {
        // console.log(event.url)

        if (event.url == '/dash') {
          this.cricbuzzerheader = false;
        }
        else {
          this.cricbuzzerheader = true;
        }
      }
    })

  }

  // Extract and update language from URL
  private updateLanguageFromUrl() {
    const currentUrl = window.location.href;
    
    // Check if we're using hash-based routing
    if (currentUrl.includes('#/')) {
      const parts = currentUrl.split('#/');
      if (parts.length > 1) {
        const pathParts = parts[1].split('/');
        this.langx = pathParts[0];
      }
    } else {
      const pathParts = window.location.pathname.split('/').filter(part => part);
      this.langx = pathParts[0] || 'en';
    }
    
    const languageMap: {[key: string]: string} = {
      'pg': 'pg',
      'en': 'en',
      'es': 'es',
      'tu': 'tu',
      'bd': 'bd',
    };
    
    this.langx = languageMap[this.langx] || 'en';
    
    console.log("Updated language from URL:", this.langx);
    
    if (this.tokenService.getLanguage()) {
      this.selectedlang = this.tokenService.getLanguage();
      this.selectlanguage(this.langx);
    } else {
      this.selectlanguage(this.langx);
    }
  }

  ngOnInit(): void {
    this.getlanguages()
    if (this.isLogin) {
      if (this.tokenService.getNewUser() == null) {
        if (this.isb2c) {
          this.openagePop();
        }
      } else {
        this.closeagePop();
      }

      setTimeout(() => {
        if (this.accountInfo?.currencyCode == "INR") {
          this.isaura = true
          if (this.fundInfo?.balance < 100 && this.fundInfo?.exposure == 0) {
            if (this.isb2c) {
              this.lowBalancePop();
            }
          }
        }
      }, 1000);

      this.lowBalanceInterval = setInterval(() => {
        if (this.accountInfo?.currencyCode == "INR") {
          if (this.fundInfo?.balance < 100 && this.fundInfo?.exposure == 0) {
            if (this.isb2c) {
              this.lowBalancePop();
            }
          }
        }
      }, 300000)

    }
    this.isToggle = true;
    this.currentUser = this.tokenService.getUserInfo();
    if (this.currentUser) {
      this.userName = this.currentUser.userName;
      this.userId = this.currentUser.userId;
      this.currency = this.currentUser.currencyCode;
      this.parentId = this.currentUser.parentId;
    }
    this.initForm();
  }


  changeExpo(clickevent) {
    this.clickevent = clickevent;
    if (this.clickevent == 'diamond') {
      window.location.href = "diamondWeb";
    } else if (this.clickevent == 'lotus') {
      window.location.href = "lotusWeb";
    }
    else if (this.clickevent == 'lc') {
      window.location.href = "Lcexch";
    } else if (this.clickevent == 'sky') {
      window.location.href = "/";
    }
  }


  ngAfterViewInit() {

    // $(document).on('click', function (e) {
    //   $("#account_pop").hide();
    //   e.stopPropagation()
    // });
  }

  accountPopup() {
    $("#account_pop").toggle();
  }

  onClickedOutside(e: Event, data: any) {
    // console.log('Clicked outside:', e);
    $("#account_pop").css('display', 'none');

  }

  openSlipSet() {
    if (this.isLogin) {
      $("#set_pop").toggle();
    } else {
    }
  }

  onOneClickOutsideSet(e: Event, data: any) {
    // console.log('Clicked outside:', e);
    $("#set_pop").css('display', 'none');

  }
  closeLoginApi() {
    $('#loginToGoApi').fadeOut();;
  }


  openOneClickSet() {
    if (this.isLogin) {
      if (!this.OneClickBet.isConfirmOneClickBet) {
        $('#oneClickBetOverlay').css('display', 'block');
        $('#oneClickBetDialog').css('display', 'block');
        $('#oneClickBetStakeBox').css('display', 'block');
        this.OneClickBet.isConfirmOneClickBet = true;
        this.OneClickBet.isOneClickBet = true;
      } else if (this.OneClickBet.isConfirmOneClickBet && !this.OneClickBet.isOneClickBet) {
        $('#oneClickBetStakeBox').css('display', 'block');
        this.OneClickBet.isOneClickBet = true;
      } else if (this.OneClickBet.isOneClickBet) {
        $('#oneClickBetStakeBox').css('display', 'none');
        this.OneClickBet.isOneClickBet = false;
      }
      this.dfService.saveOneClickSetting(this.OneClickBet);
    } else {
    }
  }



  opendepositepopup() {
    $("#depositeBox").fadeIn();
    this.getWithdrawalDetails();
    this.getAdminBankAccount();
    this.getAdminUpiList();
    this.getAdminQrCode();
    console.log('click')
  }
  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();

    // console.log(this.accountInfo)
  }
  // QuitCasino(isdata) {

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

  FundExpo(isdata: any) {

    if (this.pingPending) {
      return;
    }
    this.pingPending = true;
    if (isdata) {
      // this.QuitCasino(isdata);

      this.isClicked = this.pingPending;
    }

    this.clientApi.balance(this.activeEventId).subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        // if (this.fundInfo) {
        //   if (this.fundInfo.balance != resp.result[0].balance) {
        //     this.listBets();
        //   }
        // }
        this.fundInfo = resp.result[0];

      }
      this.pingPending = false;
      this.isClicked = this.pingPending;

    }, err => {
      this.pingPending = false;
      this.isClicked = this.pingPending;

    });
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

  closeagePop() {
    $("#ageDialog").fadeOut();
    this.tokenService.setNewUser(1);
  }

  openagePop() {
    $("#ageDialog").fadeIn();
  }

  lowBalancePop() {
    $("#lowBalance").fadeIn();
  }

  closeLowBalance() {
    $("#lowBalance").fadeOut();
  }

  gotoDeposit() {
    this.closeLowBalance();
    this.opendepositepopup();
  }

  sportWise() {
    this.sportSubscription = this.shareService.sportData$.subscribe(data => {
      if (data != null) {
        let winnerMarketdata = [];
        this.sportList = this.dfService.sportEventWise(data, 0);
        this.sportList.forEach(element => {
          element.matches.forEach(match => {
            if (match.isWinner) {
              winnerMarketdata.push(match);
            }
          });
        });
        this.winnerMarket = winnerMarketdata;
        // console.log(this.winnerMarket);
      }
    });
  }


  trackBySport(index: number, item: any) {
    return item.eventTypeId;
  }

  Logout() {

    this.loginService.logout().subscribe((resp: any) => {
      if (resp.errorCode == 0) {
        this.tokenService.removeToken();
      }
    }, err => {
      this.tokenService.removeToken();
    })
  }

  ngOnDestroy(): void {
    if (this.fundInterval) {
      clearInterval(this.fundInterval);
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.lowBalanceInterval) {
      clearInterval(this.lowBalanceInterval);
    }
  }
  awc_login_direct(prod_code, prod_type, prod_name, game_code) {
    if (!this.isLogin) {
      return;
    }
    if (!prod_code || !prod_type) {

      return;
    }

    if (this.isAuthPending) {
      return;
    }
    this.isAuthPending = true;

    // setTimeout(() => {
    this.clientApi.getAuthCasino(this.accountInfo.userName, this.accountInfo.userId, prod_code, prod_type).subscribe((resp: any) => {
      //   resp={
      //     "errorCode": 0,
      //     "errorDescription": null,
      //     "memberName": "vrnlnew100",
      //     "balance": 200.00,
      //     "prod_code": 146,
      //     "prod_type": 5,
      //     "url": "\"https://inter-gaming.com/server_selection/en/vrnlnew100/VI4FiqD928pikUe9gyCycq7h1qFlaN\""
      // }



      if (resp.errorCode == 0 && resp.url) {
        // window.open(JSON.parse(resp.url), '_blank');
        window.open(JSON.parse(resp.url), "_self");


      } else {
        alert(resp.errorDescription);
      }
      this.isAuthPending = false;

    }, err => {
      this.isAuthPending = false;

    })
    // },1500);
  }

  openLoginPop() {
    $("#loginBox").fadeIn();
  }
  initForm() {
    this.DepositForm = this.fb.group({
      status: ['0'],
      trn_desc: ['Deposit'],
      trn_type: ['1'],
      payment_method: ['', Validators.required],
      sender: ['admin'],
      reciever: [this.userName],
      coins: ['', Validators.required],
      paid_to: ['', Validators.required],
      trn_no:[''],
      username: [this.userName],
      img:['']
    })
    this.WithdrawForm = this.fb.group({
      status: ['0'],
      trn_desc: ['Withdraw'],
      trn_type: ['2'],
      payment_method: ['', Validators.required],
      sender: ['admin'],
      reciever: [this.userName],
      coins: ['', Validators.required],
      img: [''],
      uid: [this.userId],
      parentId: [this.parentId],
      paid_to: ['', Validators.required],
      username: [this.userName]
    })
    this.getwayForm = this.fb.group({
      userName: [this.userName],
      userId: [this.userId],
      parentId: [this.parentId],
      amount: ['', Validators.required],
      currencyCode: [this.currency]
    })
  }

  get f() {
    return this.getwayForm.controls;
  }

  showPreview(event: any) {
    if (event.target.files.length > 0) {
      const file = (event.target as HTMLInputElement).files[0];
      this.DepositForm.patchValue({
        img: file
      });
      this.DepositForm.get('img').updateValueAndValidity()
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
    else {
      this.DepositForm.patchValue({
        img: null
      });
      this.imageURL = ''
    }
  }

  dwClose() {
    $("#depositeBox").fadeOut();
    this.paymentFormReset();
    this.withdrawFormReset();
    this.depositFormReset();
    this.listdata = false;
    this.showqrcode = false;
    this.showupi = false;
    this.showbank = false;
    
    
    
  }


  copytoclip(value: any) {
    navigator.clipboard.writeText(value).then(() => {
      this.toastr.success('Copied to clipboard.')
    }
    )
  }

  getAdminBankAccount() {
    this.depositWithdrawService.getAdminBankAccounts(this.parentId).subscribe((resp: any) => {
      if (resp.status === 'Success') {
        if (resp.data) {
          this.bankList = resp.data;
        }
      }
    }, err => {
      console.log(err);
    }
    );
  }

  getAdminUpiList() {
    this.depositWithdrawService.GetAdminUpilist(this.parentId).subscribe((resp: any) => {
      if (resp.status === 'Success') {
        if (resp.data) {
          this.upiList = resp.data;
        }
      }
    }, err => {
      console.log(err);
    }
    );
  }

  getAdminQrCode() {
    this.depositWithdrawService.GetAdminQrCode(this.parentId).subscribe((resp: any) => {
      if (resp.status === 'Success') {
        if (resp.data) {
          this.qrList = resp.data;
        }
      }
    }, err => {
      console.log(err);
    }
    );
  }

  selectProvider(providerName: string) {
    this.selectedProvider = providerName;
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      if (this.Update?.myaccount == "আমার অ্যাকাউন্ট") {
        $("#accountPopup").css('font-size', '9px');
      } else {
        $("#accountPopup").css('font-size', 'inherit');
      }
      // console.log(this.Update);

    })
  }
  selectlanguage(newValue) {
    this.getLanguage();
    this.range = newValue;
    if (this.siteName == "cricbuzzer" || this.siteName == "cricbuzzerlive"  ) {
      if (this.range == "sp") {
        // this.siteName = "cricbuzzer"

        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('spanish');
        bodytag.classList.remove('portuguese');
        bodytag.classList.remove('turkish');
      }
      else if (this.range == "pg") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('portuguese');
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('turkish');
      }
      else if (this.range == "tu") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('turkish');
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('portuguese');

      }
      else {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add(this.siteName);
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('portuguese');
        bodytag.classList.remove('turkish');
      }
    }
    this.tokenService.setLanguage(this.range);
    
  }
  getLanguage() {
    let L = []
    this.clientApi.getlanguage().subscribe((resp: any) => {
      this.language = resp
      this.language.forEach(data => {
        if (data.lang == this.range) {
          L.push(data)
        }
        this.Alllanguage = L
        
        this.shareService.sharelanguage(this.Alllanguage[0]);
      })
    })
  }
  getWithdrawalDetails() {
    this.allPreferredAcc = [];
    this.preferredWithdraw = [];
    const $o1 = this.depositWithdrawService.getBankAccountsList(this.userId);
    const $o2 = this.depositWithdrawService.Getupilist(this.userId);
    forkJoin($o1, $o2)
      .subscribe(([bank, upi]) => {
        this.processGraphData(bank, upi);
      })
  }

  processGraphData(bank: any, upi: any) {
    if (bank.status === 'Success') {
      if (bank.data) {
        bank.data.forEach(element => {
          if (element.isPreferred == 1) {
            this.allPreferredAcc.push(element);
            this.preferredWithdraw.push(element.account_number);
          }
        });
      }
    }
    if (upi.status === 'Success') {
      if (upi.data) {
        upi.data.forEach(element => {
          if (element.isPreferred == 1) {
            this.allPreferredAcc.push(element);
            this.preferredWithdraw.push(element.value);
          }
        });
      }
    }
  }

  listAWCLocal() {
    this.clientApi.getAWCTable().subscribe((resp: any) => {
      this.shareService.shareawcLocalList(resp);
    })

  }

  listAWC() {
    this.casinoapiService.awclist().subscribe((resp: any) => {
      this.shareService.shareawcList(resp);
    })

  }

  checkWithdrawalDetails() {
    if (!this.isToggle) {
      if (this.preferredWithdraw.length < 1) {
        this.showOverlayInfo('#addWithdrawDetails');
        this.toastr.error('Please add your withdrawal details first.')
        window.open('myAccount/#/bank_details', '_blank')
      }
    }
    else {
      this.isToggle = true;
    }
  }

  showOverlayInfo(value) {
    $(value).css('display', 'flex');
  }

  hideOverlayInfo(value) {
    $(value).fadeOut();
  }

  doWithdraw() {
    if (this.withdrawInTransit) {
      return;
    }
    this.allPreferredAcc.forEach(element => {
      if (element.account_number) {
        if (element.account_number == this.WithdrawForm.controls.paid_to.value || element.value == this.WithdrawForm.controls.paid_to.value) {
          this.WithdrawForm.controls.payment_method.setValue('Bank');
        }
      }
      if (element.value) {
        if (element.value == this.WithdrawForm.controls.paid_to.value) {
          this.WithdrawForm.controls.payment_method.setValue('UPI');
        }
      }
    })
    if (this.WithdrawForm.invalid) {
      this.toastr.error('Invalid Input')
    }
    else if (this.WithdrawForm.controls.coins.value > this.fundInfo?.balance) {
      this.toastr.error('Insufficient Balance');
    }
    else {
      this.withdrawInTransit = true;
      $('#login_loading').css('display', 'flex');
      this.depositWithdrawService.doTransactionrequest(this.WithdrawForm.value, this.siteName).subscribe((resp: any) => {
        if (resp) {
          this.withdrawInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
            $('#login_loading').css('display', 'none');
            this.withdrawFormReset();
            setTimeout(() => {
              this.dwClose();
            }, 1000);
          } else {
            this.toastr.error(resp.message)
            $('#login_loading').css('display', 'none');
          }
        }
      }, err => {
        this.withdrawInTransit = false;
        console.log(err);
      }
      );
    }
  }

  doDeposit() {
    if (this.depositInTransit) {
      return;
    }
    if (this.showbank) {
      this.DepositForm.controls.payment_method.setValue('Bank');
      this.DepositForm.controls.paid_to.setValue(this.bankList[0].account_number);
    }
    if (this.showupi) {
      this.DepositForm.controls.payment_method.setValue('UPI');
      this.DepositForm.controls.paid_to.setValue(this.upiList[0].value);
    }
    if (this.DepositForm.invalid) {
      this.toastr.error('Invalid Input')
    }
    else {
      this.depositInTransit = true;
      $('#login_loading').css('display', 'flex');
      let formData = new FormData();
      formData.append('status', '0');
      formData.append('trn_desc', 'Deposit')
      formData.append('uid', this.userId)
      formData.append('parentId', this.parentId)
      formData.append('trn_type', '1')
      formData.append('payment_method', this.DepositForm.value.payment_method)
      formData.append('sender', 'admin')
      formData.append('reciever', this.userName)
      formData.append('coins', this.DepositForm.value.coins)
      formData.append('trn_no', this.DepositForm.value.trn_no)
      formData.append('img', this.DepositForm.value.img)
      formData.append('paid_to', this.DepositForm.value.paid_to)
      formData.append('username', this.userName)
      this.depositWithdrawService.doTransactionrequest(formData, this.siteName).subscribe((resp: any) => {
        if (resp) {
          this.depositInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
            this.imageURL = '';
            $('#login_loading').css('display', 'none');
            this.depositFormReset();
            setTimeout(() => {
              this.dwClose();
            }, 1000);
          } else {
            this.toastr.error(resp.message)
            $('#login_loading').css('display', 'none');
          }
        }
      }, err => {
        this.depositInTransit = false;
        console.log(err);
      }
      );
    }
  }

  changeType(tab: any) {
    if (tab == 0) {
      this.isToggle = true
    } else {
      this.isToggle = false
      this.checkWithdrawalDetails();
    }
    this.depositFormReset();
    this.withdrawFormReset();
    this.listdata = false;
    this.showqrcode = false;
    this.showupi = false;
    this.showbank = false;
  }

  autoManual(tab: any) {
    console.log(tab)
    if (tab == 0) {
      this.Automanuals = true
    } else {
      this.Automanuals = false
    }
  }

  paymentGetway() {
    if (!this.getwayForm.valid) {
      return;
    }
    this.depositWithdrawService.Dopaymentgetway(this.getwayForm.value).subscribe((resp: any) => {
      if (resp.status == 0 || resp.Url) {
        window.open(resp.Url), "_self";
        this.paymentFormReset();
        setTimeout(() => {
          this.dwClose();
        }, 1000);
      } else {
        this.dwClose()
        this.toastr.error(resp.status.message)
      }
    })
  }

  inrAutoPayment() {
    if (!this.getwayForm.valid) {
      return;
    }
    this.depositWithdrawService.selfAutoPay(this.getwayForm.value).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        window.open(resp.accessURL, "mozillaWindow", "popup");
        this.paymentFormReset();
        setTimeout(() => {
          this.dwClose();
        }, 1000);
      } else {
        this.dwClose()
        this.toastr.error(resp.message)
      }
    })
  }

  paymentFormReset() {
    this.getwayForm.controls.amount.reset();
  }

  showdata(text: any) {
    if (text != '' && text > 0) {
      this.listdata = true;
    } else {
      this.listdata = false;
      this.showqrcode = false;
      this.showupi = false;
      this.showbank = false;
    }
  }

  boxvalue1() {
    this.showqrcode = true;
    this.showupi = false;
    this.showbank = false;
  }

  boxvalue2() {
    this.showqrcode = false;
    this.showupi = true;
    this.showbank = false;
  }

  boxvalue3() {
    this.showqrcode = false;
    this.showupi = false;
    this.showbank = true;
  }

  withdrawFormReset() {
    this.WithdrawForm.controls.payment_method.reset();
    this.WithdrawForm.controls.coins.reset();
    // this.WithdrawForm.controls.paid_to.reset();
  }
  showalertmsg(gameStatus) {
    if (gameStatus.blocked) {
      alert('This Casino is blocked by upper level.');
      
    }
  }

  depositFormReset() {
    this.DepositForm.controls.payment_method.reset();
    this.DepositForm.controls.coins.reset();
    this.DepositForm.controls.img.reset();
    this.DepositForm.controls.paid_to.setValue('');
  }

}
