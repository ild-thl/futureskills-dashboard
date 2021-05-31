import { Injectable } from '@angular/core';
import { AsyncSubject, BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from 'src/app/core/http/api/api.service';
import { CachedDataService } from 'src/app/core/http/api/cache-data.service';

import { OfferToAPI } from 'src/app/core/http/api/api.interfaces';
import { Offer, PartialOffer } from 'src/app/core/models/offer';
import { LOAD, ADD, EDIT, REMOVE, OfferStore } from 'src/app/core/http/store/offer.store';
import { PropertyItem } from 'src/app/core/models/offer-properties';

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
    private cachedDataService: CachedDataService
  ) {
    this.offers$ = offerStore.items$;
  }

  alt_getAllOffers(): Observable<Offer[]> {
    this.apiService
      .getAllOffers()
      .pipe(
        tap((offers) => {
          //this.offerStore.dispatch({ type: LOAD, data: offers });
        })
      )
      .subscribe(
        (offers) => {
          console.log('Offers geladen', offers);
        },
        (error) => {
          console.log('getAllOffer_Error:', error);
          let message = error; // Anpassen wenn nötig
          this.offers$.error(message);
        }
      );
    return this.offers$;
  }

  getAllOfferShortList(): any {
    const property$ = this.cachedDataService.loadOfferProperties();
    const shortOffer$ = this.cachedDataService.loadShortOfferList();

    // Parallel laden, aber erst auswerten wenn beide completed sind
    forkJoin([shortOffer$, property$])
      .pipe(
        tap((results) => {
          let offers = results[0];
          //console.log(results);

          offers.forEach((offerItem) => {
            offerItem.institution = {
              id: offerItem.institution_id,
              title: this.cachedDataService.institutionMap.get(offerItem.institution_id),
              url: undefined,
            };
            offerItem.language = this.cachedDataService.languageMap.get(offerItem.language_id);
            offerItem.type = this.cachedDataService.formatMap.get(offerItem.offertype_id);
            offerItem.competence_classic = offerItem.competences.includes(
              this.cachedDataService.competencesMap.get('classic')
            )
              ? 1
              : 0;
            offerItem.competence_digital = offerItem.competences.includes(
              this.cachedDataService.competencesMap.get('digital')
            )
              ? 1
              : 0;
            offerItem.competence_tech = offerItem.competences.includes(
              this.cachedDataService.competencesMap.get('tech')
            )
              ? 1
              : 0;
          });

          console.log('ShortOffers:', offers);
          this.offerStore.dispatch({ type: LOAD, data: offers });
        })
      )
      .subscribe(
        (results) => {},
        (error) => {
          console.log('getAllOfferShortList:', error);
          let message = error; // Anpassen wenn nötig
          this.offers$.error(message);
        },
        () => {
          //console.log('getAllOfferShortList completed');
        }
      );

    return this.offers$;
  }

  getOffer(id: number): Observable<Offer> {
    return this.apiService.getOffer(id);
  }

  storeOffer(data: OfferToAPI) {
    return this.apiService.postOffer(data).pipe(
      tap((savedOffer) => {
        console.log('New Offer:', savedOffer);
        // this.offerChanged$.next(savedOffer);
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
}
