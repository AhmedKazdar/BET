import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../services/token.service';
import { WithdrawalDetailsService } from './withdrawaldetails.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-withdrawaldetails',
  templateUrl: './withdrawaldetails.component.html',
  styleUrls: ['./withdrawaldetails.component.scss']
})
export class WithdrawaldetailsComponent implements OnInit {
  currentUser:any;
  noBank:boolean=true;
  noUPI:boolean=true;
  showBankList:boolean=false;
  showUpiList:boolean=false;
  bankList:any=[];
  upiList:any=[];
  Banks:any= [
    "Abhyudaya Co-Operative Bank Ltd",
    "AB Bank Limited",
    "Allahabad Bank",
    "Al-Arafah Islami Bank Limited",
    "Andhra Bank",
    "Agrani Bank Limited",
    "AU Small Finance Bank",
    "Axis Bank",
    "Bandhan Bank",
    "Bank of Bahrain and Kuwait",
    "Bank of Baroda",
    "Bank of India",
    "Bank of Maharashtra",
    "Bank Asia Limited",
    "Bangladesh Commerce Bank Limited",
    "Bangladesh Krishi Bank",
    "BRAC Bank Limited",
    "Canara Bank",
    "Catholic Syrian Bank",
    "Central Bank of India",
    "Citi Bank",
    "City Bank",
    "City Union Bank",
    "Corpation Bank",
    "DBS Bank",
    "DBBL BANK LTD",
    "Dhanlaxmi Bank",
    "Dhaka Bank Limited",
    "Dutch Bangla Bank",
    "Eastern Bank Limited",
    "Equitas Small Finance Bank",
    "Federal Bank",
    "First Security Islami Bank Limited",
    "GP Parsik Bank",
    "HDFC Bank",
    "ICICI Bank",
    "IDBI Bank",
    "IDFC FIRST Bank",
    "Indiabulls",
    "indian Bank",
    "Indian Overseas Bank",
    "Induslnd Bank",
    "ING Vysya Bank",
    "Islami Bank Bangladesh Limited",
    "Jammu and Kashmir Bank",
    "Jamuna Bank Limited",
    "Janata Bank Limited",
    "Karnataka Bank Ltd",
    "Karur Vysya Bank",
    "Kotak Mahindra Bank",
    "Lakshmi Vilas Bank",
    "Mutual Trust Bank Limited",
    "Nainital Bank",
    "Oriental Bank of Commerce",
    "Paytm Payments Bank",
    "Premier Bank Limited",
    "Prime Bank Limited",
    "Punjab & Sind Bank",
    "Punjab National Bank",
    "Pubali Bank Limited",
    "RBL Bank",
    "Shamrao Vitthal Co-Operative Bank",
    "Shivalik small Finance Bank",
    "South Indian Bank",
    "Sonali Bank Limited",
    "Standard Chartered",
    "State Bank of Bikaner & Jaipur",
    "State Bank of Hyderabad",
    "State Bank of India",
    "State Bank of Mysore",
    "State Bank of Patiala",
    "State Bank of Travancore",
    "Shahjalal Islami Bank Limited",
    "Southeast Bank Limited",
    "Syndicate Bank",
    "Tamilnad Mercantile Bank Ltd.",
    "Trust Bank Limited",
    "UCO Bank",
    "Ujjivan Small Finance Bank",
    "Union Bank of India",
    "United Bank of India",
    "United Commercial Bank PLC",
    "Vijaya Bank",
    "Yes Bank",
  ];
  BankForm:FormGroup;
  upiForm:FormGroup;
  editBankForm:FormGroup;
  editUpiForm:FormGroup;
  addBankInTransit:boolean=false;
  addUpiInTransit:boolean=false;
  updateBankInTransit:boolean=false;
  updateUpiInTransit:boolean=false;
  preferredBankInTransit:boolean=false;
  preferredUpiInTransit:boolean=false;
  deleteBankInTransit:boolean=false;
  deleteUpiInTransit:boolean=false;
  Provider:any=['GPay','PhonePe','Paytm','Mobile Banking']
  selectedBankName:string='';
  selectedProvider:string='';
  selectedBankupi:any;
  from:any='';
  constructor(
    private withdrawService:WithdrawalDetailsService, 
    private tokenService:TokenService,
    private fb:FormBuilder, 
    public toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUserInfo();
    this.initForm();
    this.getBankAccountList(this.currentUser.userId);
    this.getUpiList(this.currentUser.userId);
  }

  initForm(){
    this.BankForm = this.fb.group({
      account_holder:['',Validators.required],
      account_number:['',Validators.required],
      bank_name:['',Validators.required],
      ifsc_code:['', [Validators.required]],
      uid:[this.currentUser.userId]
    })
    this.editBankForm = this.fb.group({
      bank_id:['',Validators.required],
      account_holder:['',Validators.required],
      account_number:['',Validators.required],
      bank_name:['',Validators.required],
      ifsc_code:['', [Validators.required]],
    })
    this.upiForm = this.fb.group({
      value:['',Validators.required],
      type:['',Validators.required],
      name:['',Validators.required],
      uid:[this.currentUser.userId]
    })
    this.editUpiForm = this.fb.group({
      upi_id:['',Validators.required],
      value:['',Validators.required],
      name:['',Validators.required],
      type:['',Validators.required]
    })
  }
  
  showOverlayInfo(value) {
    $(value).css('display', 'flex');
  }

  showconfirmation(value,from,bankupi){
    this.from = from;
    this.selectedBankupi = bankupi;
    $(value).css('display', 'flex');
  }

  showBanks(){
    this.showBankList = !this.showBankList;
  }

  showUpis(){
    this.showUpiList = !this.showUpiList;
  }

  showEditBank(value,bankupi){
    this.selectedBankupi = bankupi;
    this.editBankForm.setValue({
      bank_id:this.selectedBankupi.bank_id,
      account_holder:this.selectedBankupi.account_holder,
      account_number:this.selectedBankupi.account_number,
      bank_name:this.selectedBankupi.bank_name,
      ifsc_code:this.selectedBankupi.ifsc_code
    });
    $(value).css('display', 'flex');
  }

  showEditUpi(value,bankupi){
    this.selectedBankupi = bankupi;
    this.editUpiForm.setValue({
      upi_id:this.selectedBankupi.upi_id,
      value:this.selectedBankupi.value,
      name:this.selectedBankupi.name,
      type:this.selectedBankupi.type
    });
    $(value).css('display', 'flex');
  }
  
  hideOverlayInfo(value) {
    this.selectedBankupi = '';
    $(value).fadeOut();
  }

  selectBank(bankName:string){
    this.selectedBankName = bankName;
  }

  selectProvider(providerName:string){
    this.selectedProvider = providerName;
  }
  
  getBankAccountList(uid:any){
    this.withdrawService.getBankAccountsList(uid).subscribe((resp: any) => {
      if (resp.status === 'Success') {
        this.noBank = false;
        if(resp.data){
          this.bankList = resp.data;
        }
        $('#page_loading').css('display', 'none');
      } else {
        this.noBank = true;
        $('#page_loading').css('display', 'none');
      }
    }, err => {
      console.log(err);
    }
    );
  }

  getUpiList(uid:any){
    this.withdrawService.Getupilist(uid).subscribe((resp: any) => {
      if (resp.status === 'Success') {
        this.noUPI = false;
        if(resp.data){
          this.upiList = resp.data;
        }
        $('#page_loading').css('display', 'none');
      } else {
        this.noUPI = true;
        $('#page_loading').css('display', 'none');
      }
    }, err => {
      console.log(err);
    }
    );
  }

  addBank(){
    if(this.addBankInTransit){
      return;
    }
    if(this.BankForm.valid){
      this.addBankInTransit = true;
      $('#page_loading').css('display', 'flex');
      this.withdrawService.addBank(this.BankForm.value).subscribe((resp: any) => {
        if(resp){
          this.addBankInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
            $('#page_loading').css('display', 'none');
            this.hideOverlayInfo('#addBankDialog');
            this.BankFormReset();
            this.getBankAccountList(this.currentUser.userId);
          } else {
            this.toastr.error(resp.message)
            $('#page_loading').css('display', 'none');
          }
        }
      }, err => {
        this.addBankInTransit = false;
        console.log(err);
      }
      );
    }
    else{
      this.toastr.error('Invalid Input')
    }
  
  }

  addUpi(){
    console.log(this.upiForm.value);
    
    if(this.addUpiInTransit){
      return;
    }
    if(this.upiForm.valid){
      this.addUpiInTransit = true;
      $('#page_loading').css('display', 'flex');
      this.withdrawService.addUpi(this.upiForm.value).subscribe((resp: any) => {
        if(resp){
          this.addUpiInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
            $('#page_loading').css('display', 'none');
            this.hideOverlayInfo('#addUpiDialog');
            this.upiFormReset();
            this.getUpiList(this.currentUser.userId);
          } else {
            this.toastr.error(resp.message)
            $('#page_loading').css('display', 'none');
          }
        }
      }, err => {
        this.addUpiInTransit = false;
        console.log(err);
      }
      );
    }
    else{
      this.toastr.error('Invalid Input')
    }
  
  }

  setPreferredBank(){
    $('#page_loading').css('display', 'flex');
    if(this.preferredBankInTransit){
      return
    }
    this.preferredBankInTransit = true;
    let data = {
      "uid":this.currentUser.userId,
      "bank_id":this.selectedBankupi.bank_id,
      "isPreferred":1
    }
    this.withdrawService.setPrefferedBank(data).subscribe((resp: any) => {
      if(resp){
        this.preferredBankInTransit = false;
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
          $('#page_loading').css('display', 'none');
          this.hideOverlayInfo('#confirmation');
          this.getBankAccountList(this.currentUser.userId);
        } else {
          this.toastr.error(resp.message)
          $('#page_loading').css('display', 'none');
        }
      }
    }, err => {
      this.preferredBankInTransit = false;
      console.log(err);
    }
    );
  }

  setPreferredUpi(){
    $('#page_loading').css('display', 'flex');
    if(this.preferredUpiInTransit){
      return
    }
    this.preferredUpiInTransit = true;
    let data = {
      "uid":this.currentUser.userId,
      "upi_id":this.selectedBankupi.upi_id,
      "isPreferred":1
    }
    this.withdrawService.setPrefferedUpi(data).subscribe((resp: any) => {
      if(resp){
        this.preferredUpiInTransit = false;
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
          $('#page_loading').css('display', 'none');
          this.hideOverlayInfo('#confirmation');
          this.getUpiList(this.currentUser.userId);
        } else {
          this.toastr.error(resp.message)
          $('#page_loading').css('display', 'none');
        }
      }
    }, err => {
      this.preferredUpiInTransit = false;
      console.log(err);
    }
    );
  }

  deleteBank(){
    $('#page_loading').css('display', 'flex');
    if(this.deleteBankInTransit){
      return
    }
    this.deleteBankInTransit = true;
    this.withdrawService.deleteBank(this.selectedBankupi.bank_id).subscribe((resp: any) => {
      if(resp){
        this.deleteBankInTransit = false;
        this.hideOverlayInfo('#confirmation');
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
          $('#page_loading').css('display', 'none');
          this.getBankAccountList(this.currentUser.userId);
        } else {
          this.toastr.error(resp.message)
          $('#page_loading').css('display', 'none');
        }
      }
    }, err => {
      this.hideOverlayInfo('#confirmation');
      this.deleteBankInTransit = false;
      console.log(err);
    }
    );
  }

  deleteUpi(){
    $('#page_loading').css('display', 'flex');
    if(this.deleteUpiInTransit){
      return
    }
    this.deleteUpiInTransit = true;
    this.withdrawService.deleteUpi(this.selectedBankupi.upi_id).subscribe((resp: any) => {
      if(resp){
        this.deleteUpiInTransit = false;
        this.hideOverlayInfo('#confirmation');
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
          $('#page_loading').css('display', 'none');
          this.getUpiList(this.currentUser.userId);
        } else {
          this.toastr.error(resp.message)
          $('#page_loading').css('display', 'none');
        }
      }
      }, err => {
        this.hideOverlayInfo('#confirmation');
        this.deleteUpiInTransit = false;
        console.log(err);
      }
    );
  }

  updateBank(){
    if(this.updateBankInTransit){
      return;
    }
    if(this.editBankForm.valid){
      this.updateBankInTransit = true;
      $('#page_loading').css('display', 'flex');
      this.withdrawService.updateBank(this.editBankForm.value).subscribe((resp: any) => {
        if(resp){
          this.updateBankInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
            $('#page_loading').css('display', 'none');
            this.hideOverlayInfo('#editBankDialog');
            this.editBankForm.reset();
            this.getBankAccountList(this.currentUser.userId);
          } else {
            this.toastr.error(resp.message)
            $('#page_loading').css('display', 'none');
          }
        }
      }, err => {
        this.updateBankInTransit = false;
        console.log(err);
      }
      );
    }
    else{
      this.toastr.error('Invalid Input')
    }
  
  }

  updateUpi(){
    console.log(this.upiForm.value);
    
    if(this.updateUpiInTransit){
      return;
    }
    if(this.editUpiForm.valid){
      this.updateUpiInTransit = true;
      $('#page_loading').css('display', 'flex');
      this.withdrawService.updateUpi(this.editUpiForm.value).subscribe((resp: any) => {
        if(resp){
          this.updateUpiInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
            $('#page_loading').css('display', 'none');
            this.hideOverlayInfo('#editUpiDialog');
            this.editUpiForm.reset();
            this.getUpiList(this.currentUser.userId);
          } else {
            this.toastr.error(resp.message)
            $('#page_loading').css('display', 'none');
          }
        }
      }, err => {
        this.updateUpiInTransit = false;
        console.log(err);
      }
      );
    }
    else{
      this.toastr.error('Invalid Input')
    }
  
  }

  BankFormReset(){
    this.BankForm.controls.account_holder.reset();
    this.BankForm.controls.account_number.reset();
    this.BankForm.controls.bank_name.reset();
    this.BankForm.controls.ifsc_code.reset();
  }

  upiFormReset(){
    this.upiForm.controls.value.reset();
    this.upiForm.controls.type.reset();
    this.upiForm.controls.name.reset();
  }

}
