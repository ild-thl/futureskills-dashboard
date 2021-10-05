import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api/api.service';
import { SmallOfferDetailData, SmallOfferListForEditForm } from 'src/app/core/models/offer';
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
  // KISuperCourseLIst Cache
  private coursePlaygroundKI$: AsyncSubject<any>;
  // CourseLandingLIst
  private courseLandingList$: AsyncSubject<any>;
  // OfferList for EditPage
  private offerShortListForEditDetail$: AsyncSubject<any>;

  constructor(private apiService: ApiService, private staticService: StaticService) {}

  ////////////////////////////////////////////////
  // Offers
  ////////////////////////////////////////////////

  // All in Small-List For EditComponent
  ////////////////////////////////////////////////
  public loadAllShortOffersListForEditDetail(): Observable<SmallOfferListForEditForm[]> {
    return new Observable((observer$) => {
      if (!this.offerShortListForEditDetail$) {
        this.offerShortListForEditDetail$ = new AsyncSubject();
        this.apiService
          .getAllOfferShortList()
          .pipe(
            map((results) => {
              return DataMapping.mapDataInSmallOfferDetailEditData(results);
            })
          )
          .subscribe(this.offerShortListForEditDetail$);
      }
      return this.offerShortListForEditDetail$.subscribe(observer$);
    });
  }

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
              return DataMapping.mapDataInSmallOfferDetailEditData(results);
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
        this.apiService.getOfferNewest().subscribe(this.courseLandingList$);
      }
      return this.courseLandingList$.subscribe(observer$);
    });
  }
}
