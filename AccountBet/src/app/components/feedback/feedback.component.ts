import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientApiService } from 'src/app/services/client-api.service';
import { LoginService } from 'src/app/services/login.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  FeedbackForm: FormGroup;
  feedbackInTransit:boolean=false;

  constructor(private fb: FormBuilder,private fdService:ClientApiService,private toastr:ToastMessageService) {}

  ngOnInit(): void {
    this.initLoginForm();
    $('#page_loading').css('display', 'none');
  }

  initLoginForm() {
    this.FeedbackForm = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      subject: ['', Validators.required],
      description: ['', Validators.required],
      siteName:[environment.siteName],
      domain:[environment.domain]
    });
  }

  submitFeedback(){
    if(this.FeedbackForm.invalid){
      this.toastr.errorMsg('Invalid Input')
    }
    else{
      if(this.feedbackInTransit){
        return;
      }
      else{
        $('#loading').css('display', 'block');
        this.feedbackInTransit=true;
        this.fdService.sendFeedback(this.FeedbackForm.value).subscribe((resp: any) => {
          if (resp.status === 'Success') {
            if (resp.message) {
              this.toastr.successMsg(resp.message)
              this.FeedbackForm.reset();
            }
          }else{
            if (resp.message) {
              this.toastr.errorMsg(resp.message)
            }
          }
            $('#loading').css('display', 'none');
          this.feedbackInTransit=false;
          }, err => {
            $('#loading').css('display', 'none');
            console.log(err);
          }
        );
      }
    }
  }

}
