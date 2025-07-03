import { Component, OnInit } from '@angular/core';
import { ClientApiService } from 'src/app/services/client-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support-wrap',
  templateUrl: './support-wrap.component.html',
  styleUrls: ['./support-wrap.component.css']
})
export class SupportWrapComponent implements OnInit {
  siteName = environment.siteName;
  whatsapp = environment.whatsapp;
  whatsapp1 = environment.whatsapp1;
  whatsapp2 = environment.whatsapp2;
  whatsapp3 = environment.whatsapp3;
  isSocial = environment.isSocial;
  
  fullSiteName = window.location.hostname.replace('www.', '');
  supportOpen: string = "whatsapp"
  WhatsappNumber: any;

  constructor(private number: ClientApiService) { }

  ngOnInit(): void {
    if(this.isSocial){
      this.getNumber();
    }
  }

  openSupport(supportOpen) {
    this.supportOpen = supportOpen;
  }

  getNumber() {
    this.number.getWhatsappNumber().subscribe((resp: any) => {
      this.WhatsappNumber=resp.data
      console.log(this.WhatsappNumber,"whatsapp number")
    });
  }

}
