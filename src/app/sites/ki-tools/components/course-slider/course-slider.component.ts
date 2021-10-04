import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CarouselComponent, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { StaticService } from 'src/app/config/static.service';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SmallOfferDetailData } from 'src/app/core/models/offer';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';

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
  @ViewChild('owlCarousel') owlCar: CarouselComponent;
  @ViewChild('courseCarousel') courseCarousel: ElementRef;

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  resizingEventSubscription: Subscription;
  statusSeviceSubscription: Subscription;

  sliderIsVisible: boolean = false;
  sliderData: SliderData[] = [];
  tileWidth = 200;
  minTileWidth: number;
  isDragging: boolean;
  navLeftEnabled: boolean;
  navRightEnabled: boolean;
  slideCount: number;

  customOptions: OwlOptions = {
    skip_validateItems: false,
    loop: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    slideBy: 1,
    center: false,
    items: 6,
    margin: 5,
    autoWidth: true,
    nav: false,
  };

  private SliderStatusOK$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private coursesAreLoaded = false;
  private carouselISInitialized = false;

  constructor(
    private staticConfig: StaticService,
    @Inject(DOCUMENT) private document: Document,
    private statusService: KiStatusService,
    private cd: ChangeDetectorRef
  ) {
    this.slideCount = 0;
    this.navRightEnabled = false;
    this.navLeftEnabled = false;
  }

  ngOnInit(): void {
    this.minTileWidth = this.tileWidth + 2 * this.customOptions.margin;
    this.listenToWindowsResize();

    this.statusSeviceSubscription = this.SliderStatusOK$.subscribe((value) => {
      if (value) {
        console.log('KI-Superkurse gefunden: ', this.sliderData, 'Count:', this.slideCount);
        this.setNavBarButtons();
      }
    });
  }

  ngAfterViewInit(): void {
    this.carouselIsLoaded(true);
    this.cd.detectChanges();
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
      this.slideCount = this.sliderData.length;
      this.courseDataIsLoaded(true);
    }
  }

  ngOnDestroy(): void {
    if (this.resizingEventSubscription) this.resizingEventSubscription.unsubscribe();
    if (this.statusSeviceSubscription) this.statusSeviceSubscription.unsubscribe();
    this.statusReset();
  }

  onTranslated(data: SlidesOutputData) {
    this.setNavBarButtons();
  }

  private listenToWindowsResize() {
    this.resizingEventSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .subscribe((evt) => {
        this.setNavBarButtons();
      });
  }

  private setNavBarButtons() {
    if (this.owlCar) {
      const startPos = this.owlCar.slidesOutputData.startPosition;
      const visible = this.getNavButton(startPos);
      this.navLeftEnabled = visible.left;
      this.navRightEnabled = visible.right;
    }
  }

  /**
   * Nav Buttons-Sichtbarkeit
   * @param startPos
   * @returns
   */
  private getNavButton(startPos: number): { left: boolean; right: boolean } {
    let left = false;
    let right = false;
    const offerCount = this.slideCount;

    // nur ein Kurs
    if (offerCount < 2) return { left, right };

    const visibleTileItems = this.calculateTileCount();
    const isAllVisible = visibleTileItems == offerCount;

    // alle sichtbar
    if (isAllVisible) return { left, right };

    // steht auf Anfang
    left = !(startPos == 0);

    // steht auf Ende? Sonst rechnen
    const isEndPosition = offerCount - startPos == visibleTileItems;
    right = isEndPosition == true ? false : visibleTileItems < offerCount ? true : false;

    // console.log('VisibleItems: ', visibleTileItems, 'count:', offerCount);
    // console.log('isStartPosition', startPos);
    // console.log('isEndPosition?', isEndPosition);
    // console.log('isAllVisible?', isAllVisible);

    return { left, right };
  }

  /**
   * Calculates numbers of tiles in Carousel
   * @returns
   */
  private calculateTileCount(): number {
    let carWidth = this.courseCarousel.nativeElement.offsetWidth;
    let tileCount = 1;

    if (carWidth && carWidth > 0 && this.minTileWidth > 0) {
      const temp = carWidth / this.minTileWidth;
      //console.log('Carousel Width:', carWidth, 'TilesFitIn:', temp.toFixed(2));
      tileCount = Math.floor(carWidth / this.minTileWidth);
    } else {
      // If width of Element Carousel is unknown -> use document-width and breakpoints
      const width = this.document.documentElement.clientWidth;
      if (width >= 1200) {
        tileCount = 5;
      } else if (width >= 1200) {
        tileCount = 4;
      } else if (width >= 992) {
        tileCount = 4;
      } else if (width >= 768) {
        tileCount = 3;
      } else if (width >= 576) {
        tileCount = 2;
      } else if (width >= 440) {
        tileCount = 2;
      } else if (width < 440) {
        tileCount = 1;
      }
      // console.log('Doc Width:', width, 'TilesFitIn:', tileCount);
    }
    return tileCount;
  }

  private cropTextLength(str: string, length: number): string {
    return str.length <= length ? str : str.substr(0, length) + '\u2026';
  }

    /**
   * Detect changes
   * @param value
   */
     private courseDataIsLoaded(value: boolean) {
      this.coursesAreLoaded = value;
      const ret = this.coursesAreLoaded && this.carouselISInitialized ? true : false;
      this.SliderStatusOK$.next(ret);
    }
    private carouselIsLoaded(value: boolean) {
      this.carouselISInitialized = value;
      const ret = this.coursesAreLoaded && this.carouselISInitialized ? true : false;
      this.SliderStatusOK$.next(ret);
    }
    private statusReset() {
      console.log('KIplayground Status Reset');
      this.carouselISInitialized = false;
      this.carouselISInitialized = false;
      this.SliderStatusOK$.next(false);
    }
}
