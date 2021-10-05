import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/core/http/offer/offer.service';
import { UserDataErrorResponse } from 'src/app/core/http/api/api.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataHandlerService {
  private dataIsInitialized: boolean = false;
  private authInitialized: boolean = false;

  // Status if offers are already loaded
  private _offersAreLoaded$ = new BehaviorSubject<UserDataErrorResponse>({
    isLoaded: false,
    isError: false,
    message: '',
  });
  public get offersAreLoaded$() {
    return this._offersAreLoaded$;
  }

  constructor(private authService: AuthService, private offerService: OfferService) {}

  /**
   * Authenticate
   * @returns void
   */
  public authInit() {
    if (this.authInitialized) return;
    this.authInitialized = true;
    this.authService.autoLogin();
  }

  /**
   * @deprecated will be deleted
   * Loaded once when app starts
   * Initialize is called in app.component
   */
  public initialize() {
    if (this.dataIsInitialized) return;
    this.dataIsInitialized = true;
    this.preLoadOfferData();
  }

  /**
   * loads All Offers and saves reply/error
   */
  private preLoadOfferData() {
    console.log('preLoadOfferData');
    this.offerService.preloadAllOfferShortList().subscribe(
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
