import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientApiService } from 'src/app/services/client-api.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.scss']
})
export class DisputeComponent implements OnInit {

  imageURL: string;
  DisputeForm: FormGroup;
  DisputeInTransit:boolean=false;
  Update: any;
  
  constructor(
    private fb: FormBuilder,
    private fdService:ClientApiService,
    private toastr:ToastMessageService,
    private shareService: ShareDataService
    ) {}

  ngOnInit(): void {
    this.initLoginForm();
    $('#page_loading').css('display', 'none');
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
    initLoginForm() {
      this.DisputeForm = this.fb.group({
        email: ['',[Validators.required,Validators.email]],
        subject: ['', Validators.required],
        img: [''],
        description: ['', Validators.required]
      });
    }
  
    submitDispute(){
      if(this.DisputeForm.invalid){
        this.toastr.errorMsg('Invalid Input')
      }
      else{
        if(this.DisputeInTransit){
          return;
        }
        else{
          $('#loading').css('display', 'block');
          this.DisputeInTransit=true;
          let formData = new FormData();
          formData.append('email', this.DisputeForm.value.email)
          formData.append('siteName', environment.siteName)
          formData.append('domain',environment.domain)
          formData.append('subject', this.DisputeForm.value.subject)
          formData.append('img', this.DisputeForm.value.img)
          formData.append('description', this.DisputeForm.value.description)
          this.fdService.sendDispute(formData).subscribe((resp: any) => {
            if (resp.status === 'Success') {
              if (resp.message) {
                this.toastr.successMsg(resp.message)
                this.DisputeForm.reset();
                this.imageURL='';
              }
            }else{
              if (resp.message) {
                this.toastr.errorMsg(resp.message)
              }
            }
              $('#loading').css('display', 'none');
            this.DisputeInTransit=false;
            }, err => {
              $('#loading').css('display', 'none');
              console.log(err);
            }
          );
        }
      }
    }

  showPreview(event: any) {
    if (event.target.files.length > 0) {
      const file = (event.target as HTMLInputElement).files[0];
      this.DisputeForm.patchValue({
        img: file
      });
      this.DisputeForm.get('img').updateValueAndValidity()
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
    else {
      this.DisputeForm.patchValue({
        img: null
      });
      this.imageURL = ''
    }
  }

}
