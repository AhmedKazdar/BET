import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggleClass]'
})
export class ToggleClassDirective {

  constructor(private el: ElementRef) {
    // if (!this.el.nativeElement) {
    //   return;
    // }
    // if (!this.el.nativeElement.parentElement) {
    //   return;
    // }
    // if (!this.el.nativeElement.parentElement.parentElement) {
    //   return;
    // }

    // let element = this.el.nativeElement.parentElement.parentElement;

    // element.classList.toggle("close");

  }
  @HostListener('click', ['$event']) onClick($event) {
   
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
