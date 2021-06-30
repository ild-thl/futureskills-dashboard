import { Injectable, NgModule } from '@angular/core';
import {
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import * as Hammer from 'hammerjs';
import { CoursecarouselComponent } from './coursecarousel.component';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [CoursecarouselComponent],
  imports: [RouterModule, SharedModule, HammerModule],
  exports: [CoursecarouselComponent],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
  ],
})
export class CoursecarouselModule {}
