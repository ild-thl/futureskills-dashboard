import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api/api.service';
import { SmallOfferDetailData } from 'src/app/core/models/offer';
import { StaticService } from 'src/app/config/static.service';
import { DataMapping } from './data-mapping';
import { APIToOfferShortList } from './api.interfaces';

////////////////////////////////////////////////
// Neuer Cache nach der Umstellung
////////////////////////////////////////////////

@Injectable({
  providedIn: 'root',
})
export class DataCacheService {
  /**
   * KISuperCourseLIst Cache
   */
  private coursePlaygroundKI$: AsyncSubject<any>;
  private courseLandingList$: AsyncSubject<any>;

  constructor(private apiService: ApiService, private staticService: StaticService) {}

  ////////////////////////////////////////////////
  // Offers
  ////////////////////////////////////////////////

  // TODO -> Pagination

  ////////////////////////////////////////////////
  // Offer-Properties
  ////////////////////////////////////////////////

  // TODO

  ////////////////////////////////////////////////
  // Offer - SpecialFilterLists
  ////////////////////////////////////////////////

  // Playground - Carousel
  ////////////////////////////////////////////////
  public loadKISuperCoursesDetailList(): Observable<SmallOfferDetailData[]> {
    return new Observable((observer$) => {
      if (!this.coursePlaygroundKI$) {
        this.coursePlaygroundKI$ = new AsyncSubject();
        this.apiService
          .getOfferSubListWithKeyWords(this.staticService.getKeyForPlaygroundKiCourse())
          .pipe(
            map((results) => {
              return DataMapping.mapDataInSmallOfferDetailData(results);
            })
          )
          .subscribe(this.coursePlaygroundKI$);
      }
      return this.coursePlaygroundKI$.subscribe(observer$);
    });
  }

  // Landing-Page Carousel
  ////////////////////////////////////////////////
  public loadLandingCarouselList(): Observable<APIToOfferShortList[]> {
    return new Observable((observer$) => {
      if (!this.courseLandingList$) {
        this.courseLandingList$ = new AsyncSubject();
        this.apiService
          .getOfferNewest()
          .subscribe(this.courseLandingList$);
      }
      return this.courseLandingList$.subscribe(observer$);
    });
  }
}
