import { SmallKIOfferTileComponent } from './component/small-kioffer-tile/small-kioffer-tile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseSliderComponent } from './course-slider.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxGlideModule } from 'ngx-glide';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [CourseSliderComponent, SmallKIOfferTileComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NgxGlideModule,
    CarouselModule,
  ],
  exports:[
    CourseSliderComponent
  ],

})
export class CourseSliderModule { }
