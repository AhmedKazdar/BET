import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { BetHistoryComponent } from './components/bet-history/bet-history.component';
import { CurrentBetsComponent } from './components/current-bets/current-bets.component';
import { MainWrapComponent } from './components/main-wrap/main-wrap.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';
import { CasinoProfitlossComponent } from './components/casino-profitloss/casino-profitloss.component';
import { CasinoBethistoryComponent } from './components/casino-bethistory/casino-bethistory.component';
import { CasinoproductComponent } from './components/casinoproduct/casinoproduct.component';
import { SummaryComponent } from './components/summary/summary.component';
import { DwRequestsComponent } from './components/dw-requests/dw-requests.component';
import { WithdrawalbankdetailsComponent } from './components/withdrawaldetails/withdrawalbankdetails/withdrawalbankdetails.component';
import { WithdrawalupidetailsComponent } from './components/withdrawaldetails/withdrawalupidetails/withdrawalupidetails.component';
import { DisputeComponent } from './components/dispute/dispute.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { BetgamesProfitlossComponent } from './betgames-profitloss/betgames-profitloss.component';
import { BetgamesBethistoryComponent } from './betgames-bethistory/betgames-bethistory.component';
import { AwcBethistoryComponent } from './components/awc-bethistory/awc-bethistory.component';
import { AwcProfitlossComponent } from './components/awc-profitloss/awc-profitloss.component';
import { BoBethistoryComponent } from './components/bo-bethistory/bo-bethistory.component';
import { BoProfitlossComponent } from './components/bo-profitloss/bo-profitloss.component';
import { ParlayProfitlossComponent } from './components/parlay-profitloss/parlay-profitloss.component';
import { ParlayBethistoryComponent } from './components/parlay-bethistory/parlay-bethistory.component';
import { KycprofileComponent } from './components/kycprofile/kycprofile.component';

const routes: Routes = [
  {
    path: '',
    component: MainWrapComponent,
    children: [
      { path: '', component: MyAccountComponent },
      { path: 'detail', component: MyAccountComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'account_statement', component: AccountStatementComponent },
      { path: 'dw_requests', component: DwRequestsComponent },
      { path: 'bank_details', component: WithdrawalbankdetailsComponent },
      { path: 'upi_details', component: WithdrawalupidetailsComponent },
      { path: 'current_bets', component: CurrentBetsComponent },
      { path: 'bet_history', component: BetHistoryComponent },
      { path: 'profit_loss', component: ProfitLossComponent },
      { path: 'activity_log', component: ActivityLogComponent },
      { path: 'dispute', component: DisputeComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'casino_profit_loss', component: CasinoProfitlossComponent },
      { path: 'casino_bet_history', component: CasinoBethistoryComponent },
      { path: 'casino_product', component: CasinoproductComponent },
      { path: 'bo_bet_history', component: BoBethistoryComponent },
      { path: 'bo_profit_loss', component: BoProfitlossComponent },
      { path: 'betgames_profit_loss', component: BetgamesProfitlossComponent },
      { path: 'betgames_bet_history', component: BetgamesBethistoryComponent },
      { path: 'awc_bet_history', component: AwcBethistoryComponent },
      { path: 'awc_profit_loss', component: AwcProfitlossComponent },
      { path: 'parlay_profit_loss', component: ParlayProfitlossComponent },
      { path: 'parlay_bet_history', component: ParlayBethistoryComponent },
      { path: 'kycdetail', component: KycprofileComponent },

    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
