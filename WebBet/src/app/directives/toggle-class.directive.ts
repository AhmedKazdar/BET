import { Directive, ElementRef, HostListener } from '@angular/core';
import { TokenService } from '../services/token.service';

@Directive({
  selector: '[appToggleClass]'
})
export class ToggleClassDirective {
  isLogin: boolean = false;
  constructor(private el: ElementRef, private tokenService: TokenService) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }
  @HostListener('click', ['$event']) onClick($event) {

    if (this.isLogin) {
      if (!this.el.nativeElement) {
        return;
      }
      if (!this.el.nativeElement.parentElement) {
        return;
      }
      if (!this.el.nativeElement.parentElement.parentElement) {
        return;
      }

      let element = this.el.nativeElement.parentElement.parentElement;

      element.classList.toggle("close");
    }


  }

}
