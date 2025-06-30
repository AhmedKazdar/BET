import { Component, OnInit } from '@angular/core';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-col-center',
  templateUrl: './col-center.component.html',
  styleUrls: ['./col-center.component.scss']
})
export class ColCenterComponent implements OnInit {
  siteName = environment.siteName;

  status: string = "";
  msgData: any;
  timeoutReset;

  constructor(
    private toastr: ToastMessageService,

  ) { }

  ngOnInit(): void {
    this.getToastMessage();
  }

  getToastMessage() {
    this.toastr.successMsgSource.subscribe(data => {
      console.log(data)
      this.status = 'success';
      this.msgData = data;
      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    })
    this.toastr.errorMsgSource.subscribe(data => {
      console.log(data)

      this.status = 'error';
      this.msgData = data;

      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    })
    this.toastr.warningMsgSource.subscribe(data => {
      console.log(data)

      this.status = 'warning';
      this.msgData = data;

      this.timeoutReset = setTimeout(() => {
        this.removeMsg();
      }, 5000);
    })
  }

  removeMsg() {
    this.msgData = null;
    clearTimeout(this.timeoutReset);
  }

}
