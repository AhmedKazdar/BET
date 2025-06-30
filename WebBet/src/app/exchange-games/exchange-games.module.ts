import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExchangeComponent } from './exchange/exchange.component';

const routes: Routes = [
  {
    path: '',
    component: ExchangeComponent,
  },
  {
    path: 'ex/:gameName',
    component: ExchangeComponent,
  }
];

@NgModule({
  declarations: [
    ExchangeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule
  ]
})
export class ExchangeGamesModule { }
