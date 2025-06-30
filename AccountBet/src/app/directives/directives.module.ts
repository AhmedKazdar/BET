import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRestrictionDirective } from './special-charInput.directive';
import { SortDirective } from './sort.directive';

@NgModule({
  declarations: [ InputRestrictionDirective,SortDirective],
  imports: [CommonModule],
  exports: [ InputRestrictionDirective,SortDirective],
})

export class DirectivesModule {}
