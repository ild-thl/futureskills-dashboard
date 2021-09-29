import { DataMappingService } from './data-map.service';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api/api.service';
import { SmallOfferDetailData } from 'src/app/core/models/offer';
import { StaticService } from 'src/app/config/static.service';

@Injectable({
  providedIn: 'root',
})
export class DataCacheService {
  /**
   * KISuperCourseLIst Cache
   */
  private courseSuperKI$: AsyncSubject<any>;
  constructor(
    private apiService: ApiService,
    private staticService: StaticService,
    private dataMapService: DataMappingService
  ) {}

  ////////////////////////////////////////////////
  // Offers
  ////////////////////////////////////////////////

  // TODO -> Pagination

  ////////////////////////////////////////////////
  // Offer-Properties
  ////////////////////////////////////////////////

  // TODO

  ////////////////////////////////////////////////
  // Offer - SpecialFilterList
  ////////////////////////////////////////////////

  // KISuperCourse
  ////////////////////////////////////////////////
  public loadKISuperCoursesDetailList(): Observable<SmallOfferDetailData[]> {
    return new Observable((observer$) => {
      if (!this.courseSuperKI$) {
        this.courseSuperKI$ = new AsyncSubject();
        this.apiService
          .getOfferSubListWithKeyWords(this.staticService.getKeyForSuperKICourse())
          .pipe(
            map((results) => {
              return this.dataMapService.mapDataInSmallOfferDetailData(results);
            })
          )
          .subscribe(this.courseSuperKI$);
      }
      return this.courseSuperKI$.subscribe(observer$);
    });
  }
}
