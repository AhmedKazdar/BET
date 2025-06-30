import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputRestrictionDirective } from './special-charInput.directive';
import { NumberOnlyDirective } from './number-only.directive';

@NgModule({
  declarations: [ InputRestrictionDirective,NumberOnlyDirective],
  imports: [CommonModule],
  exports: [ InputRestrictionDirective,NumberOnlyDirective],
})
export class DirectivesModule {}
