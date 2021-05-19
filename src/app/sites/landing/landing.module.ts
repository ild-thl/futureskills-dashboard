import { Injectable, NgModule } from '@angular/core';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import * as Hammer from 'hammerjs';

import { LandingComponent } from 'src/app/sites/landing/pages/landing/landing.components';
import { AdvantagesComponent } from 'src/app/sites/landing/components/advantages/advantages.component';
import { PreviewInfoBannerComponent } from 'src/app/sites/landing/components/banner-top/banner-top.component';
import { CoursecarouselComponent } from 'src/app/sites/landing/components/coursecarousel/coursecarousel.component';
import { HerocontainerComponent } from 'src/app/sites/landing/components/herocontainer/herocontainer.component';
import { PartnershipComponent } from 'src/app/sites/landing/components/partnership/partnership.component';
import { TrailerComponent } from 'src/app/sites/landing/components/trailer/trailer.component';
import { ConsentVideoComponent } from 'src/app/sites/landing/components/trailer//consent-video/consent-video.component';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [
    LandingComponent,
    AdvantagesComponent,
    PreviewInfoBannerComponent,
    HerocontainerComponent,
    PartnershipComponent,
    TrailerComponent,
    ConsentVideoComponent,
    CoursecarouselComponent
  ],
  imports:[
    RouterModule,
    SharedModule,
    HammerModule,
  ],
  exports:[],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }
  ]
})

export class LandingPageModule {}
