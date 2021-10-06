import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api/api.service';
import { SmallOfferDetailData, SmallOfferListForEditForm } from 'src/app/core/models/offer';
import {
  OfferPropertyList,
  PropertyCompleteMap,
  PropertyIDMap,
  PropertyIDMapItem,
} from 'src/app/core/models/offer-properties';
import { StaticService } from 'src/app/config/static.service';
import { DataMapping } from './data-mapping';

import {
  APIToOfferShortList,
  OfferPropertyItemResponse,
  OfferPropertyTagResponse,
} from './api.interfaces';

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
  // PropertyList
  private offerPropertyList$: AsyncSubject<any>;
  private propertyIDMap$: AsyncSubject<any>;
  private propertyMap$: AsyncSubject<any>;

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
              const data = DataMapping.mapDataInSmallOfferDetailEditData(results);
              console.log("Offers(for Related) cached: ", data);
              return data;
            })
          )
          .subscribe(this.offerShortListForEditDetail$);
      }
      return this.offerShortListForEditDetail$.subscribe(observer$);
    });
  }

  ////////////////////////////////////////////////
  // Offers - SpecialFilterLists
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
              const data= DataMapping.mapDataInSmallOfferDetailEditData(results);
              console.log("KI-Courses cached: ", data);
              return data;
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
          .getOfferLatest()
          .pipe(tap((data) => {
            console.log("Offer (latest) cached: ", data);
          }))
          .subscribe(this.courseLandingList$);
      }
      return this.courseLandingList$.subscribe(observer$);
    });
  }

  ////////////////////////////////////////////////
  // Properties
  ////////////////////////////////////////////////

  public getPropertyIDMap(): Observable<PropertyIDMap> {
    return new Observable((observer$) => {
      if (!this.propertyIDMap$) {
        this.propertyIDMap$ = new AsyncSubject();

        this.loadProperties()
          .pipe(
            map((data: OfferPropertyTagResponse) => {
              const newData = this.mapIDToText(data.filter);
              console.log('Property-IDMaps cached: ', newData);
              return newData;
            })
          )
          .subscribe(this.propertyIDMap$);
      }
      return this.propertyIDMap$.subscribe(observer$);
    });
  }

  public getPropertyMap(): Observable<PropertyCompleteMap> {
    return new Observable((observer$) => {
      if (!this.propertyMap$) {
        this.propertyMap$ = new AsyncSubject();

        this.loadProperties()
          .pipe(
            map((data: OfferPropertyTagResponse) => {
              const propertyList = this.mapMetaDataToPropertyList_de(data.filter);
              const propertyMap = new Map<string, OfferPropertyList>();
              for (var filterItem of propertyList) {
                propertyMap.set(filterItem.type, filterItem);
              }
              console.log('Property-Map cached: ', propertyMap);
              return propertyMap;
            })
          )
          .subscribe(this.propertyMap$);
      }
      return this.propertyMap$.subscribe(observer$);
    });
  }

  private loadProperties(): Observable<any> {
    return new Observable((observer$) => {
      if (!this.offerPropertyList$) {
        this.offerPropertyList$ = new AsyncSubject();
        this.apiService.getOfferProperties().subscribe(this.offerPropertyList$);
      }
      return this.offerPropertyList$.subscribe(observer$);
    });
  }

  ////////////////////////////////////////////////
  // Map Properties data structures
  ////////////////////////////////////////////////

  private mapIDToText(dataArray: OfferPropertyItemResponse[]): PropertyIDMap {
    const institutionMap: PropertyIDMapItem = new Map<number, string>();
    const languageMap: PropertyIDMapItem = new Map<number, string>();
    const formatMap: PropertyIDMapItem = new Map<number, string>();
    const competencesMap: PropertyIDMapItem = new Map<number, string>();
    const propMap: PropertyIDMap = new Map<string, Map<number, string>>();

    for (var data of dataArray) {
      const tag = data.tag;
      switch (tag) {
        case 'institutions':
          data.list.map((item) => {
            institutionMap.set(item.id, item.identifier);
          });
          break;
        case 'languages':
          data.list.map((item) => {
            languageMap.set(item.id, item.identifier);
          });
          break;
        case 'competences':
          data.list.map((item) => {
            competencesMap.set(item.id, item.identifier);
          });
          break;
        case 'formats':
          data.list.map((item) => {
            formatMap.set(item.id, item.identifier);
          });
          break;
      }
    }
    propMap.set(this.staticService.getFilterParams().institutions, institutionMap);
    propMap.set(this.staticService.getFilterParams().languages, languageMap);
    propMap.set(this.staticService.getFilterParams().competences, competencesMap);
    propMap.set(this.staticService.getFilterParams().formats, formatMap);
    return propMap;
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
}
