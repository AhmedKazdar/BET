import { AfterViewInit, Component, ElementRef,  ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-telegram-login-widget-component',
  templateUrl: './telegram-login-widget-component.component.html',
})
export class TelegramLoginWidgetComponentComponent implements AfterViewInit {

  @ViewChild('script', {static: true}) script: ElementRef;

  convertToScript() {
    const element = this.script.nativeElement;
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?2';
    script.setAttribute('data-telegram-login', environment.telegramBotName);
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-onauth', 'loginViaTelegram(user)');
    script.setAttribute('data-request-access', 'write');
    element.parentElement.replaceChild(script, element);
  }

  ngAfterViewInit() {
    this.convertToScript();
  }

}
