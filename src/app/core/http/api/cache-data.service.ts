import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { map} from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api/api.service';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { PartialOffer } from 'src/app/core/models/offer';
import { OfferPropertyItemResponse, OfferPropertyTagResponse } from './api.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CachedDataService {

  /**
   * OfferList
   */
  private offerShortList$: AsyncSubject<any>;
  /**
   * PropertyList
   */
  private offerPropertyList$: AsyncSubject<any>;
  constructor(private apiService: ApiService) {}

  ////////////////////////////////////////////////
  // Offers
  ////////////////////////////////////////////////
  public loadShortOfferList(): Observable<PartialOffer[]> {
    return new Observable((observer$) => {
      if (!this.offerShortList$) {
        this.offerShortList$ = new AsyncSubject();
        this.apiService.getAllOfferShortList().subscribe(this.offerShortList$);
      }
      return this.offerShortList$.subscribe(observer$);
    });
  }

  ////////////////////////////////////////////////
  // Properties
  ////////////////////////////////////////////////
  public loadOfferProperties(): Observable<OfferPropertyList[]> {
    return new Observable((observer$) => {
      if (!this.offerPropertyList$) {
        this.offerPropertyList$ = new AsyncSubject();
        this.apiService.getOfferProperties().pipe(
          map((data: OfferPropertyTagResponse) => {
            const propArray: OfferPropertyItemResponse[] = data.filter;
            return this.mapMetaDataToPropertyList_de(propArray);
          })
        ).subscribe(this.offerPropertyList$);
      }
      return this.offerPropertyList$.subscribe(observer$);
    });
  }
  private mapMetaDataToPropertyList_de(dataArray): OfferPropertyList[] {
    return dataArray.map((item: OfferPropertyItemResponse) => {
      const tempList = item.list.map((listItem) => {
        return {
          id: listItem.id,
          identifier: listItem.identifier,
          description: listItem.description.de,
        };
      });
      return new OfferPropertyList(item.tag, tempList);
    });
  }
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
}
