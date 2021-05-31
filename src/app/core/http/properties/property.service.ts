import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api/api.service';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { OfferPropertyItemResponse, OfferPropertyTagResponse } from 'src/app/core/http/api/api.interfaces';


@Injectable({
  providedIn: 'root',
})
export class PropertyService {

  private offerPropertyList$: AsyncSubject<any>;
  constructor(private apiService: ApiService) {}

  public getOfferProperties(): Observable<OfferPropertyList[]> {
    return new Observable((observer$) => {
      if (!this.offerPropertyList$) {
        this.offerPropertyList$ = new AsyncSubject();
        this.apiService.getOfferProperties().pipe(
          map((data: OfferPropertyTagResponse) => {
            const propArray: OfferPropertyItemResponse[] = data.filter;
            const filterList = this.mapMetaDataToPropertyList_de(propArray);
            //console.log('New Offer Property List: ', filterList);
            return filterList;
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

}
