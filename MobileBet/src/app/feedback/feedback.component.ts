import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { FeedbackDisputeService } from '../services/feedback-dispute.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  FeedbackForm: FormGroup;
  feedbackInTransit:boolean=false;

  constructor(private fb: FormBuilder,private fdService:FeedbackDisputeService,private toastr:ToastrService) {}

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
      this.toastr.error('Invalid Input')
    }
    else{
      if(this.feedbackInTransit){
        return;
      }
      else{
        $('#page_loading').css('display', 'flex');
        this.feedbackInTransit=true;
        this.fdService.sendFeedback(this.FeedbackForm.value).subscribe((resp: any) => {
          if (resp.status === 'Success') {
            if (resp.message) {
              this.toastr.success(resp.message)
              this.FeedbackForm.reset();
            }
          }else{
            if (resp.message) {
              this.toastr.error(resp.message)
            }
          }
            $('#page_loading').css('display', 'none');
          this.feedbackInTransit=false;
          }, err => {
            $('#page_loading').css('display', 'none');
            console.log(err);
          }
        );
      }
    }
  }

}
