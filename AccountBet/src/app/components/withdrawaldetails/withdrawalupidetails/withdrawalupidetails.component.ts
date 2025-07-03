import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { TokenService } from 'src/app/services/token.service';
import { WithdrawalDetailsService } from 'src/app/services/withdrawaldetails.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-withdrawalupidetails',
  templateUrl: './withdrawalupidetails.component.html',
  styleUrls: ['./withdrawalupidetails.component.scss']
})
export class WithdrawalupidetailsComponent implements OnInit {

  loader: boolean = false;
  currentUser:any;
  noUPI:boolean=true;
  showUpiList:boolean=false;
  upiList:any=[];
  upiForm:FormGroup;
  editUpiForm:FormGroup;
  addUpiInTransit:boolean=false;
  updateUpiInTransit:boolean=false;
  preferredUpiInTransit:boolean=false;
  deleteUpiInTransit:boolean=false;
  Provider:any=['GPay','PhonePe','Paytm','Mobile Banking']
  selectedBankName:string='';
  selectedProvider:string='';
  selectedBankupi:any;
  from:any='';
  Update: any;
  constructor(
    private withdrawService:WithdrawalDetailsService,
    private tokenService:TokenService,
    private fb:FormBuilder,
    public toastr: ToastMessageService,
    private shareService: ShareDataService
    ) { }

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUserInfo();
    this.initForm();
    this.getUpiList(this.currentUser.userId);
    this.getlanguages();
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      if(this.Update?.myaccount=="আমার অ্যাকাউন্ট"){
        $("#accountPopup").css('font-size', '9px');
      }else{
        $("#accountPopup").css('font-size', 'inherit');
      }

    })
  }
  initForm(){

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



  showUpis(){
    this.showUpiList = !this.showUpiList;
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
            this.toastr.successMsg(resp.message)
            $('#page_loading').css('display', 'none');
            this.hideOverlayInfo('#addUpiDialog');
            this.upiFormReset();
            this.getUpiList(this.currentUser.userId);
          } else {
            this.toastr.errorMsg(resp.message)
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
      this.toastr.errorMsg('Invalid Input')
    }

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
          this.toastr.successMsg(resp.message)
          $('#page_loading').css('display', 'none');
          this.hideOverlayInfo('#confirmation');
          this.getUpiList(this.currentUser.userId);
        } else {
          this.toastr.errorMsg(resp.message)
          $('#page_loading').css('display', 'none');
        }
      }
    }, err => {
      this.preferredUpiInTransit = false;
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
          this.toastr.successMsg(resp.message)
          $('#page_loading').css('display', 'none');
          this.getUpiList(this.currentUser.userId);
        } else {
          this.toastr.errorMsg(resp.message)
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
            this.toastr.successMsg(resp.message)
            $('#page_loading').css('display', 'none');
            this.hideOverlayInfo('#editUpiDialog');
            this.editUpiForm.reset();
            this.getUpiList(this.currentUser.userId);
          } else {
            this.toastr.errorMsg(resp.message)
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
      this.toastr.errorMsg('Invalid Input')
    }

  }


  upiFormReset(){
    this.upiForm.controls.value.reset();
    this.upiForm.controls.type.reset();
    this.upiForm.controls.name.reset();
  }

}
