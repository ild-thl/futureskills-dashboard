import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { LandingComponent } from 'src/app/sites/landing/pages/landing/landing.components';
import { AdvantagesComponent } from 'src/app/sites/landing/components/advantages/advantages.component';
import { PreviewInfoBannerComponent } from 'src/app/sites/landing/components/banner-top/banner-top.component';
import { HerocontainerComponent } from 'src/app/sites/landing/components/herocontainer/herocontainer.component';
import { PartnershipComponent } from 'src/app/sites/landing/components/partnership/partnership.component';
import { TrailerComponent } from 'src/app/sites/landing/components/trailer/trailer.component';
import { CoursecarouselModule } from 'src/app/sites/landing/components/coursecarousel/coursecarousel.module';

@NgModule({
  declarations: [
    LandingComponent,
    AdvantagesComponent,
    PreviewInfoBannerComponent,
    HerocontainerComponent,
    PartnershipComponent,
    TrailerComponent
  ],
  imports: [RouterModule, SharedModule, CoursecarouselModule],
  exports: [],
  providers: [],
})
export class LandingPageModule {}
