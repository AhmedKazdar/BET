import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AuComponent } from './au/au.component';
import { UnderagePolicyComponent } from './underage-policy/underage-policy.component';
import { SelfExecutionCricbuzzerComponent } from './self-execution-cricbuzzer/self-execution-cricbuzzer.component';
import { RgCricbuzzerComponent } from './rg-cricbuzzer/rg-cricbuzzer.component';
import { GtcCricbuzzerComponent } from './gtc-cricbuzzer/gtc-cricbuzzer.component';
import { DisputteResolutionCricbuzzerComponent } from './disputte-resolution-cricbuzzer/disputte-resolution-cricbuzzer.component';
import { AmlCricbuzzerComponent } from './aml-cricbuzzer/aml-cricbuzzer.component';
import { FairnessAndRngTestingMethodCricbuzzerComponent } from './fairness-and-rng-testing-method-cricbuzzer/fairness-and-rng-testing-method-cricbuzzer.component';
import { KycCricbuzzerComponent } from './kyc-cricbuzzer/kyc-cricbuzzer.component';
import { AffiliateComponent } from './affiliate/affiliate.component';

const routes: Routes = [
  {
    path: 'privacy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'au',
    component: AuComponent
  },
  {
    path: 'selfexclusionpolicy',
    component: SelfExecutionCricbuzzerComponent
  }, 
  {
    path: 'UnderagePolicy',
    component: UnderagePolicyComponent
  },
  {
    path: 'responsiblegaming',
    component: RgCricbuzzerComponent
  },
  
  
  {
    path: 'tremsandcondtions',
    component: GtcCricbuzzerComponent
  },
  {
    path: 'disputteresolution',
    component: DisputteResolutionCricbuzzerComponent
  },
  {
    path: 'aml',
    component: AmlCricbuzzerComponent
  },
  {
    path: 'fairnessandrngtestingmethod',
    component:FairnessAndRngTestingMethodCricbuzzerComponent 
  },
  {
    path: 'kyccricbuzzercomponent',
    component:KycCricbuzzerComponent
  },
  {
    path: 'affiliatecomponent',
    component:AffiliateComponent
  },
];

@NgModule({
  declarations: [PrivacyPolicyComponent, AuComponent, UnderagePolicyComponent, SelfExecutionCricbuzzerComponent, RgCricbuzzerComponent, GtcCricbuzzerComponent, DisputteResolutionCricbuzzerComponent, AmlCricbuzzerComponent, FairnessAndRngTestingMethodCricbuzzerComponent, KycCricbuzzerComponent, AffiliateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class RegulationsModule { }
