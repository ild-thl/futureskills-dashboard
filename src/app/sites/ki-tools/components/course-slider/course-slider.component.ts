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
import { StaticService } from 'src/app/config/static.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  @ViewChild('owlCarousel') owlCar: ElementRef;

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  resizingEventSubscription: Subscription;

  sliderIsVisible: boolean = false;
  sliderData: SliderData[] = [];
  tileWidth = 200;
  isDragging: boolean;
  navVisible: boolean = true;

  customOptions: OwlOptions = {
    loop: false,
    // mouseDrag: false,
    // touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    slideBy: 1,
    center: false,
    items: 5,
    margin: 8,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      440: {
        items: 2,
      },
      576: {
        items: 3,
      },
      992: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
    nav: false,
  };

  constructor(private staticConfig: StaticService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
  }

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
          crop: this.cropTextLength(item.title, 80),
          image: item.image,
          sliderid: item.id.toString(),
        };
      });
      this.sliderIsVisible = true;
      console.log('Module mit KI: ', this.sliderData);
    }
  }

  ngOnDestroy(): void {
    if (this.resizingEventSubscription) this.resizingEventSubscription.unsubscribe();
  }

  private cropTextLength(str: string, length: number): string {
    return str.length <= length ? str : str.substr(0, length) + '\u2026';
  }

}
