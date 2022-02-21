import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { OfferFilterToAPI, OfferToAPI } from 'src/app/core/http/api/api.interfaces';
import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/core/http/offer/offer.service';
import { UserData, UserOfferData } from 'src/app/core/data/user/user-data.interface';

import { User } from 'src/app/core/models/user';
import {
  Offer,
  SmallOfferListForEditForm,
  OfferShortListForTiles,
  PaginatedOfferData,
  SmallOfferDetailData,
} from 'src/app/core/models/offer';
import { DataMapping } from 'src/app/core/http/api/data-mapping';

/////////////////////////////////////////////////////
// Class contains all Offer-Data-Functions for Components
/////////////////////////////////////////////////////

@Injectable({
  providedIn: 'root',
})
export class OfferDataService {
  private _userAuthenticated$: Observable<UserData>;

  constructor(private offerService: OfferService, private authService: AuthService) {
    this._userAuthenticated$ = this.authService.userAuthenticated$;
  }

  /////////////////////////////////////////////////////
  // get OfferDataLists for Components
  /////////////////////////////////////////////////////

  // CourseList
  public getPaginatedOfferList(
    page: number,
    count: number,
    filterObj: OfferFilterToAPI,
    searchString: string
  ): Observable<PaginatedOfferData> {
    return this.offerService.getPaginatedOfferData(page, count, filterObj, searchString);
  }

  // CourseCarousel
  public getOffersForCourseCarousel(): Observable<OfferShortListForTiles[]> {
    return this.offerService.getShortOffersNewest();
  }

  // Playground-KI-List
  public getOffersForPlaygroundKIList(): Observable<SmallOfferDetailData[]> {
    return this.offerService.getKISuperCoursesDetailList();
  }

  // EditForm (für die Kurszuordnungen)
  public getSmallOfferListForEditForm(
    offerID: number = undefined
  ): Observable<SmallOfferListForEditForm[]> {
    return this.offerService.getAllShortOffersListForEditDetail(offerID);
  }

  // OfferList for Management
  public getSmallOfferListForManagement(
    offerID: number = undefined
  ): Observable<SmallOfferListForEditForm[]> {
    return this.offerService.getAllShortOffersListForEditDetail(offerID);
  }

  // general function
  /**
   * @deprecated not used at the moment (-> see above)
   * @returns
   */
  public getAllOffers(): Observable<OfferShortListForTiles[]> {
    return this.offerService.getAllShortOffersList();
  }

  /////////////////////////////////////////////////////
  // get/save/del Offer for Components
  /////////////////////////////////////////////////////

  // for Detail
  public getOfferDataForDetail(offerId: number): Observable<UserOfferData> {
    return this.getOfferWithLoginData(offerId);
  }

  // for Edit
  public getOfferDataForEdit(offerId: number): Observable<Offer> {
    return this.getOfferWithoutLoginCheck(offerId);
  }

  // saves for Edit
  public saveOfferDataForEdit(offerid: number | null, offer: any, relatedOffers: number[] = []) {
    const mappedData: OfferToAPI = DataMapping.mapOfferFormDataToAPIOffer(
      offerid,
      offer,
      relatedOffers
    );
    return this.saveOrCreateNewOfferDataWithoutLoginCheck(offerid, mappedData);
  }

  // delete for Edit
  public deleteOffer(offer: Offer) {
    return this.offerService.deleteOffer(offer);
  }

  /////////////////////////////////////////////////////
  // private functions
  // get/save Offer for DetailPage
  // (with or without loginCheck)
  /////////////////////////////////////////////////////

  /**
   * no login check
   * @param offerId
   */
  private getOfferWithoutLoginCheck(offerId: number): Observable<Offer> {
    return this.offerService.getOffer(offerId);
  }

  /**
   * with login check
   * @param offerId
   */
  private getOfferWithLoginData(offerId: number): Observable<UserOfferData> {
    return this._userAuthenticated$.pipe(
      concatMap((data) => {
        if (data.isAuth) {
          return this.getOfferWithUserData(offerId, data.user);
        } else {
          return this.getOfferWithUndefinedUserData(offerId);
        }
      })
    );
  }

  /**
   * data if user is unknown
   * the user is needed in detail-page
   * to check if a course was subscribed (not used atthe moment)
   * @param offerId
   */
  private getOfferWithUndefinedUserData(offerId: number): Observable<UserOfferData> {
    return this.offerService.getOffer(offerId).pipe(
      map((offer) => {
        return {
          user: undefined,
          offerData: offer,
          isSubscribed: false,
        };
      })
    );
  }

  /**
   * data if user is known
   * the user is needed in detail-page
   * to check if a course was subscribed (not used atthe moment)
   * @param offerId
   */
  private getOfferWithUserData(offerId: number, user: User): Observable<UserOfferData> {
    return this.offerService.getOffer(offerId).pipe(
      map((offer) => {
        return {
          user: user,
          offerData: offer,
          isSubscribed: false,
        };
      })
    );
  }

  /**
   * no login check
   * saves OfferData or creates new one
   * @param offerid
   * @param offer
   */
  private saveOrCreateNewOfferDataWithoutLoginCheck(offerid: number | null, offer: OfferToAPI) {
    if (offerid) {
      return this.offerService.updateOffer(offerid, offer);
    } else {
      return this.offerService.storeOffer(offer);
    }
  }
}
