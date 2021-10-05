import { StaticService } from 'src/app/config/static.service';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiService } from 'src/app/core/http/api/api.service';
import { OfferPropertyCache } from 'src/app/core/http/api/offer-property-cache.service';

import {
  APIToOfferShortList,
  OfferToAPI,
  PaginatedOfferDataFromAPI,
} from 'src/app/core/http/api/api.interfaces';
import {
  Offer,
  OfferShortListForTiles,
  PaginatedOfferData,
  PartialOffer,
  SmallOfferDetailData,
  SmallOfferListForEditForm,
} from 'src/app/core/models/offer';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { DataCacheService } from '../api/data-cache.service';
import { DataMapping } from '../api/data-mapping';

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
    private offerPropertyCache: OfferPropertyCache,
    private dataCacheService: DataCacheService,
    private staticService: StaticService
  ) {}

  ////////////////////////////////////////////////
  // Offers-List (with Mapping)
  ////////////////////////////////////////////////

  // for Pagination
  ////////////////////////////////////////////////
  getPaginatedOfferData(page?: number, count?: number): Observable<PaginatedOfferData> {
    const paginatedOffers$ = this.apiService.getPaginatedOfferShortList(page, count);
    const property$ = this.offerPropertyCache.loadOfferProperties();
    // Parallel laden, aber erst auswerten wenn beide completed sind
    return forkJoin([paginatedOffers$, property$]).pipe(
      map((results) => {
        const paginated: PaginatedOfferDataFromAPI = results[0];
        let offers = this.mapMetaPaginationStructure(paginated);
        console.log('PaginatedOffers: ', offers);
        console.log('Properties: ', results[1]);
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
    const property$ = this.offerPropertyCache.loadOfferProperties();
    const newestOffer$ = this.dataCacheService.loadLandingCarouselList();
    // Parallel laden, aber erst auswerten wenn beide completed sind
    return forkJoin([newestOffer$, property$]).pipe(
      map((results) => {
        const temp = this.mapDataInOfferStructure(results[0]);
        console.log('Newest Offers:', temp);
        return temp;
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
            return this.mapDataInSmallOfferDetailData(results);
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
        savedOffer.competence_text = this.createCompetenceString(savedOffer.competences);
      })
    );
  }

  // Angedacht für die Sortierungsliste.
  storePartialOfferList(offerList: PartialOffer[]) {
    const sentList = offerList.filter((offer) => offer.id !== null);
    return this.apiService.updatePartialOfferList(sentList).pipe(
      tap((savedOffers) => {
        // TODO: Einzelne Datensätze updaten oder besser die Datensätze neu laden
      })
    );
  }

  updateOffer(id: number, data: OfferToAPI) {
    console.log('Update OfferFormData:', data);
    return this.apiService.putOffer(id, data).pipe(
      tap((savedOffer) => {
        console.log('Updated Offer:', savedOffer);
        savedOffer.competence_text = this.createCompetenceString(savedOffer.competences);
      })
    );
  }

  deleteOffer(offer: Offer) {
    console.log('Delete Offer:' + offer.id);
    return this.apiService.deleteOffer(offer.id).pipe(tap((_) => {}));
  }


  ////////////////////////////////////////////////
  // Properties
  ////////////////////////////////////////////////

  public getOfferProperties(): Observable<Map<string, OfferPropertyList>> {
    return this.offerPropertyCache.loadOfferProperties();
  }

  public createCompetenceString(competences: number[]): string {
    let competenceArr = [];
    let competenceStr = '';

    if (competences.length == 0) {
      competenceStr = 'keine Angabe';
    } else {
      for (const competence of competences) {
        const competenceText = this.offerPropertyCache.competencesMap.get(competence);
        competenceArr.push(this.compworkaroundForText(competenceText));
      }
      competenceStr = competenceArr.join(', ');
    }
    return competenceStr;
  }

  /**
   * Die Funktion sorgt dafür dass die Kompetenztexte so angezeigt werden wie vorher
   * Todo: Besser die einheitliche Description benutzen (siehe offer-property-cache.service)
   * Die ist im Moment recht lang (siehe Texte in den Filtern)
   * @param text
   * @returns
   */
  private compworkaroundForText(text: string): string {
    switch (text) {
      case 'tech':
        return 'Tech';
      case 'digital':
        return 'Digital Basic';
      case 'classic':
        return 'Classic';
      default:
        return 'NA';
    }
  }

  mapMetaPaginationStructure(paginatedData: PaginatedOfferDataFromAPI): PaginatedOfferData {
    return {
      data: this.mapDataInOfferStructure(paginatedData.data),
      current_page: paginatedData.current_page,
      first_page_url: paginatedData.first_page_url,
      from: paginatedData.from,
      last_page: paginatedData.last_page,
      last_page_url: paginatedData.last_page_url,
      next_page_url: paginatedData.next_page_url,
      path: paginatedData.path,
      per_page: paginatedData.per_page,
      prev_page_url: paginatedData.prev_page_url,
      to: paginatedData.to,
      total: paginatedData.total,
    };
  }

  mapDataInOfferStructure(offers: APIToOfferShortList[]): OfferShortListForTiles[] {
    //console.log('API OFFER:', offers);
    let newOffer: OfferShortListForTiles[] = [];
    for (const offerItem of offers) {
      newOffer.push({
        id: offerItem.id,
        title: offerItem.title,
        image_path: offerItem.image_path,
        institution_id: offerItem.institution_id,
        institution: {
          id: offerItem.institution_id,
          title: this.offerPropertyCache.institutionMap.get(offerItem.institution_id),
          url: undefined,
        },
        offertype_id: offerItem.offertype_id,
        type: this.offerPropertyCache.formatMap.get(offerItem.offertype_id),
        language_id: offerItem.language_id,
        language: this.offerPropertyCache.languageMap.get(offerItem.language_id),
        competences: offerItem.competences,
        competence_text: this.createCompetenceString(offerItem.competences),
        keywords: offerItem.keywords,
      });
    }
    //console.log('Short OFFER:', newOffer);
    return newOffer;
  }

  /**
   * Returns only id/title/image
   * @param offers
   */
  public mapDataInSmallOfferDetailData(offers: APIToOfferShortList[]): SmallOfferDetailData[] {
    return DataMapping.mapDataInSmallOfferDetailEditData(offers);
  }

}
