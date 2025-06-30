import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { InplayComponent } from './inplay/inplay.component';
import { HighlightsComponent } from './highlights/highlights.component';
import { SortByDatePipe } from './pipes/sort-by-date.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { RemoveSpacePipe } from './pipes/remove-space.pipe';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MarqueeComponent } from './marquee/marquee.component';
import { PromoteBannerComponent } from './promote-banner/promote-banner.component';
import { NavComponent } from './nav/nav.component';
import { SettingsComponent } from './settings/settings.component';
import { OpenBetsComponent } from './open-bets/open-bets.component';
import { SearchComponent } from './search/search.component';
import { EventComponent } from './event/event.component';
import { MultiMarketsComponent } from './multi-markets/multi-markets.component';
import { AccountComponent } from './account/account.component';
import { OrderByFancyPipe } from './pipes/order-by-fancy.pipe';
import { TokenInterceptor } from './services/token.interceptor';
import { FooterModule } from './footer/footer.module';
import { RacesComponent } from './races/races.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { TokenComponent } from './token/token.component';
import { VirtualsportsComponent } from './virtualsports/virtualsports.component';
import { XGameComponent } from './x-game/x-game.component';
import { ACasinoComponent } from './casino/a-casino/a-casino.component';
import { DirectivesModule } from './directives/directives.module';
import { OrderByBookPipe } from './pipes/oder-by-book.pipe';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { OtherGamesComponent } from './other-games/other-games.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { DisputeComponent } from './dispute/dispute.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ToastrModule } from 'ngx-toastr';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { AuthService } from './socialshared/auth.service';
import { DepositwithdrawComponent } from './depositwithdraw/depositwithdraw.component';
import { WithdrawaldetailsComponent } from './withdrawaldetails/withdrawaldetails.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';
import { GlobalErrorHandler } from './GlobalErrorHandler/GlobalErrorHandler';
import { ResultsComponent } from './results/results.component';

let firebase = {
  projectId: 'cricbuzzer-d42fe',
  appId: '1:445142658279:web:f367e9700079ec84160642',
  storageBucket: 'cricbuzzer-d42fe.appspot.com',
  apiKey: 'AIzaSyBdHBIDzWEcUaF4fQLv8xFzyAL7M3XbCPg',
  authDomain: 'cricbuzzer-d42fe.firebaseapp.com',
  messagingSenderId: '445142658279',
  measurementId: 'G-DGDYH1GVXW',
};

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    InplayComponent,
    HighlightsComponent,
    SortByDatePipe,
    OrderByFancyPipe,
    OrderByBookPipe,
    OrderByPipe,
    ReversePipe,
    RemoveSpacePipe,
    HeaderComponent,
    FooterComponent,
    MarqueeComponent,
    PromoteBannerComponent,
    NavComponent,
    SettingsComponent,
    OpenBetsComponent,
    SearchComponent,
    EventComponent,
    MultiMarketsComponent,
    AccountComponent,
    RacesComponent,
    TokenComponent,
    VirtualsportsComponent,
    XGameComponent,
    ACasinoComponent,
    OtherGamesComponent,
    FeedbackComponent,
    DisputeComponent,
    DepositwithdrawComponent,
    WithdrawaldetailsComponent,
    WhatsappComponent,
    ResultsComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FooterModule,
    GoogleChartsModule,
    DirectivesModule,
    AngularFireModule.initializeApp(firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    RecaptchaV3Module
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
    AuthService,
    // {provide: ErrorHandler, useClass: GlobalErrorHandler},
    // {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
