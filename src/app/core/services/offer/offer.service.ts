import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from 'src/app/core/http/api.service';
import { OfferToAPI } from 'src/app/core/http/api.interfaces';
import { Offer, PartialOffer } from 'src/app/shared/models/offer';
import { LOAD, ADD, EDIT, REMOVE, OfferStore } from './offer.store';

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

  constructor(private apiService: ApiService, private offerStore: OfferStore) {
    this.offers$ = offerStore.items$;
  }

  getAllOffers(): Observable<Offer[]> {
    this.apiService
      .getAllOffers()
      .pipe(
        tap((offers) => {
          this.offerStore.dispatch({ type: LOAD, data: offers });
        })
      )
      .subscribe(
        (offers) => {
          //console.log('Offers geladen', offers);
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
  storePartialOfferList(offerList: PartialOffer[]){
    const sentList = offerList.filter((offer) => offer.id !== null);
    return this.apiService.updatePartialOfferList(sentList).pipe(
      tap(savedOffers => {
        // TODO: Einzelne Datensätze updaten oder besser die Datensätze neu laden
      })
    )
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
