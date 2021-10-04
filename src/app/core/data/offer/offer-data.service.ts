import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';

import { UserDataErrorResponse, OfferToAPI } from 'src/app/core/http/api/api.interfaces';
import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/core/http/offer/offer.service';
import { UserData, UserOfferData } from 'src/app/core/data/user/user-data.interface';
import { DataHandlerService } from 'src/app/core/http/data-handler.service';

import { User } from 'src/app/core/models/user';
import {
  Offer,
  SmallOfferListForEditForm,
  PartialOffer,
  OfferShortListForTiles,
  SmallOfferDetailData,
} from 'src/app/core/models/offer';

@Injectable({
  providedIn: 'root',
})
export class OfferDataService {
  private _offers$: Observable<Offer[]>;
  private _offersAreLoaded$: Observable<UserDataErrorResponse>;
  private _userAuthenticated$: Observable<UserData>;

  constructor(
    private offerService: OfferService,
    private authService: AuthService,
    private dataHandlerService: DataHandlerService
  ) {
    this._offers$ = this.offerService.offers$;
    this._offersAreLoaded$ = this.dataHandlerService.offersAreLoaded$;
    this._userAuthenticated$ = this.authService.userAuthenticated$;
  }

  // public

  // //////////////////////////////////
  // get OfferDataLists for Components
  // //////////////////////////////////

  // CourseList
  public getAllOffersForList(): Observable<Offer[]> {
    return this.getAllOfferDataWithoutLoginCheck();
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
    offerID: number | null
  ): Observable<SmallOfferListForEditForm[]> {
    // Aktuell alle
    return this.getAllOfferDataWithoutLoginCheck().pipe(
      map((offerData: Offer[]) => {
        if (offerID) {
          offerData = offerData.filter((data) => {
            return data.id !== offerID;
          });
        }

        return offerData.map((itemData: Offer) => {
          return {
            id: itemData.id,
            image: itemData.image_path,
            title: itemData.title,
          };
        });
      })
    );
  }

  // AdminPanel Sorting (unused)
  public getAllOfferDataForAdminPanel(): Observable<Offer[]> {
    return this.getAllOfferDataWithLoginCheck();
  }

  // //////////////////////////////////
  // get Offer
  // //////////////////////////////////

  // Detailseite
  public getOfferDataForDetail(offerId: number): Observable<UserOfferData> {
    return this.getOfferWithLoginData(offerId);
  }

  // EditSeite
  public getOfferDataForEdit(offerId: number): Observable<Offer> {
    return this.getOfferWithoutLoginCheck(offerId);
  }

  // ///////////////////////////
  //  save OfferData
  // ///////////////////////////

  // saves OfferData or Creates a new one
  // only if the User is logged in
  public saveOfferDataForEdit(offerid: number | null, offer: any, relatedOffers: number[] = []) {
    const mappedData = this.mapOfferFormDataToOffer(offerid, offer, relatedOffers);
    return this.saveOrCreateNewOfferDataWithoutLoginCheck(offerid, mappedData);
  }

  // save Parts of OfferData (not testet/not used)
  public storePartialOfferDataList(offerList: PartialOffer[]): Observable<any> {
    // TODO
    return this.offerService.storePartialOfferList(offerList);
  }

  // ///////////////////////////
  //  Delete Offer
  // ///////////////////////////
  public deleteOffer(offer: Offer) {
    return this.offerService.deleteOffer(offer);
  }

  // private

  // ///////////////////////////
  // Loading OfferList
  // ///////////////////////////

  /**
   * Laden der Kursliste gefiltered nach Keyword (unused)
   * @param keyword
   * @returns Observable<OfferShortListForTiles[]> | Observable<SmallOfferDetailData[]>
   */
  private getFilteredKeywordOffers(
    keyword: string | string[],
    detailMiniList: boolean = false
  ): Observable<OfferShortListForTiles[]> | Observable<SmallOfferDetailData[]> {
    if (keyword == null || keyword.length == 0) return of([]);

    // TODO: Aktuell keine KeyListen, nehmen wir nur den ersten
    const keywords = (Array.isArray(keyword)) ? keyword[0] : keyword;

    if (detailMiniList){
      return this.offerService.getMiniOfferWithKeywordFilter(keywords);
    } else {
      return this.offerService.getShortOfferWithKeywordFilter(keywords);
    }
  }

  /**
   * Laden der Kursliste (aus dem offer.store)
   * Prüfung ob man eingeloggt ist (mehr nicht)
   */
  private getAllOfferDataWithLoginCheck(): Observable<Offer[]> {
    return this._userAuthenticated$.pipe(
      filter((userData: UserData) => userData.isAuth),
      concatMap((data) => {
        return this.getAllOfferDataWithoutLoginCheck();
      })
    );
  }

  /**
   * Laden der Kursliste (aus dem offer.store)
   * Keine Prüfung auf Login
   */
  private getAllOfferDataWithoutLoginCheck(): Observable<Offer[]> {
    return this._offersAreLoaded$.pipe(
      filter((data: UserDataErrorResponse) => data.isLoaded),
      concatMap((data) => {
        if (!data.isError) {
          return this._offers$.pipe(filter((offers: Offer[]) => offers !== null));
        } else {
          return throwError(data.message);
        }
      })
    );
  }

  // ///////////////////////////
  // Loading Offer
  // ///////////////////////////

  /**
   * Laden eines Kurses ohne Userdaten
   * aber mit check ob man eingeloggt ist
   * im Moment nicht verwendet
   * @param offerId
   */
  /*   private getOfferWithLoginCheck(offerId: number): Observable<Offer> {
    return this._userAuthenticated$.pipe(
      filter((userData: UserData) => userData.isAuth),
      concatMap((data) => {
        return this.offerService.getOffer(offerId);
      })
    );
  } */


  /**
   * Laden eines Kurses
   * ohne check ob man eingeloggt ist
   * @param offerId
   */
  private getOfferWithoutLoginCheck(offerId: number): Observable<Offer> {
    return this.offerService.getOffer(offerId);
  }

  /**
   * Laden eines Kurses (Detailseite)
   * Der Kurs wird direkt über die API nachgeladen
   * Prüfung auf Login und Auswertung der Login-Daten
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
   * Laden eines Kurses
   * Der Kurs wird direkt über die API nachgeladen
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
   * Laden eines Kurses mit verpackten Userdaten
   * Der Kurs wird direkt über die API nachgeladen
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

  // ///////////////////////////
  // Saving/Creating  Offer
  // ///////////////////////////

  /**
   * Speichert OfferData oder genriert eine neue
   * kein check ob man eingeloggt ist
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

  ////////////////// MAPPING DATA /////////////////

  private mapOfferFormDataToOffer(
    id: number | null,
    offerdata: PartialOffer,
    relatedCourses: number[]
  ): OfferToAPI {
    const tempOffer: OfferToAPI = {
      id: id,
      author: offerdata.author,
      institution_id: offerdata.institution_id,
      competence_classic: offerdata.competence_classic,
      competence_digital: offerdata.competence_digital,
      competence_tech: offerdata.competence_tech,
      description: offerdata.description,
      exam: offerdata.meta.exam,
      hashtag: offerdata.hashtag,
      image_path: offerdata.image_path,
      language: offerdata.language,
      niveau: offerdata.meta.niveau,
      requirements: offerdata.meta.requirements,
      sort_flag: offerdata.sort_flag,
      sponsor: offerdata.meta.sponsor,
      subtitle: offerdata.subtitle,
      target_group: offerdata.target_group,
      time_requirement: offerdata.meta.time_requirement,
      title: offerdata.title,
      type: offerdata.type,
      url: offerdata.url,
      keywords: offerdata.keywords,
      relatedOffers: relatedCourses,
    };
    return tempOffer;
  }

  /**
   * Laden der Kursliste gefiltered nach Keyword
   * @deprecated (List comes from API now)
   * @param keyword
   */
  private getFilteredOffersWithKeyword_local(keyword: string | string[]): Observable<Offer[]> {
    if (keyword == null || keyword.length == 0) return of([]);

    return this.getAllOfferDataWithoutLoginCheck().pipe(
      map((offerList) => {
        return offerList.filter((item) => {
          if (!item.keywords) {
            return false;
          } else {
            const list = item.keywords.split(',').map((item) => {
              return item.trim().toLowerCase();
            });
            if (Array.isArray(keyword)) {
              return keyword.every((keyword) => list.includes(keyword));
            } else {
              return list.includes(keyword);
            }
          }
        });
      })
    );
  }
}
