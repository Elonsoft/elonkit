import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { InlineFormFieldStoryBasicComponent } from './inline-form-field-story-basic.component';

import { ESInlineFormFieldModule } from '../../inline-form-field.module';
import {
  InlineFormFieldLocale,
  InlineFormFieldLocaleRU
} from '../../inline-form-field.component.locale';

@NgModule({
  declarations: [InlineFormFieldStoryBasicComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDatepickerModule,
    MatNativeDateModule,

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,

    ESInlineFormFieldModule
  ],
  exports: [InlineFormFieldStoryBasicComponent],
  providers: [{ provide: InlineFormFieldLocale, useClass: InlineFormFieldLocaleRU }]
})
export class InlineFormFieldStoryBasicModule {}
