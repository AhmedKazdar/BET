import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FancyBookComponent } from './fancy-book/fancy-book.component';

const routes: Routes = [
  {
    path: 'book',
    component: FancyBookComponent
  },
  // {
  //   path: 'book/:mid/:sid/:nat',
  //   component: FancyBookComponent
  // },
  // {
  //   path: 'book/:mid/:sid/:nat/:nat2',
  //   component: FancyBookComponent
  // }
]

@NgModule({
  declarations: [FancyBookComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class FancyBookModule { }
