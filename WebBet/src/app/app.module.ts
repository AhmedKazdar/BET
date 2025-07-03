import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColCenterComponent } from './components/col-center/col-center.component';
import { ColLeftComponent } from './components/col-left/col-left.component';
import { ColRightComponent } from './components/col-right/col-right.component';
import { FullWrapComponent } from './components/full-wrap/full-wrap.component';
import { FullmarketsComponent } from './components/fullmarkets/fullmarkets.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HighlightsComponent } from './components/highlights/highlights.component';
import { HomeComponent } from './components/home/home.component';
import { InplayComponent } from './components/inplay/inplay.component';
import { MarqueeComponent } from './components/marquee/marquee.component';
import { MultiMarketsComponent } from './components/multi-markets/multi-markets.component';
import { OneClickWrapComponent } from './components/one-click-wrap/one-click-wrap.component';
import { PromoteBannerComponent } from './components/promote-banner/promote-banner.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { SearchWrapComponent } from './components/header/search-wrap/search-wrap.component';
import { SettingPopComponent } from './components/header/setting-pop/setting-pop.component';
import { TokenInterceptor } from './services/token.interceptor';
import { SortByDatePipe } from './pipes/sort-by-date.pipe';
import { PolicyLinkComponent } from './components/footer/policy-link/policy-link.component';
import { SupportWrapComponent } from './components/footer/support-wrap/support-wrap.component';
import { OrderByFancyPipe } from './pipes/order-by-fancy.pipe';
import { RemoveSpacePipe } from './pipes/remove-space.pipe';
import { RacesComponent } from './components/races/races.component';
import { ToggleClassDirective } from './directives/toggle-class.directive';
import { TokenComponent } from './token/token.component';
import { VirtualsComponent } from './components/virtuals/virtuals.component';
import { XGameComponent } from './x-game/x-game.component';
import { ACasinoComponent } from './casino/a-casino/a-casino.component';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { InputRestrictionDirective } from './directives/special-charInput.directive';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { OrderByBookPipe } from './pipes/oder-by-book.pipe';
import { IframeTrackerDirective } from './components/fullmarkets/iframe-tracker.directive';
import { OtherGamesComponent } from './other-games/other-games.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { environment } from '../environments/environment';
import { AuthService } from './socialshared/auth.service';
import { ToastrModule } from 'ngx-toastr';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { TelegramLoginWidgetComponentComponent } from './login/telegram-login-widget-component/telegram-login-widget-component.component';
import { GlobalErrorHandler } from './GlobalErrorHandler/GlobalErrorHandler';
import { WhatsappComponent } from './components/footer/whatsapp/whatsapp.component';


@NgModule({
  declarations: [
    AppComponent,
    ColCenterComponent,
    ColLeftComponent,
    ColRightComponent,
    FullWrapComponent,
    FullmarketsComponent,
    HeaderComponent,
    FooterComponent,
    PolicyLinkComponent,
    SupportWrapComponent,
    HighlightsComponent,
    HomeComponent,
    InplayComponent,
    MarqueeComponent,
    MultiMarketsComponent,
    OneClickWrapComponent,
    PromoteBannerComponent,
    LoginComponent,
    SearchWrapComponent,
    SettingPopComponent,
    ACasinoComponent,
    SortByDatePipe,
    OrderByFancyPipe,
    OrderByBookPipe,
    RemoveSpacePipe,
    RacesComponent,
    ToggleClassDirective,
    TokenComponent,
    VirtualsComponent,
    XGameComponent,
    NumberOnlyDirective,
    InputRestrictionDirective,
    IframeTrackerDirective,
    ChangePasswordComponent,
    OtherGamesComponent,
    TelegramLoginWidgetComponentComponent,
    WhatsappComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
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
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    // ScreenTrackingService,UserTrackingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
