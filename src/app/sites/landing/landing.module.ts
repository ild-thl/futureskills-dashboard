import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { LandingComponent } from 'src/app/sites/landing/pages/landing/landing.components';
import { AdvantagesComponent } from 'src/app/sites/landing/components/advantages/advantages.component';
import { PreviewInfoBannerComponent } from 'src/app/sites/landing/components/banner-top/banner-top.component';
import { CoursecarouselComponent } from 'src/app/sites/landing/components/coursecarousel/coursecarousel.component';
import { HerocontainerComponent } from 'src/app/sites/landing/components/herocontainer/herocontainer.component';
import { PartnershipComponent } from 'src/app/sites/landing/components/partnership/partnership.component';
import { TrailerComponent } from 'src/app/sites/landing/components/trailer/trailer.component';
import { ConsentVideoComponent } from 'src/app/sites/landing/components/trailer//consent-video/consent-video.component';

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
  ],
  exports:[

  ]
})

export class LandingPageModule {}
