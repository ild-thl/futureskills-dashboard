import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { OfferDataService } from 'src/app/core/http/data/offer/offer-data.service';
import { Offer } from 'src/app/shared/models/offer';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-coursecarousel',
  templateUrl: './coursecarousel.component.html',
  styleUrls: ['./coursecarousel.component.scss']
})
export class CoursecarouselComponent implements OnInit, OnDestroy {

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  @ViewChild('coursecarousel') coursecarousel: ElementRef;

  private onOffersChange: Subscription;
  loadedOffers: Offer[] = [];

  tilewidth: number = 220; // css: min-width

  constructor(private offerDataService: OfferDataService, private staticConfig: StaticService) {}

  ngOnInit(): void {
    // Todo: Hier werden aktuell alle Offers angezeigt
    this.onOffersChange = this.offerDataService
      .getOffersForCourseCarousel()
      .subscribe(
        (offersForTiles) => {
          this.loadedOffers = offersForTiles;
        },
        (error) => {
          // Handle Data
          console.log('Error in CarouselList: ', error);
          this.loadedOffers = [];
        }
      );
  }

  ngOnDestroy(): void {
    this.onOffersChange.unsubscribe();
  }

  scrollLeft(): void {
    this.coursecarousel.nativeElement.scrollLeft -= this.getScrollWidth();
  }

  scrollRight(): void {
    this.coursecarousel.nativeElement.scrollLeft += this.getScrollWidth();
  }

  getScrollWidth(): number {
    if (document.documentElement.clientWidth >= 1000) {
      return this.tilewidth * 4 + 16 * 4;
    }
    return this.tilewidth + 16;
  }
}
