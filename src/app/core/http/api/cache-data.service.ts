import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

  public institutionMap = new Map<number, string>();
  public languageMap = new Map<number, string>();
  public formatMap = new Map<number, string>();
  public competencesMap = new Map<string, number>();

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
        this.apiService
          .getOfferProperties()
          .pipe(
            tap((values) => this.createPropertyTextMaps(values.filter)),
            map((data: OfferPropertyTagResponse) => {
              const propArray: OfferPropertyItemResponse[] = data.filter;
              return this.mapMetaDataToPropertyList_de(propArray);
            })
          )
          .subscribe(this.offerPropertyList$);
      }
      return this.offerPropertyList$.subscribe(observer$);
    });
  }
  private mapMetaDataToPropertyList_de(
    dataArray: OfferPropertyItemResponse[]
  ): OfferPropertyList[] {
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
  private createPropertyTextMaps(properties: OfferPropertyItemResponse[]) {
    const propertyList_de = this.mapMetaDataToPropertyList_de(properties);

    const institutionsProp = propertyList_de.find((value) => value.type == 'institutions').list;
    const languagesProp = propertyList_de.find((value) => value.type == 'languages').list;
    const competencesProp = propertyList_de.find((value) => value.type == 'competences').list;
    const formatsProp = propertyList_de.find((value) => value.type == 'formats').list;

    institutionsProp.forEach((item) => this.institutionMap.set(item.id, item.identifier));
    languagesProp.forEach((item) => this.languageMap.set(item.id, item.identifier));
    formatsProp.forEach((item) => this.formatMap.set(item.id, item.identifier));
    competencesProp.forEach((item) => this.competencesMap.set(item.identifier, item.id));
  }

  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
}
