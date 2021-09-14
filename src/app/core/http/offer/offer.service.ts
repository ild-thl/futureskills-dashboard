import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from 'src/app/core/http/api/api.service';
import { OfferPropertyCache } from 'src/app/core/http/api/offer-property-cache.service';

import { OfferToAPI } from 'src/app/core/http/api/api.interfaces';
import { Offer, PartialOffer } from 'src/app/core/models/offer';
import { LOAD, ADD, EDIT, REMOVE, OfferStore } from 'src/app/core/http/store/offer.store';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';

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
  offers$: BehaviorSubject<Offer[]>;
  //offerChanged$ = new BehaviorSubject({});

  constructor(
    private apiService: ApiService,
    private offerStore: OfferStore,
    private offerPropertyCache: OfferPropertyCache
  ) {
    this.offers$ = offerStore.items$;
  }

  /**
   * preloads OfferShortList (OfferTiles)
   * only call once in data-handler
   * @returns
   */
  preloadAllOfferShortList(): any {
    const property$ = this.offerPropertyCache.loadOfferProperties();
    const shortOffer$ = this.offerPropertyCache.loadShortOfferList();

    // Parallel laden, aber erst auswerten wenn beide completed sind
    forkJoin([shortOffer$, property$])
      .pipe(
        tap((results) => {
          let offers = this.mapDataInOfferStructure(results[0]);
          this.offerStore.dispatch({ type: LOAD, data: offers });
        })
      )
      .subscribe(
        (offers) => {
          console.log('Offers(short) geladen', offers);
        },
        (error) => {
          console.log('getAllOfferShortList_error:', error);
          let message = error; // Anpassen wenn nötig
          this.offers$.error(message);
        },
        () => {
          console.log('getAllOfferShortList completed');
        }
      );

    return this.offers$;
  }

  /**
   * Gets Offer Structure with all Data
   * only call once in data-handler
   * @deprecated Use getAllOfferShortList
   * @returns
   */
   preloadAllOffers(): Observable<Offer[]> {
    const property$ = this.offerPropertyCache.loadOfferProperties();
    const longOffer$ = this.offerPropertyCache.loadLongOfferList();

    forkJoin([longOffer$, property$])
      .pipe(
        tap((results) => {
          let offers = results[0];
          for (const offerItem of offers) {
            offerItem.competence_text = this.createCompetenceString(offerItem.competences);
          }
          this.offerStore.dispatch({ type: LOAD, data: offers });
        })
      )
      .subscribe(
        (offers) => {
          console.log('Offers(long) geladen', offers);
        },
        (error) => {
          console.log('getAllOffer_Error:', error);
          let message = error; // Anpassen wenn nötig
          this.offers$.error(message);
        }
      );
    return this.offers$;
  }

  getOffer(id: number): Observable<Offer> {
    return this.apiService.getOffer(id);
  }

  getSubListOfferWithKeyword(keyword: string | string[]): Observable<Offer[]> {
    return this.apiService.getOfferSubListWithKeyWords(keyword);
  }

  storeOffer(data: OfferToAPI) {
    return this.apiService.postOffer(data).pipe(
      tap((savedOffer) => {
        console.log('New Offer:', savedOffer);
        // this.offerChanged$.next(savedOffer);
        savedOffer.competence_text = this.createCompetenceString(savedOffer.competences);
        const action = { type: ADD, data: savedOffer };
        this.offerStore.dispatch(action);
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
        // this.offerChanged$.next(savedOffer);
        console.log('Updated Offer:', savedOffer);
        savedOffer.competence_text = this.createCompetenceString(savedOffer.competences);
        const action = { type: EDIT, data: savedOffer };
        this.offerStore.dispatch(action);
      })
    );
  }

  deleteOffer(offer: Offer) {
    console.log('Delete Offer:' + offer.id);
    return this.apiService.deleteOffer(offer.id).pipe(
      tap((_) => {
        const action = { type: REMOVE, data: offer };
        this.offerStore.dispatch(action);
      })
    );
  }

  clearStoreData() {
    this.offerStore.dispatch({ type: LOAD, data: null });
  }


  public getOfferProperties(): Observable<Map<string, OfferPropertyList>>{
    return this.offerPropertyCache.loadOfferProperties();
  }

  public createCompetenceString(competences: number[]) : string {
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
    switch(text){
      case 'tech': return 'Tech';
      case 'digital': return 'Digital Basic';
      case 'classic': return 'Classic';
      default: return 'NA';
    }
  }

  mapDataInOfferStructure(offers: Partial<Offer>[]): Partial<Offer>[] {
    for (const offerItem of offers) {
      offerItem.institution = {
        id: offerItem.institution_id,
        title: this.offerPropertyCache.institutionMap.get(offerItem.institution_id),
        url: undefined,
      };
      offerItem.language = this.offerPropertyCache.languageMap.get(offerItem.language_id);
      offerItem.type = this.offerPropertyCache.formatMap.get(offerItem.offertype_id);
      offerItem.competence_text = this.createCompetenceString(offerItem.competences);
    }
    return offers;
  }


}
