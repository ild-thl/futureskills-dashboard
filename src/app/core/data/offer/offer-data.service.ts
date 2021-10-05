import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { OfferToAPI } from 'src/app/core/http/api/api.interfaces';
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
import { DataMapping } from '../../http/api/data-mapping';

/////////////////////////////////////////////////////
// Class contains all Data-Functions for Components
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
  public getPaginatedOfferList(page?: number, count?: number): Observable<PaginatedOfferData> {
    return this.offerService.getPaginatedOfferData(page, count);
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

  ///////////////// DELETED

  // CourseList
  public alt_getAllOffersForList(): Observable<Offer[]> {
    return this.alt_getAllOfferDataWithoutLoginCheck();
  }
  /**
   * Laden der Kursliste (aus dem offer.store)
   * Prüfung ob man eingeloggt ist (mehr nicht)
   */
  private alt_getAllOfferDataWithLoginCheck(): Observable<Offer[]> {
    return of([]);
    // return this._userAuthenticated$.pipe(
    //   filter((userData: UserData) => userData.isAuth),
    //   concatMap((data) => {
    //     return this.getAllOfferDataWithoutLoginCheck();
    //   })
    // );
  }

  /**
   * Laden der Kursliste (aus dem offer.store)
   * Keine Prüfung auf Login
   */
  private alt_getAllOfferDataWithoutLoginCheck(): Observable<Offer[]> {
    return of([]);
    // return this._offersAreLoaded$.pipe(
    //   filter((data: UserDataErrorResponse) => data.isLoaded),
    //   concatMap((data) => {
    //     if (!data.isError) {
    //       return this._offers$.pipe(filter((offers: Offer[]) => offers !== null));
    //     } else {
    //       return throwError(data.message);
    //     }
    //   })
    // );

    /**
     * Laden der Kursliste gefiltered nach Keyword
     * @deprecated (List comes from API now)
     * @param keyword
     */
    // private getFilteredOffersWithKeyword_local(keyword: string | string[]): Observable<Offer[]> {
    //   if (keyword == null || keyword.length == 0) return of([]);

    //   return this.getAllOfferDataWithoutLoginCheck().pipe(
    //     map((offerList) => {
    //       return offerList.filter((item) => {
    //         if (!item.keywords) {
    //           return false;
    //         } else {
    //           const list = item.keywords.split(',').map((item) => {
    //             return item.trim().toLowerCase();
    //           });
    //           if (Array.isArray(keyword)) {
    //             return keyword.every((keyword) => list.includes(keyword));
    //           } else {
    //             return list.includes(keyword);
    //           }
    //         }
    //       });
    //     })
    //   );
    // }
  }

  /**
   * Speichert OfferData oder genriert eine neue
   * mit check ob man eingeloggt ist (nicht wer)
   * im Moment nicht verwendet
   * @param offerid
   * @param offer
   */
  /*   private saveOrCreateNewOfferDataWithLoginCheck(offerid: number | null, offer: OfferFormData) {
    if (offerid) {
      return this._userAuthenticated$.pipe(
        filter((userData: UserData) => userData.isAuth),
        concatMap((data) => {
          return this.offerService.updateOffer(offerid, offer);
        })
      );
    } else {
      return this._userAuthenticated$.pipe(
        filter((userData: UserData) => userData.isAuth),
        concatMap((data) => {
          return this.offerService.storeOffer(offer);
        })
      );
    }
  } */

  /**
   * Laden der Kursliste gefiltered nach Keyword (unused)
   * @param keyword
   * @returns Observable<OfferShortListForTiles[]> | Observable<SmallOfferDetailData[]>
   */
  // private getFilteredKeywordOffers(
  //   keyword: string | string[],
  //   detailMiniList: boolean = false
  // ): Observable<OfferShortListForTiles[]> | Observable<SmallOfferDetailData[]> {
  //   if (keyword == null || keyword.length == 0) return of([]);

  //   // TODO: Aktuell keine KeyListen, nehmen wir nur den ersten
  //   const keywords = Array.isArray(keyword) ? keyword[0] : keyword;

  //   if (detailMiniList) {
  //     return this.offerService.getMiniOfferWithKeywordFilter(keywords);
  //   } else {
  //     return this.offerService.getShortOfferWithKeywordFilter(keywords);
  //   }
  // }
}
