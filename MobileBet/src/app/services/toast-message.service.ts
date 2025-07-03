import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  successMsgSource: Observable<any>;
  private currentSuccessMsg: BehaviorSubject<any>

  errorMsgSource: Observable<any>;
  private currentErrorMsg: BehaviorSubject<any>

  warningMsgSource: Observable<any>;
  private currentWarningMsg: BehaviorSubject<any>

  constructor() {
    this.currentSuccessMsg = <BehaviorSubject<any>>new BehaviorSubject(null);
    this.successMsgSource = this.currentSuccessMsg.asObservable();

    this.currentErrorMsg = <BehaviorSubject<any>>new BehaviorSubject(null);
    this.errorMsgSource = this.currentErrorMsg.asObservable();

    this.currentWarningMsg = <BehaviorSubject<any>>new BehaviorSubject(null);
    this.warningMsgSource = this.currentWarningMsg.asObservable();
   }

   successMsg(data:any){
     this.currentSuccessMsg.next(data);
   }
   errorMsg(data:any){
    this.currentErrorMsg.next(data);
  }
  warningMsg(data:any){
    this.currentWarningMsg.next(data);
  }
}
