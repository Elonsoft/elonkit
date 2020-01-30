import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CounterStoryContainerComponent } from './counter-story-container.component';
import { ESCounterModule } from '../..';

@NgModule({
  declarations: [CounterStoryContainerComponent],
  imports: [CommonModule, ESCounterModule],
  exports: [CounterStoryContainerComponent]
})
export class CounterStoryContainerModule {}
