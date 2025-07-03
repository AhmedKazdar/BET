import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterModule } from '../footer/footer.module';
import { TelegramLoginComponent } from './telegram_login/telegram_login.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  }
]

@NgModule({
  declarations: [LoginComponent,TelegramLoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FooterModule
  ],
  exports: [
    RouterModule
  ]
})
export class LoginModule { }
