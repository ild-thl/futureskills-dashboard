import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api/api.service';
import { StaticService } from 'src/app/config/static.service';

import {
  OfferToAPI,
  PaginatedOfferDataFromAPI,
} from 'src/app/core/http/api/api.interfaces';
import {
  Offer,
  OfferShortListForTiles,
  PaginatedOfferData,
  SmallOfferDetailData,
  SmallOfferListForEditForm,
} from 'src/app/core/models/offer';
import { DataCacheService } from 'src/app/core/http/api/data-cache.service';
import { DataMapping } from 'src/app/core/http/api/data-mapping';

/**
 * offer.service.ts
 * Contains OfferData (in offer.store) and functions
 * Subscribe to offer$ to get data and changes
 * 30.10.2020
 */

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  constructor(
    private apiService: ApiService,
    private dataCacheService: DataCacheService,
    private staticService: StaticService
  ) {}

  ////////////////////////////////////////////////
  // Offers-List (with Mapping)
  ////////////////////////////////////////////////

  // for Pagination
  ////////////////////////////////////////////////
  getPaginatedOfferData(page: number, count: number): Observable<PaginatedOfferData> {
    const propertyID$ = this.dataCacheService.getPropertyIDMap();
    const paginatedOffers$ = this.apiService.getPaginatedOfferShortList(page, count);

    // Parallel laden, aber erst auswerten wenn beide completed sind
    return forkJoin([paginatedOffers$, propertyID$]).pipe(
      map((results) => {
        const paginated: PaginatedOfferDataFromAPI = results[0];
        const propertyIds = results[1];
        let offers = DataMapping.mapMetaPaginationStructure(paginated, propertyIds);
        console.log('PaginatedOffers: ', offers);
        return offers;
      })
    );
  }

  // for EditComponent for Related Lists
  ////////////////////////////////////////////////
  public getAllShortOffersListForEditDetail(
    offerID: number = undefined,
    cached: boolean = true
  ): Observable<SmallOfferListForEditForm[]> {
    const shortOfferForDetail$ = this.dataCacheService.loadAllShortOffersListForEditDetail();
    return shortOfferForDetail$.pipe(
      map((offerData) => {
        if (offerID) {
          offerData = offerData.filter((data) => {
            return data.id !== offerID;
          });
        }
        return offerData;
      })
    );
  }

  ////////////////////////////////////////////////
  // Special Filtered Offers
  ////////////////////////////////////////////////

  // Latest Courses
  // for Landing-Carousel
  ////////////////////////////////////////////////
  public getShortOffersNewest(cached: boolean = true): Observable<OfferShortListForTiles[]> {
    const propertyID$ = this.dataCacheService.getPropertyIDMap();
    const newestOffer$ = this.dataCacheService.loadLandingCarouselList();

    // Parallel laden, aber erst auswerten wenn beide completed sind
    return forkJoin([newestOffer$, propertyID$]).pipe(
      map((results) => {
        return DataMapping.mapDataInOfferStructure(results[0], results[1]);
      })
    );
  }

  // KISuperCourse (cached) Mini-List
  // for Detail and Carousel
  ////////////////////////////////////////////////
  public getKISuperCoursesDetailList(cached: boolean = true): Observable<SmallOfferDetailData[]> {
    if (cached) {
      return this.dataCacheService.loadKISuperCoursesDetailList();
    } else {
      return this.apiService
        .getOfferSubListWithKeyWords(this.staticService.getKeyForPlaygroundKiCourse())
        .pipe(
          map((results) => {
            return DataMapping.mapDataInSmallOfferDetailData(results);
          })
        );
    }
  }

  ////////////////////////////////////////////////
  // Offer (get/save/del)
  ////////////////////////////////////////////////

  getOffer(id: number): Observable<Offer> {
    return this.apiService.getOffer(id);
  }

  storeOffer(data: OfferToAPI) {
    return this.apiService.postOffer(data).pipe(
      tap((savedOffer) => {
        console.log('New Offer:', savedOffer);
      })
    );
  }

  updateOffer(id: number, data: OfferToAPI) {
    return this.apiService.putOffer(id, data).pipe(
      tap((savedOffer) => {
        console.log('Updated Offer:', savedOffer);
      })
    );
  }

  deleteOffer(offer: Offer) {
    console.log('Delete Offer:' + offer.id);
    return this.apiService.deleteOffer(offer.id).pipe(tap((_) => {}));
  }
}
