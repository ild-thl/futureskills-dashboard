import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { Offer } from 'src/app/shared/models/offer';

export const LOAD = 'LOAD';
export const ADD = 'ADD';
export const EDIT = 'EDIT';
export const REMOVE = 'REMOVE';

/**
 * offer.store.ts
 * Contains OfferData
 * offer.service handles this, don't use directly
 * 30.10.2020
 */

@Injectable({
  providedIn: 'root',
})
export class OfferStore {
  private offers: Offer[] = [];
  items$ = new BehaviorSubject<Offer[]>(null);

  dispatch(action) {
    if (action.data == null) {
      this.offers = [];
    } else {
      this.offers = this._reduce(this.offers, action);
    }
    this.items$.next(this.offers);
  }

  _reduce(offers: Offer[], action) {
    switch (action.type) {
      case LOAD:
        return [...action.data];
      case ADD:
        return [...offers, action.data];
      case EDIT:
        return offers.map((offer) => {
          const editedOffer = action.data;
          if (offer.id !== editedOffer.id) {
            return offer;
          }
          return editedOffer;
        });
      case REMOVE:
        return offers.filter((task) => task.id !== action.data.id);
      default:
        return offers;
    }
  }
}
