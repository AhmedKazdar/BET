import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { elementAt } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent implements OnInit {

   @ViewChild('script', {static: true}) script: ElementRef;
   whatsappOpen:boolean = false;
   date ='';
   actualSiteName = environment.siteName;
   siteName = environment.siteName[0].toUpperCase()+ environment.siteName.slice(1);
   whatsappChat = environment.whatsappChat;

  convertToScript() {
    const element = this.script.nativeElement;
    const script = document.createElement('script');
    script.src = '//in.fw-cdn.com/30726088/390008.js';
    script.setAttribute('chat', 'true');
    script.setAttribute('widgetId', 'ad3c94d0-3240-4039-a7e5-4c49c0aac114');
    element.parentElement.replaceChild(script, element);
  }
  ngOnInit(): void {
  //  this.convertToScript();
    var d = new Date(); 
    this.date = d.getHours()+':'+d.getMinutes();
  }


  openWhatsapp(){
    this.whatsappOpen = !this.whatsappOpen;
    var d = new Date(); 
    this.date = d.getHours()+':'+d.getMinutes();
  }

}
