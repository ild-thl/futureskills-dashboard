import { Injectable } from '@angular/core';
import { Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { MiniOffersData } from 'src/app/core/models/offer';

@Injectable()
export class CourseCacheService {
  private updateData$ = new Subject<void>();
  private courseCache$: Observable<MiniOffersData[]>;

  constructor(private offerDataService: OfferDataService) {}

  public updateCourseData() {
    this.updateData$.next();
    this.courseCache$ = null;
  }

  getManagementCourseList(): Observable<MiniOffersData[]> {
    if (!this.courseCache$) {
      this.courseCache$ = this.offerDataService.getSmallOfferListForManagement().pipe(
        takeUntil(this.updateData$),
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );
    }

    return this.courseCache$;
  }
}
