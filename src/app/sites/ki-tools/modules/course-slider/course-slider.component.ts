import { SmallOfferDetailData } from 'src/app/core/models/offer';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';

type SliderData = {
  id: number;
  title: string;
  image: string;
  sliderid: string;
};

@Component({
  selector: 'fs-course-slider',
  templateUrl: './course-slider.component.html',
  styleUrls: ['./course-slider.component.scss'],
})
export class CourseSliderComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() kiOffers: SmallOfferDetailData[] = [];
  @ViewChild('owlCarousel') owlCarousel: ElementRef;

  sliderIsVisible: boolean = false;
  sliderData: SliderData[] = [];

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: [
      "<div class='nav-btn prev-slide'>Links</div>",
      "<div class='nav-btn next-slide'>Rechts</div>",
    ],
    center: false,
    items: 5,
    margin: 10,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      440: {
        items: 3,
      },
      576: {
        items: 4,
      },
      992: {
        items: 5,
      },
      1200: {
        items: 5,
      },
    },
    nav: true,
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  getData(data: SlidesOutputData) {
    console.log('Slides:', data);
  }

  ngOnChanges(): void {
    if (!this.kiOffers || this.kiOffers.length < 1) {
      this.sliderIsVisible = false;
    } else {
      this.sliderData = this.kiOffers.map((item) => {
        return {
          id: item.id,
          title: item.title,
          image: item.image,
          sliderid: item.id.toString(),
        };
      });
      this.sliderIsVisible = true;
      console.log('Module mit KI: ', this.sliderData);
    }

  }

  next() {
    console.log('Owl', this.owlCarousel);
  }

  prev() {
    console.log('Owl', this.owlCarousel);
  }
}
