import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { TokenService } from '../services/token.service';
import { DepositWithdrawService } from './depositwithdraw.service';
import {Location} from '@angular/common';
import { ClientApiService } from '../services/client-api.service';
import { ShareDataService } from '../services/share-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-depositwithdraw',
  templateUrl: './depositwithdraw.component.html',
  styleUrls: ['./depositwithdraw.component.css']
})
export class DepositwithdrawComponent implements OnInit {
  siteName = environment.siteName;
  isToggle: boolean = true;
  loader: boolean = false;
  showqrcode: boolean = false;
  showupi: boolean = false;
  showbank: boolean = false;
  listData: boolean = false;
  withdrawInTransit: boolean = false;
  depositInTransit: boolean = false;
  WithdrawForm: FormGroup;
  DepositForm: FormGroup;
  currentUser: any;
  bankList: any = [];
  upiList: any = [];
  qrList: any = [];
  preferredWithdraw: any = [];
  selectedProvider: string = '';
  allPreferredAcc = [];
  imageURL: string;
  userName:string='';
  userId:string='';
  parentId:string='';
  currency:string='';
  balance:any;
  Update: any;
  auto = environment.auto;
  isTrnNo = environment.isTrnNo
  Automanuals = true;
  getwayForm: FormGroup;
  origin = environment.origin;
  password: string;

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private depositWithdrawService: DepositWithdrawService,
    public toastr: ToastrService,
    public _location:Location,
    private clientApi: ClientApiService,
    private shareService: ShareDataService
  ) { 
    
   }

  async ngOnInit(): Promise<void> {
   
    this.isToggle = true;
    this.currentUser = this.tokenService.getUserInfo();
    if(this.currentUser){
      this.userName = this.currentUser.userName;
      this.userId = this.currentUser.userId;
      this.parentId = this.currentUser.parentId;
      this.currency =this.currentUser.currencyCode;
      this.getBalance();
      this.getWithdrawalDetails();
      this.getAdminBankAccount();
      this.getAdminUpiList();
      this.getAdminQrCode();
    }
    this.getlanguages();
    this.initForm();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }

  autoManual(tab: any) {
    console.log(tab)
    if (tab == 0) {
      this.Automanuals = true
    } else {
      this.Automanuals = false
    }
  }

  inrAutoPayment() {
    if (!this.getwayForm.valid) {
      return;
    }
    this.depositWithdrawService.selfAutoPay(this.getwayForm.value).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        window.open(resp.accessURL,'_blank');
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
      payment_method: ['', Validators.required],
      sender: ['admin'],
      reciever: [this.userName],
      password: [],
      coins: ['', Validators.required],
      img: [''],
      domain: [this.origin],
      penalty: ['0'],
       pin: [''],
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


  getBalance(){
    this.clientApi.balance("").subscribe((resp: any) => {
      if (resp) {
        if (resp.errorCode == 0) {
          this.balance = resp.result[0].balance;
        }
      }
    },);
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
    this._location.back();
    $("#dwDiv").css("display","none")
  }

  copytoclip(value:any){
    navigator.clipboard.writeText(value).then(()=> {
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

  getWithdrawalDetails(){
    this.allPreferredAcc = [];
    this.preferredWithdraw = [];
    const $o1 = this.depositWithdrawService.getBankAccountsList(this.userId);
    const $o2 = this.depositWithdrawService.Getupilist(this.userId);
    forkJoin($o1, $o2)
     .subscribe(([bank, upi]) => {
        this.processGraphData(bank,upi);
     })
  }

  processGraphData(bank:any,upi:any){
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

  checkWithdrawalDetails(){
    if(this.preferredWithdraw.length<1){
      this.showOverlayInfo('#addWithdrawDetails');
      this.toastr.error('Please add your withdrawal details first.')
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
  const storedPassword = localStorage.getItem('loginpass'); 
  console.log('Stored Password:', storedPassword);
  this.WithdrawForm.controls.password.setValue(storedPassword);

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
    else if(this.WithdrawForm.controls.coins.value>this.balance){
      this.toastr.error('Insufficient Balance')
    }
    else {
      this.withdrawInTransit = true;
      $('#dw_loading').css('display', 'flex');
      this.depositWithdrawService.doPenaltyTransactionrequest(this.WithdrawForm.value).subscribe((resp: any) => {
        if (resp) {
          this.withdrawInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
            $('#dw_loading').css('display', 'none');
            this.withdrawFormReset();
            this.getBalance();
            setTimeout(()=>{                        
              this.dwClose();
            }, 1000);
          } else {
            this.toastr.error(resp.message)
            $('#dw_loading').css('display', 'none');
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
    else if (this.showupi) {
      this.DepositForm.controls.payment_method.setValue('UPI');
      this.DepositForm.controls.paid_to.setValue(this.upiList[0].value);
    }else if (this.showqrcode) {
      this.DepositForm.controls.payment_method.setValue('QR');
      this.DepositForm.controls.paid_to.setValue(this.qrList[0].display_name);
    }
    if (this.DepositForm.invalid) {
      this.toastr.error('Invalid Input')
    }
    else {
      this.depositInTransit = true;
      $('#dw_loading').css('display', 'flex');
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
      formData.append('img', this.DepositForm.value.img)
      formData.append('trn_no', this.DepositForm.value.trn_no)
      formData.append('paid_to', this.DepositForm.value.paid_to)
      formData.append('username', this.userName)
      this.depositWithdrawService.doTransactionrequest(formData).subscribe((resp: any) => {
        if (resp) {
          this.depositInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
            this.imageURL = '';
            $('#dw_loading').css('display', 'none');
            this.depositFormReset();
            this.getBalance();
            setTimeout(()=>{                        
              this.dwClose();
            }, 1000);
          } else {
            this.toastr.error(resp.message)
            $('#dw_loading').css('display', 'none');
          }
        }
      }, err => {
        this.depositInTransit = false;
        console.log(err);
      }
      );
    }
  }

  changeType(tab:any) {
    if(tab==0){
      this.isToggle=true
    }else{
      this.isToggle=false
      this.checkWithdrawalDetails();
    }
   this.depositFormReset();
   this.withdrawFormReset();
   this.listData = false;
   this.showqrcode = false;
   this.showupi = false;
   this.showbank = false;
  }

  showdata(text: any) {
    if (text != '' && text > 0) {
      this.listData = true;
    } else {
      this.listData = false;
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

  withdrawFormReset(){
    this.WithdrawForm.controls.payment_method.reset();
    this.WithdrawForm.controls.coins.reset();
    // this.WithdrawForm.controls.paid_to.reset();
  }

  depositFormReset(){
    this.DepositForm.controls.payment_method.reset();
    this.DepositForm.controls.coins.reset();
    this.DepositForm.controls.img.reset();
    this.DepositForm.controls.paid_to.setValue('');
  }

}
