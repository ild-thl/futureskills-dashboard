import { concatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/core/http/offer/offer.service';
import { MetaDataService } from 'src/app/core/data/meta/meta-data.service';
import { UserDataErrorResponse } from 'src/app/core/http/api/api.interfaces';

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
    private offerService: OfferService,
    private metaDataService: MetaDataService
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

    // Load OfferProperties
   // this.loadOfferProperties();

    // Load Offerdata from start
    this.loadOfferData();

    //this.offerService.getAllOfferShortList();
    this.offerService.alt_getAllOffers();
  }

  private loadOfferProperties(){
    this.metaDataService.getOfferProperties().subscribe(
      next => {
        console.log('OfferProperties: ', next)
      },
      error => console.log('error: ', error)
    );
  }

  /**
   * loads All Offers and saves reply/error
   */
  private loadOfferData() {
    console.log('loadOfferData');
    this.offerService.getAllOfferShortList().subscribe(
      (value) => {
        //console.log("OfferData: ", value);
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
