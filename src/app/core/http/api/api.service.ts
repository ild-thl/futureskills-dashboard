import { StaticService } from 'src/app/config/static.service';

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Institution } from 'src/app/core/models/institution';
import { Offer, PartialOffer } from 'src/app/core/models/offer';
import { User } from 'src/app/core/models/user';
import {
  SubscriptionData,
  OfferToAPI,
  OfferPropertyTagResponse,
  APIToOfferShortList,
  PaginatedOfferDataFromAPI,
} from './api.interfaces';
import { AuthResponseData } from 'src/app/core/auth/auth.interfaces';

/**
 * api.service.ts
 * Contains API-Calls (also unused calls)
 * Handles Errors
 * 30.10.2020
 */

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private staticServive: StaticService) {}

  ////////////////////////////////////////////////
  // Authenticate
  ////////////////////////////////////////////////
  public loginUser(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(environment.apiURL + '/oauth/token', {
        grant_type: environment.clientLoginData.grantType,
        username: email,
        password: password,
        client_id: environment.clientLoginData.clientId,
        client_secret: environment.clientLoginData.clientSecret,
      })
      .pipe(catchError(this.handleLoginError));
  }

  ////////////////////////////////////////////////
  // Offers Paginated
  ////////////////////////////////////////////////
  public getPaginatedOfferShortList(
    page: number = 1,
    count?: number
  ): Observable<PaginatedOfferDataFromAPI> {
    if (!count || count < 1) {
      count = this.staticServive.getOfferDefaultCount();
    }

    return this.http
      .get<PaginatedOfferDataFromAPI>(
        environment.apiURL + '/api/list/offer/short/paginated/' + count + '?page=' + page
      )
      .pipe(catchError(this.handleError));
  }

  ////////////////////////////////////////////////
  // Offers
  ////////////////////////////////////////////////

  public getAllOfferShortList(): Observable<Offer[]> {
    return this.http
      .get<Offer[]>(environment.apiURL + '/api/list/offer/short')
      .pipe(catchError(this.handleError));
  }

  /**
   * @deprecated keine lange Liste nötig, besser getAllOfferShortList
   * @returns Observable<Offer[]>
   */
  public getAllOffers(): Observable<Offer[]> {
    return this.http
      .get<Offer[]>(environment.apiURL + '/api/offer')
      .pipe(catchError(this.handleError));
  }

  public getOfferSubListWithKeyWords(keyword: string): Observable<APIToOfferShortList[]> {
    return this.http
      .get<Offer[]>(environment.apiURL + '/api/search/offer/sublist/' + keyword)
      .pipe(catchError(this.handleError));
  }

  public getOfferNewest(): Observable<APIToOfferShortList[]> {
    return this.http
      .get<Offer[]>(environment.apiURL + '/api/search/offer/latest')
      .pipe(catchError(this.handleError));
  }

  public getOffer(id: number): Observable<Offer> {
    return this.http
      .get<Offer>(environment.apiURL + '/api/offer/' + id)
      .pipe(catchError(this.handleError));
  }

  public putOffer(id: number, data: OfferToAPI): Observable<Offer> {
    return this.http
      .put<Offer>(environment.apiURL + '/api/offer/' + id, data)
      .pipe(catchError(this.handleError));
  }

  public postOffer(data: OfferToAPI): Observable<Offer> {
    return this.http
      .post<Offer>(environment.apiURL + '/api/offer', data)
      .pipe(catchError(this.handleError));
  }

  public deleteOffer(id: number) {
    return this.http
      .delete(environment.apiURL + '/api/offer/' + id)
      .pipe(catchError(this.handleError));
  }

  // Array mit Offers, die nicht vollständig sind.
  // Angedacht für die Sortierungsliste.
  public updatePartialOfferList(offerList: PartialOffer[]) {
    const sentList = offerList.filter((offer) => offer.id !== null);
    return throwError('storePartialList not implemented');
  }

  ////////////////////////////////////////////////
  // Subscriptions
  // !! Die Funktionen müssen überarbeitet werden !!
  ////////////////////////////////////////////////

  public getAllSubscriptions(): Observable<SubscriptionData[]> {
    return this.http
      .get<SubscriptionData[]>(environment.apiURL + '/api/subscription')
      .pipe(catchError(this.handleError));
  }

  public getSubscriptionById(id: number): Observable<SubscriptionData> {
    return this.http
      .get<SubscriptionData>(environment.apiURL + '/api/subscription/' + id)
      .pipe(catchError(this.handleError));
  }

  public getSubscriptionByIds(user_id: number, offer_id: number): Observable<SubscriptionData[]> {
    return this.http
      .get<SubscriptionData[]>(environment.apiURL + '/api/subscription/' + user_id + '/' + offer_id)
      .pipe(catchError(this.handleError));
  }

  public getUserSubscriptions(user_id: number) {
    return this.http
      .get<SubscriptionData[]>(environment.apiURL + '/api/subscription/user/' + user_id)
      .pipe(catchError(this.handleError));
  }

  public putSubscription(id: number, data: Object): Observable<SubscriptionData> {
    console.log(data);
    return this.http
      .put<SubscriptionData>(environment.apiURL + '/api/subscription/' + id, data)
      .pipe(catchError(this.handleError));
  }

  public postSubscription(data: Object): Observable<SubscriptionData> {
    console.log(data);
    return this.http
      .post<SubscriptionData>(environment.apiURL + '/api/subscription', data)
      .pipe(catchError(this.handleError));
  }

  public deleteSubscription(id: number) {
    console.log('del Subscription' + id);
    return this.http
      .delete(environment.apiURL + '/api/subscription/' + id)
      .pipe(catchError(this.handleError));
  }

  ////////////////////////////////////////////////
  // User
  ////////////////////////////////////////////////

  public getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(environment.apiURL + '/api/user')
      .pipe(catchError(this.handleError));
  }

  public getUser(id: number): Observable<User> {
    return this.http
      .get<User>(environment.apiURL + '/api/user/' + id)
      .pipe(catchError(this.handleError));
  }

  public getUserByEmail(email: string): Observable<User> {
    return this.http
      .get<User>(environment.apiURL + '/api/user/email?email=' + email)
      .pipe(catchError(this.handleError));
  }

  public putUser(id: number, data: Object): Observable<User> {
    return this.http
      .put<User>(environment.apiURL + '/api/user/' + id, data)
      .pipe(catchError(this.handleError));
  }

  public postUser(data: Object): Observable<User> {
    return this.http
      .post<User>(environment.apiURL + '/api/user', data)
      .pipe(catchError(this.handleError));
  }

  public deleteUser(id: number) {
    return this.http
      .delete(environment.apiURL + '/api/user/' + id)
      .pipe(catchError(this.handleError));
  }

  ////////////////////////////////////////////////
  // Institutions
  ////////////////////////////////////////////////

  public getInstitutions(): Observable<Institution[]> {
    return this.http
      .get<Institution[]>(environment.apiURL + '/api/institution/')
      .pipe(catchError(this.handleError));
  }

  public getInstitutionById(id: number): Observable<Institution> {
    return this.http
      .get<Institution>(environment.apiURL + '/api/institution/' + id)
      .pipe(catchError(this.handleError));
  }

  public postInstitution(institution: Institution): Observable<Institution> {
    let data = {
      title: institution.title,
      url: institution.url,
    };
    return this.http
      .post<Institution>(environment.apiURL + '/api/institution/', data)
      .pipe(catchError(this.handleError));
  }

  public putInstitution(institution: Institution): Observable<Institution> {
    let id = institution.id;
    let data = {
      title: institution.title,
      url: institution.url,
    };
    return this.http
      .put<Institution>(environment.apiURL + '/api/institution/' + id, data)
      .pipe(catchError(this.handleError));
  }

  public deleteInstitution(institution: Institution) {
    let id = institution.id;
    if (id == undefined) return;
    return this.http
      .delete(environment.apiURL + '/api/institution' + id)
      .pipe(catchError(this.handleError));
  }

  ////////////////////////////////////////////////
  // META DATA
  ///////////////////////////////////////////////

  public getFilterTags(): Observable<OfferPropertyTagResponse> {
    return this.http
      .get<OfferPropertyTagResponse>(environment.apiURL + '/api/filter/tags')
      .pipe(catchError(this.handleError));
  }

  // Die Filter sind im Moment identisch mit den Properties
  public getOfferProperties(): Observable<OfferPropertyTagResponse> {
    return this.getFilterTags();
  }

  ////////////////////////////////////////////////
  // ErrorHandling
  ////////////////////////////////////////////////
  // Todo: Fehlermeldungstexte für die GUI
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';
    const e401 = 'Fehler beim Zugriff auf Benutzerdaten.';
    const e404 = 'Es wurden keine Daten gefunden.';
    const e422 = 'Fehler beim Speichern der Daten.';
    const e500 = 'Ein Serverfehler ist aufgetreten.';
    console.log('ErrorHandler : ', errorRes);

    // Mehrere Möglichkeiten
    // Abfrage auf Status
    // 401 - Unauthorized
    switch (errorRes.status) {
      case 401:
        errorMessage = e401;
        return throwError(errorMessage);
      case 404:
        errorMessage = e404;
        return throwError(errorMessage);
      case 422:
        errorMessage = e422;
        return throwError(errorMessage);
      case 500:
        errorMessage = e500;
        return throwError(errorMessage);
    }

    // oder Abfrage der Message
    if (!errorRes.error) {
      return throwError(errorMessage);
    } else {
      // return an observable with a user-facing error message
      console.log('ErrorMessage: ', errorRes.error.message);
      switch (errorRes.error.message) {
        case 'Unauthenticated.':
          errorMessage = e401;
          break;
      }
    }

    return throwError(errorMessage);
  }

  private handleLoginError(errorRes: HttpErrorResponse) {
    // Todo: Fehlermeldungstexte für die GUI
    let errorMessage = 'Fehler beim Login.';
    console.log('LoginError : ', errorRes);
    return throwError(errorMessage);
  }
}
