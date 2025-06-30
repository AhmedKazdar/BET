import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientApiService } from 'src/app/services/client-api.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-setting-pop',
  templateUrl: './setting-pop.component.html',
  styleUrls: ['./setting-pop.component.scss']
})
export class SettingPopComponent implements OnInit {


  StakeSettingForm: FormGroup;
  stakeSettingData: any;

  isStakeEdited: boolean = false;
  isToggle: boolean = true;


  BetStakeSubscription: Subscription;

  constructor(
    private shareService: ShareDataService,
    private settingService: ClientApiService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private toastr: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.GetBetStakeSetting();
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
      stake10: [data.stake10, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake11: [data.stake11, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      stake12: [data.stake12, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]]
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
    for (let i = 1; i <= 12; i++) {
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
    $('#editCustomizeStakeList').css('display', 'block')
    this.isStakeEdited = true;
  }
  editStakeClosed() {
    $('#editCustomizeStakeList').css('display', 'none')
    $('#stakeSet').css('display', 'block')
    this.isStakeEdited = false;
  }

  settingClose() {
    $('#editCustomizeStakeList').css('display', 'none')
    $('#stakeSet').css('display', 'block')
    this.initStakeSettingForm(this.stakeSettingData)
    var s = $("#set_pop");

    // s.fadeOut();
    s.css("display", "none");
    this.isStakeEdited = false;

  }


  ngOnDestroy() {
    if (this.BetStakeSubscription) {
      this.BetStakeSubscription.unsubscribe();
    }
  }

}
