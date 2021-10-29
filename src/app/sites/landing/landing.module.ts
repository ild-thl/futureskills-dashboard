import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { LandingComponent } from 'src/app/sites/landing/pages/landing/landing.components';
import { AdvantagesComponent } from 'src/app/sites/landing/components/advantages/advantages.component';
import { PartnershipComponent } from 'src/app/sites/landing/components/partnership/partnership.component';
import { CoursecarouselModule } from 'src/app/sites/landing/components/coursecarousel/coursecarousel.module';
import { KiPlaygroundBlockComponent } from './components/ki-playground-block/ki-playground-block.component';
import { RoundEasyButtonComponent } from './components/ki-playground-block/round-easy-button/round-easy-button.component';
import { IntroBannerComponent } from './components/intro-banner/intro-banner.component';

@NgModule({
  declarations: [
    LandingComponent,
    AdvantagesComponent,
    PartnershipComponent,
    KiPlaygroundBlockComponent,
    RoundEasyButtonComponent,
    IntroBannerComponent
  ],
  imports: [RouterModule, SharedModule, CoursecarouselModule],
  exports: [],
  providers: [],
})
export class LandingPageModule {}
