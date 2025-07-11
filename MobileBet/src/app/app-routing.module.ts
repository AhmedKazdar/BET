import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ACasinoComponent } from './casino/a-casino/a-casino.component';
import { AwccasinoComponent } from './casino/awccasino/awccasino.component';
import { LcasinoComponent } from './casino/lcasino/lcasino.component';
import { EventComponent } from './event/event.component';
import { HighlightsComponent } from './highlights/highlights.component';
import { HomeComponent } from './home/home.component';
import { InplayComponent } from './inplay/inplay.component';
import { MainComponent } from './main/main.component';
import { MultiMarketsComponent } from './multi-markets/multi-markets.component';
import { RacesComponent } from './races/races.component';
import { AuthGuard } from './services/auth.guard';
import { AuthMaintananceGuard } from './services/auth.maintainance.guard';
import { TokenComponent } from './token/token.component';
import { VirtualsportsComponent } from './virtualsports/virtualsports.component';
import { XGameComponent } from './x-game/x-game.component';
import { OtherGamesComponent } from './other-games/other-games.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { DisputeComponent } from './dispute/dispute.component';
import { WithdrawaldetailsComponent } from './withdrawaldetails/withdrawaldetails.component';
import { DepositwithdrawComponent } from './depositwithdraw/depositwithdraw.component';
import { BetgamesComponent } from './casino/betgames/betgames.component';
import { TwainComponent } from './casino/twain/twain.component';
import { CasinoListComponent } from './casino/casino-list/casino-list.component';
import { ResultsComponent } from './results/results.component';
let homeCom = 'dash';
let inplayCom = 'running';
let highCom = 'highlight';
let eventCom = 'event';
let useHashData = false;

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [AuthMaintananceGuard],
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then((m) => m.SignUpModule),
    canActivate: [AuthMaintananceGuard],
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./maintenance/maintenance.module').then((m) => m.MaintenanceModule)

  },
  {
    path: 'change_pass',
    loadChildren: () => import('./change-password/change-password.module').then((m) => m.ChangePasswordModule),
    canActivate: [AuthGuard],

  },

  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: homeCom },
      { path: homeCom, component: HomeComponent },
      { path: highCom, component: HighlightsComponent},
      { path: highCom + '/:eventTypeId', component: HighlightsComponent},
      { path: inplayCom, component: InplayComponent},
      // { path: 'result', component: ResultComponent },
      { path: homeCom, component: HomeComponent},
      { path: eventCom, component: EventComponent },
      { path: eventCom + '/:eventId', component: EventComponent },
      { path: eventCom + '/:eventId/:marketId/:port', component: EventComponent },

      { path: 'multimarkets', component: MultiMarketsComponent},
      { path: 'races/:eventTypeId', component: RacesComponent },
      { path: 'token/:token', component: TokenComponent },

      { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
      { path: 'virtual_sports', component: VirtualsportsComponent ,  canActivate: [AuthGuard]},
      { path: 'x-game', component: XGameComponent ,  canActivate: [AuthGuard] },
      { path: 'tpp/:opentable', component: ACasinoComponent,  canActivate: [AuthGuard]},
      { path: 'lcasino', component: LcasinoComponent  , canActivate: [AuthGuard]},
      { path: 'awccasino', component: AwccasinoComponent , canActivate: [AuthGuard]},
      { path: 'Other-Games', component: OtherGamesComponent , canActivate: [AuthGuard] },
      { path: 'withdrawaldetails', component: WithdrawaldetailsComponent ,  canActivate: [AuthGuard] },
      { path: 'feedback', component: FeedbackComponent ,  canActivate: [AuthGuard]},
      { path: 'dispute', component: DisputeComponent , canActivate: [AuthGuard]},
      { path: 'dw', component: DepositwithdrawComponent ,  canActivate: [AuthGuard]},
      { path: 'betgames', component: BetgamesComponent,  canActivate: [AuthGuard]},
      { path: 'betgames/:Id', component: BetgamesComponent,  canActivate: [AuthGuard]},
      { path: 'twain', component: TwainComponent,  canActivate: [AuthGuard] },
      { path: 'result', component: ResultsComponent,  canActivate: [AuthGuard] },

      {
        path: 'cas/:Platform',
        component: CasinoListComponent,
      },
      
      {
        path: 'casino',
        loadChildren: () => import('./casino/casino.module').then((m) => m.CasinoModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'exchange',
        loadChildren: () => import('./exchange-games/exchange-games.module').then((m) => m.ExchangeGamesModule),
        canActivate: [AuthGuard]
      },

    ],
    canActivate: [AuthMaintananceGuard],
  },
  //Wild Card Route for 404 request
  {
    path: '**', pathMatch: 'full',
    loadChildren: () => import('./pagenotfound/pagenotfound.module').then((m) => m.PagenotfoundModule),
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: useHashData })],

  exports: [RouterModule]
})
export class AppRoutingModule { }
