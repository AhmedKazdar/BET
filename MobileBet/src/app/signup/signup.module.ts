import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterModule } from '../footer/footer.module';
import { BrowserModule } from '@angular/platform-browser';
import { SignupComponent } from './signup.component';
import { TelegramComponent } from './telegram/telegram.component';

const routes: Routes = [
  {
    path: '', component: SignupComponent
  }
]

@NgModule({
    declarations: [SignupComponent,TelegramComponent],
    exports: [RouterModule],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FooterModule
    ]
})
export class SignUpModule { }

// export interface Countries {
//   code: string
//   code3: string
//   name: string
//   number: string
// }

