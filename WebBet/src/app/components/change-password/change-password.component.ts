import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { PasswordStrengthValidator } from 'src/app/helpers/password-strength.validators';
import { LoginService } from 'src/app/services/login.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {


  ChangePwdForm: FormGroup;
  submitted: boolean = false;
  isLogin: boolean = false;
  isChangePassword: boolean = false;

  siteName: string = environment.siteName;
  AferLoginChangePassword:boolean = environment.AferLoginChangePassword;


  result: any
  getProfileInterval;

  constructor(
    private loginServie: LoginService,
    private tokenService: TokenService,
    private toastr: ToastMessageService,

    private fb: FormBuilder,
  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }

  ngOnInit() {
    this.initChangePwdForm();
    this.getProfile();
    this.getProfileInterval = setInterval(() => {
      this.getProfile();
    }, 1000)

  }

  getProfile() {
    if (!this.isLogin) {
      return;
    }
    let accountInfo = this.tokenService.getUserInfo();
    if (accountInfo) {
      if (accountInfo.newUser == 1 && this.AferLoginChangePassword) {
        $("#changePassBox").fadeIn();
      }
    }
  }

  initChangePwdForm() {
    this.ChangePwdForm = this.fb.group({
      pwd: ['', Validators.required],
      newpwd: ['', [Validators.required, PasswordStrengthValidator]],
      retypepwd: ['', Validators.required],
      context: ['Web']
    }, {
      validator: MustMatch('newpwd', 'retypepwd')
    })

  }

  get f() {
    return this.ChangePwdForm.controls;
  }

  get pwd() { return this.ChangePwdForm.get('pwd') };
  get newpwd() { return this.ChangePwdForm.get('newpwd') };
  get retypepwd() { return this.ChangePwdForm.get('retypepwd') };


  ChangePwd() {
    // console.log(this.ChangePwdForm)
    this.submitted = true;

    if (!this.ChangePwdForm.valid) {
      return;
    }

    if (this.isChangePassword) {
      return;
    }
    this.isChangePassword = true;

    this.loginServie.changePassword(this.ChangePwdForm.value).subscribe((resp: any) => {

      if (resp.errorCode == 0) {
        this.toastr.successMsg("Password updated successfull");
        this.result = "Password updated successfull";

        // this.toastr.successMsg(resp.errorDescription);
        this.resetFrom();
        // this.tokenService.removeToken();
        this.submitted = false;

        let accountInfo = this.tokenService.getUserInfo();
        if (accountInfo &&  this.siteName != 'betswiz' &&  this.siteName != 'skyexchM' &&  this.siteName != 'bdbuzz365' &&  this.siteName != 'runexchange' &&  this.siteName != 'lcexch') {
          accountInfo.newUser = 0;
          $("#changePassBox").fadeOut();
          this.tokenService.setUserInfo(accountInfo);
        }
        this.isChangePassword = false;
      }
      else {
        this.toastr.errorMsg(resp.errorDescription);
        this.result = resp.errorDescription;
        this.submitted = false;
        this.isChangePassword = false;
      }
    })
  }

  resetFrom() {
    // this.ChangePwdForm.reset();
    this.initChangePwdForm();
  }

  ngOnDestroy(): void {
    if (this.getProfileInterval) {
      clearInterval(this.getProfileInterval);
    }
  }
}