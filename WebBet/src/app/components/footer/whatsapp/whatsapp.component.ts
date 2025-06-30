import { Component, ElementRef, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Debug function to log component state
function debugLog(message: string, data?: any) {
  console.log(`[WhatsApp] ${message}`, data || '');
}

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent implements OnInit, AfterViewInit {
  @ViewChild('script', {static: true}) script: ElementRef;
  whatsappOpen: boolean = false;
  date = '';
  actualSiteName = environment.siteName;
  siteName = environment.siteName[0].toUpperCase() + environment.siteName.slice(1);
  whatsappChat = environment.whatsappChat;
  whatsapp = environment.whatsapp;
  message: string = '';
  messages: Array<{sender: string, content: string, time: string}> = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    debugLog('Component initialized');
    this.updateTime();
    this.addWelcomeMessage();
    
    // Debug environment
    debugLog('Environment', {
      siteName: environment.siteName,
      whatsapp: environment.whatsapp,
      whatsappChat: environment.whatsappChat
    });
  }
  
  ngAfterViewInit(): void {
    debugLog('View initialized');
    // Force the chat to be visible for debugging
    setTimeout(() => {
      this.whatsappOpen = true;
      debugLog('Chat window forced open for debugging');
    }, 1000);
  }

  updateTime(): void {
    const d = new Date();
    this.date = d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }

  addWelcomeMessage(): void {
    this.messages.push({
      sender: this.siteName,
      content: 'Hi there! 👋\nWelcome to ' + this.siteName + '. How can we help you today?',
      time: this.date
    });
  }

  openWhatsapp(): void {
    this.whatsappOpen = !this.whatsappOpen;
    this.updateTime();
  }

  formatMessageContent(content: string): string {
    return content.replace(/\n/g, '<br>');
  }

  sendMessage(event: any): void {
    const message = event.target.value.trim();
    if (message === '') return;
    
    // Add user message to chat
    this.messages.push({
      sender: 'You',
      content: message,
      time: this.date
    });
    
    // Clear input
    event.target.value = '';
    
    // Open WhatsApp Web with the message
    const phoneNumber = '+21623237006';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Simulate auto-reply after a short delay
    setTimeout(() => {
      this.messages.push({
        sender: this.siteName,
        content: 'Thank you for your message. Our support team will get back to you soon!',
        time: this.date
      });
    }, 1000); 
    setTimeout(() => this.scrollToBottom(), 1000);
    
    // Scroll to bottom of chat
    setTimeout(() => this.scrollToBottom(), 100);
  }
  
  private scrollToBottom(): void {
    const chatBody = document.querySelector('.chat-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
  
  // Close chat when clicking outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.whatsapp-chat-window') && !target.closest('.whatsapp-float')) {
      this.whatsappOpen = false;
    }
  }

}
