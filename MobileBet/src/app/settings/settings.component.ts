import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';
import { DataFormatsService } from '../services/data-formats.service';
import { ShareDataService } from '../services/share-data.service';
import { ToastMessageService } from '../services/toast-message.service';
import { TokenService } from '../services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styles: [
  ]
})
export class SettingsComponent implements OnInit,OnDestroy {

  StakeSettingForm: FormGroup;
  stakeSettingData: any;

  isStakeEdited: boolean = false;
  isToggle: boolean = true;


  BetStakeSubscription: Subscription;
  Update: any;
  isparlay:boolean = false
  isParlay= environment.isParlay 
  accountInfo:any
  parlayOptions:any
  Parlayenable:boolean = false

  constructor(
    private shareService: ShareDataService,
    private settingService: ClientApiService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private toastr: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.GetBetStakeSetting();
    this.getlanguages();
    this.UserDescription()
    this.shareService.parlayvalue$.subscribe(val =>{
      this.isparlay = val
      // console.log( this.isparlay);
    })
    const isparlayStr = localStorage.getItem('parlayenable');

    if (isparlayStr) {
      this.isparlay = JSON.parse(isparlayStr);
      this.shareService.shareparlayvalue(this.isparlay)
    } else {
      this.isparlay = false; // Set a default value if it's not in local storage
      this.shareService.shareparlayvalue(this.isparlay)
    }
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }
  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    this.parlayOptions = this.accountInfo?.parlayOption    
    if(this.parlayOptions == 1){
      this.Parlayenable= true
    }
    else{
      this.Parlayenable= false
    }
    
  }

  initStakeSettingForm(data) {
    this.StakeSettingForm = this.fb.group({
      stake1: [data.stake1, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake2: [data.stake2, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake3: [data.stake3, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake4: [data.stake4, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake5: [data.stake5, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake6: [data.stake6, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake7: [data.stake7, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake8: [data.stake8, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake9: [data.stake9, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake10: [data.stake10, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]]
    })
  }

  get f() {
    return this.StakeSettingForm.controls;
  }

  GetBetStakeSetting() {

    this.BetStakeSubscription = this.shareService.stakeButton$.subscribe((data: any) => {

      if (data != null) {
        this.stakeSettingData = {};
        data.forEach((element, index) => {
          this.stakeSettingData['stake' + (index + 1)] = element;
        });

        // console.log(this.stakeSettingData)

        // this.stakeSettingData.stake1 = 100;
        // this.stakeSettingData.stake2 = 500;
        // this.stakeSettingData.stake3 = 1000;
        // this.stakeSettingData.stake4 = 10000;
        // this.stakeSettingData.stake5 = 20000;
        // this.stakeSettingData.stake6 = 25000;
        // this.stakeSettingData.stake7 = 100;
        // this.stakeSettingData.stake8 = 500;
        // this.stakeSettingData.stake9 = 1000;
        // this.stakeSettingData.stake10 = 10000;
        // this.stakeSettingData.stake11 = 20000;
        // this.stakeSettingData.stake12 = 25000;

        this.initStakeSettingForm(this.stakeSettingData)
      }

    })
  }

  SaveBetStakeSetting() {
    // console.log(this.StakeSettingForm)
    if (!this.StakeSettingForm.valid) {
      return;
    }
    let stakeArray = [];
    for (let i = 1; i <= 10; i++) {
      stakeArray.push(parseInt(this.StakeSettingForm.value['stake' + i]));
    }

    this.settingService.stakeSetting(stakeArray.toString()).subscribe((resp: any) => {

      if (resp.errorCode == 0) {
        let accountInfo = this.tokenService.getUserInfo();
        if (accountInfo.stakeSetting) {
          accountInfo.stakeSetting = stakeArray.toString();
        }
        this.shareService.shareStakeButton(stakeArray);
        this.tokenService.setUserInfo(accountInfo);
        this.toastr.successMsg('Stake value saved');
        this.settingClose();
      } else {
        this.toastr.errorMsg('Something went wrong');
      }

    }, err => {
      //this.toastr.error("Error Occured");
    })
  }


  editStake() {
    $('#stakeSet').css('display', 'none')
    $('#editCustomizeStakeList').css('display', 'flex')
    this.isStakeEdited = true;
  }

  settingClose() {
    $('#editCustomizeStakeList').css('display', 'none')
    $('#stakeSet').css('display', 'flex')
    this.initStakeSettingForm(this.stakeSettingData)
    var s = $("#settingDiv");

    s.fadeOut();
    s.css("display", "none");
    this.isStakeEdited = false;

  }

  enableSparkCheck(){
    this.isToggle=!this.isToggle;
  }
  enableparlay(){
    this.isparlay=!this.isparlay;
    if( this.isparlay){
      localStorage.setItem('parlayenable', JSON.stringify(this.isparlay));
      this.shareService.shareparlayvalue(this.isparlay)
    }
    else{
      localStorage.setItem('parlayenable', JSON.stringify(this.isparlay));
      this.shareService.shareparlayvalue(this.isparlay)
    }
  }


  ngOnDestroy() {
    if (this.BetStakeSubscription) {
      this.BetStakeSubscription.unsubscribe();
    }
  }

}
