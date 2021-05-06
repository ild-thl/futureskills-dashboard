import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/core/services/offer/offer.service';
import { UserDataErrorResponse } from 'src/app/core/http/api.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataHandlerService {
  private dataIsInitialized: boolean = false;

  // Status if offers are already loaded
  private _offersAreLoaded$ = new BehaviorSubject<UserDataErrorResponse>({
    isLoaded: false,
    isError: false,
    message: '',
  });
  public get offersAreLoaded$() {
    return this._offersAreLoaded$;
  }

  constructor(
    private authService: AuthService,
    private offerService: OfferService
  ) {}

  /**
   * Loaded once when app starts
   * Initialize is called in app.component
   */

  public initialize() {
    if (this.dataIsInitialized) return;
    this.dataIsInitialized = true;

    // Versuchen einzuloggen
    this.authService.autoLogin();

    // Load Offerdata from start
    this.loadOfferData();
  }

  /**
   * loads All Offers and saves reply/error
   */
  private loadOfferData() {
    console.log('loadOfferData');
    this.offerService.getAllOffers().subscribe(
      (value) => {
        this._offersAreLoaded$.next({
          isLoaded: true,
          isError: false,
          message: '',
        });
      },
      (error) => {
        this._offersAreLoaded$.next({
          isLoaded: true,
          isError: true,
          message: error,
        });
      }
    );
  }
}
