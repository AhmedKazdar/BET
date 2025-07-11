import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientApiService } from 'src/app/services/client-api.service';
import { MainService } from 'src/app/services/main.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  announcements: any[] = [];
  siteName: string = environment.siteName;
  
  newsPending: boolean = false;
  isLogin: boolean = false;
  private refreshSubscription: Subscription;

  constructor(
    private userService: ClientApiService,
    private main: MainService,
    private tokenService: TokenService,

  ) {
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }

    if (this.isLogin) {
      this.main.apis$.subscribe((res) => {
        this.getNews();
        this.getticker();
      });
    }

    // Set up auto-refresh every 60 seconds
    this.refreshSubscription = interval(60000).subscribe(() => {
      if (this.isLogin) {
        this.getNews();
        this.getticker();
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getNews() {
    if (this.newsPending) {
      return;
    }
    this.newsPending = true;
    
    this.userService.getTicker().subscribe((resp: any) => {
      if (resp.errorCode === 0) {
        // Process announcements from API
        this.announcements = [];
        
        // Process each ticker as a separate announcement
        resp.result.forEach((t: any) => {
          try {
            // Decode the base64 encoded ticker text
            const tickerText = atob(t.ticker || '').trim();
            const now = new Date();
            
            // Split the text by newlines to handle multiple announcements in one ticker
            const announcementTexts = tickerText.split('\n').filter(text => text.trim() !== '');
            
            // Create a separate announcement for each line
            announcementTexts.forEach(text => {
              if (text.trim()) {
                this.announcements.push({
                  date: now.getDate(),
                  month: this.getMonthShortName(now.getMonth()),
                  year: now.getFullYear(),
                  text: text.trim()
                });
              }
            });
          } catch (e) {
            console.error('Error processing announcement:', e);
          }
        });
        
        // Sort announcements by timestamp (newest first)
        this.announcements.sort((a, b) => b.timestamp - a.timestamp);
        
        // If no announcements from API, add a default one
        if (this.announcements.length === 0) {
          const now = new Date();
          this.announcements.push({
            date: now.getDate(),
            month: this.getMonthShortName(now.getMonth()),
            year: now.getFullYear(),
            text: 'No announcements available.'
          });
        }
      }
      this.newsPending = false;
    }, err => {
      this.newsPending = false;
      console.error('Error fetching announcements:', err);
      
      // Add error message as an announcement
      const now = new Date();
      this.announcements = [{
        date: now.getDate(),
        month: this.getMonthShortName(now.getMonth()),
        year: now.getFullYear(),
        text: 'Failed to load announcements. Please try again later.'
      }];
    });
  }

  getticker() {
    this.userService.get_ticker().subscribe((resp: any) => {
      if (resp?.ticker) {
        const now = new Date();
        const tickerText = resp.ticker.trim();
        
        // Split the ticker text by newlines and process each line
        const announcementTexts = tickerText.split('\n').filter(text => text.trim() !== '');
        
        // Add each line as a separate announcement
        announcementTexts.forEach(text => {
          if (text.trim() && !this.announcements.some(a => a.text === text.trim())) {
            this.announcements.unshift({
              date: now.getDate(),
              month: this.getMonthShortName(now.getMonth()),
              year: now.getFullYear(),
              text: text.trim(),
              timestamp: now.getTime()
            });
          }
        });
        
        // Keep only the latest 20 announcements to prevent memory issues
        if (this.announcements.length > 20) {
          this.announcements = this.announcements
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, 20);
        }
      }
    }, err => {
      console.error('Error fetching ticker:', err);
    });
  }

  getMonthShortName(month: number): string {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[month];
  }

}
