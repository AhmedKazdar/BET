import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementComponent } from './announcement/announcement.component';

const routes: Routes = [
  {
    path: '',
    component: AnnouncementComponent
  }
]

@NgModule({
  declarations: [AnnouncementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AnnouncementModule { }
