import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasinoListComponent } from './casino-list/casino-list.component';
import { RouterModule, Routes } from '@angular/router';
import { CasinoGameComponent } from './casino-game/casino-game.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';
import { LcasinoComponent } from './lcasino/lcasino.component';
import { IndianCasinoComponent } from './indian-casino/indian-casino.component';
import { InternationalCasinoComponent } from './international-casino/international-casino.component';
import { BetgamesComponent } from './betgames/betgames.component';
import { TwainComponent } from './twain/twain.component';
import { AwclistComponent } from './awclist/awclist.component';
import { BlueoceanComponent } from './blueocean/blueocean.component';
import { AmanComponent } from './aman/aman.component';
const routes: Routes = [
  {
    path: '',
    component: CasinoListComponent,
  },
  {
    path: 'tp/:tableId/:tableName/:gType',
    component: CasinoGameComponent,
  },
  {
    path: 'International-casino',
    component: InternationalCasinoComponent,
  },
  {
    path: 'Indian-casino',
    component: IndianCasinoComponent,
  },
  {
    path: 'cas/bo',
    component: BlueoceanComponent,
  },
  {
    path: 'aman',
    component: AmanComponent,
  }
];

@NgModule({
  declarations: [
    CasinoListComponent,
    CasinoGameComponent,
    LcasinoComponent,
    IndianCasinoComponent,
    InternationalCasinoComponent,
    BetgamesComponent,
    TwainComponent,
    AwclistComponent,
    BlueoceanComponent,
    AmanComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    GoogleChartsModule
  ],
  exports: [
    RouterModule
  ]
})
export class CasinoModule { }
