import { SmallOfferDetailData } from 'src/app/core/models/offer';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CourseSliderEvents, CourseSliderOptions } from './course-slider-options';
import { NgxGlideComponent } from 'ngx-glide';

@Component({
  selector: 'fs-course-slider',
  templateUrl: './course-slider.component.html',
  styleUrls: ['./course-slider.component.scss']
})
export class CourseSliderComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() kiOffers: SmallOfferDetailData[];
  @ViewChild('ngxGlide') ngxGlide!: NgxGlideComponent;
  sliderOptions: CourseSliderOptions = new CourseSliderOptions();
  isLoading = false;
  isAutoplay!: boolean;
  isSwipeThreshold!: boolean;
  isDragThreshold!: boolean;
  isPerTouch!: boolean;


  constructor() {
    this.isAutoplay = false;
    this.isSwipeThreshold = true;
    this.isDragThreshold = true;
    this.isPerTouch = false;
  }

  ngOnInit(): void {}

  ngAfterViewInit():void {}

  ngOnChanges(): void {
    console.log('Module mit KI_Keyword: ', this.kiOffers);
  }

}
