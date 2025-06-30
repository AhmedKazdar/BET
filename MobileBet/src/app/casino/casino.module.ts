import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasinoListComponent } from './casino-list/casino-list.component';
import { RouterModule, Routes } from '@angular/router';
import { CasinoGameComponent } from './casino-game/casino-game.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleChartsModule } from 'angular-google-charts';
import { LcasinoComponent } from './lcasino/lcasino.component';
import { EtgCasinoListComponent } from './etg-casino-list/etg-casino-list.component';
import { SwiperModule } from 'swiper/angular';
import { AwccasinoComponent } from './awccasino/awccasino.component';
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
    path: 'cas/:casinoType',
    component: CasinoListComponent,
  },
  {
    path: 'etg',
    component: EtgCasinoListComponent,
  },
  {
    path: 'tp/:tableId/:tableName/:gType',
    component: CasinoGameComponent,
  },
  {
    path: 'cas/:casinoType/tp/:tableId/:tableName/:gType',
    component: CasinoGameComponent,
  },
  {
    path: 'awccasino',
    component: AwccasinoComponent,
  },
  {
    path: 'awclist',
    component: AwclistComponent,
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
    EtgCasinoListComponent,
    AwccasinoComponent,
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
    GoogleChartsModule,
    SwiperModule
  ],
  exports: [
    RouterModule,
    AwccasinoComponent
  ]
})
export class CasinoModule { }
