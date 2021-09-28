import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseSliderComponent } from './course-slider.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [CourseSliderComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    CarouselModule,
  ],
  exports:[
    CourseSliderComponent,
  ],

})
export class CourseSliderModule { }
