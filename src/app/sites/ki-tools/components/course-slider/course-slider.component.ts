import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { StaticService } from 'src/app/config/static.service';
import { SmallOfferDetailData } from 'src/app/core/models/offer';

type SliderData = {
  id: number;
  title: string;
  image: string;
  crop?: string;
  sliderid: string;
};

@Component({
  selector: 'fs-course-slider',
  templateUrl: './course-slider.component.html',
  styleUrls: ['./course-slider.component.scss'],
})
export class CourseSliderComponent implements OnInit, OnChanges {
  @Input() kiOffers: SmallOfferDetailData[] = [];
  @ViewChild('owlCarousel') owlCar: CarouselComponent;
  @ViewChild('courseCarousel') courseCarousel: ElementRef;

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  sliderIsVisible: boolean = false;
  sliderData: SliderData[] = [];
  tileWidth = 200;
  isDragging: boolean;

  customOptions: OwlOptions = {
    skip_validateItems: false,
    loop: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    slideBy: 1,
    center: false,
    items: 6,
    margin: 5,
    autoWidth: true,
    navText: [
      "<div class='owl-carousel-custom-btn owl-prev-slide'></div>",
      "<div class='owl-carousel-custom-btn owl-next-slide'></div>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
    nav: true,
  };

  constructor(private staticConfig: StaticService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (!this.kiOffers || this.kiOffers.length < 1) {
      this.sliderIsVisible = false;
    } else {
      this.sliderData = this.kiOffers.map((item) => {
        return {
          id: item.id,
          title: item.title,
          crop: this.cropTextLength(item.title, 75),
          image: item.image,
          sliderid: item.id.toString(),
        };
      });
      this.sliderIsVisible = true;
    }
  }

  ngOnDestroy(): void {}

  private cropTextLength(str: string, length: number): string {
    return str.length <= length ? str : str.substr(0, length) + '\u2026';
  }
}
