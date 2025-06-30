import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { TokenService } from '../../services/token.service';
import { MustMatch } from '../../helpers/must-match.validator';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  ChangePwdForm: FormGroup;
  Update: any;

  constructor(
    private loginServie: LoginService,
    private tokenService:TokenService,
    private toastr: ToastMessageService,
    private fb: FormBuilder,
    private shareService: ShareDataService
  ) { }

  ngOnInit() {
    this.initChangePwdForm();
    this.getlanguages();
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

    })
  }

  initChangePwdForm() {
    this.ChangePwdForm = this.fb.group({
      pwd: ['', Validators.required],
      newpwd: ['', [Validators.required, Validators.minLength(5)]],
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
    if (!this.ChangePwdForm.valid) {
      return;
    }

    this.loginServie.changePassword(this.ChangePwdForm.value).subscribe((resp:any) => {

      if (resp.errorCode == 0) {
        this.toastr.successMsg("Password updated successfull");

        // this.toastr.successMsg(resp.errorDescription);
        this.hideDialog();
        this.resetFrom();
        // this.tokenService.removeToken();
      }
      else {
        this.toastr.errorMsg(resp.errorDescription);
      }
    })
  }

  resetFrom() {
    // this.ChangePwdForm.reset();
    this.initChangePwdForm();
  }
  hideDialog(){
    $('#changePasswordModal').css('display','none');
  }
}

