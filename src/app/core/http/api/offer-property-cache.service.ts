import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api/api.service';
import { OfferPropertyList, PropertyItem } from 'src/app/core/models/offer-properties';
import { PartialOffer } from 'src/app/core/models/offer';
import { OfferPropertyItemResponse, OfferPropertyTagResponse } from './api.interfaces';

/**
 * OfferPropertyCache
 * Loads Offer and Property as Async Subject Once
 */

@Injectable({
  providedIn: 'root',
})
export class OfferPropertyCache {
  /**
   * OfferList
   */
  private offerShortList$: AsyncSubject<any>;
  private offerLongList$: AsyncSubject<any>;
  /**
   * PropertyList
   */
  private offerPropertyList$: AsyncSubject<any>;
  private propertyMap = new Map<string, OfferPropertyList>();

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

  public loadLongOfferList(): Observable<PartialOffer[]> {
    return new Observable((observer$) => {
      if (!this.offerLongList$) {
        this.offerLongList$ = new AsyncSubject();
        this.apiService.getAllOffers().subscribe(this.offerLongList$);
      }
      return this.offerLongList$.subscribe(observer$);
    });
  }

  ////////////////////////////////////////////////
  // Properties
  ////////////////////////////////////////////////
  public loadOfferProperties(): Observable<Map<string, OfferPropertyList>> {
    return new Observable((observer$) => {
      if (!this.offerPropertyList$) {
        this.offerPropertyList$ = new AsyncSubject();
        this.apiService
          .getOfferProperties()
          .pipe(
            map((data: OfferPropertyTagResponse) => {
              const propertyList = this.mapMetaDataToPropertyList_de(data.filter);
              for (var filterItem of propertyList) {
                this.propertyMap.set(filterItem.type, filterItem);
              }
              this.createPropertyTextMaps(this.propertyMap);
              return this.propertyMap;
            })
          )
          .subscribe(this.offerPropertyList$);
      }
      return this.offerPropertyList$.subscribe(observer$);
    });
  }

  ////////////////////////////////////////////////
  // Map Properties tp data structures
  ////////////////////////////////////////////////

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

  private createPropertyTextMaps(propertyMap_de: Map<string, OfferPropertyList>) {
    const institutionsProp = propertyMap_de.get('institutions').list;
    const languagesProp = propertyMap_de.get('languages').list;
    const competencesProp = propertyMap_de.get('competences').list;
    const formatsProp = propertyMap_de.get('formats').list;

    for (const institution of institutionsProp) {
      this.institutionMap.set(institution.id, institution.identifier);
    }
    for (const language of languagesProp) {
      this.languageMap.set(language.id, language.identifier);
    }
    for (const format of formatsProp) {
      this.formatMap.set(format.id, format.identifier);
    }
    for (const comp of competencesProp) {
      this.competencesMap.set(comp.identifier, comp.id);
    }
  }

  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
}
