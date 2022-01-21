import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { OfferShortListForTiles } from 'src/app/core/models/offer';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-coursecarousel',
  templateUrl: './coursecarousel.component.html',
  styleUrls: ['./coursecarousel.component.scss'],
})
export class CoursecarouselComponent implements OnInit, OnDestroy {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  @ViewChild('coursecarousel') coursecarousel: ElementRef;

  private onOffersChange: Subscription;
  loadedOffers: OfferShortListForTiles[] = [];

  resizeObservable$: Observable<Event>;
  resizeSubscription: Subscription;
  tilewidth: number = 220;
  tilemargin: number = 16;
  tileshow: number = 0;
  scrollwidth: number = 1;
  carouselWidth: number = 0;
  called: boolean = false;

  constructor(private offerDataService: OfferDataService, private staticConfig: StaticService) {}

  ngOnInit(): void {
    // Hier werden aktuell alle 20 neuesten Offer angezeigt
    this.onOffersChange = this.offerDataService.getOffersForCourseCarousel().subscribe({
      next: (offersForTiles) => {
        this.loadedOffers = offersForTiles;

        // trigger resize event to set tile width as soon as offers are loaded
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      },
      error: (error: Error) => {
        // Handle Data
        this.loadedOffers = [];
      },
    });

    // set tile width on each window resize event and reset position to 0
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable$.subscribe((evt) => {
      this.carouselWidth = this.coursecarousel.nativeElement.offsetWidth;
      this.coursecarousel.nativeElement.scrollLeft = 0;
      this.setTileWidth();
    });
  }

  ngOnDestroy(): void {
    this.onOffersChange.unsubscribe();
    this.resizeSubscription.unsubscribe();
  }

  setTileWidth(): number {
    let width = document.documentElement.clientWidth;

    // bootstrap breakpoints
    if (width >= 1300) {
      this.tileshow = 5;
    } else if (width >= 1030) {
      this.tileshow = 4;
    } else if (width >= 820) {
      this.tileshow = 3;
    } else if (width >= 576) {
      this.tileshow = 2;
    } else if (width < 576) {
      this.tileshow = 1;
    }

    this.tilewidth = this.getTileWidth();

    return this.tilewidth;
  }

  getTileWidth(forScroll: boolean = false): number {
    let res = (Math.floor(this.carouselWidth) + this.tilemargin) / this.tileshow - this.tilemargin;
    let width = document.documentElement.clientWidth;

    if (forScroll) {
      if (width >= 768) {
        let w = (res + this.tilemargin) * 2;
        res = w;
      } else {
        let w = res + this.tilemargin;
        res = w;
      }
    }

    return Math.floor(res);
  }

  scrollLeft(): void {
    let elem = this.coursecarousel.nativeElement;

    if (elem.scrollLeft === 0) {
      let carousel = document.querySelector('.fs-car-tiles');
      let childcount = carousel.querySelectorAll('.fs-car-tile').length;
      this.coursecarousel.nativeElement.scrollLeft += this.getTileWidth(true) * childcount;
    } else {
      this.coursecarousel.nativeElement.scrollLeft -= this.getTileWidth(true);
    }
  }

  scrollRight(): void {
    let elem = this.coursecarousel.nativeElement;

    if (elem.scrollLeft + elem.offsetWidth === elem.scrollWidth) {
      elem.scrollLeft = 0;
    } else {
      elem.scrollLeft += this.getTileWidth(true);
    }
  }

  onSwipeRight(event, data) {
    this.scrollLeft();
  }

  onSwipeLeft(event, data) {
    this.scrollRight();
  }
}
