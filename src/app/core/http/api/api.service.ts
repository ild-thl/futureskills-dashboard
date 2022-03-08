import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Institution } from 'src/app/core/models/institution';
import { Offer } from 'src/app/core/models/offer';
import { User } from 'src/app/core/models/user';
import {
  SubscriptionData,
  OfferToAPI,
  OfferPropertyTagResponse,
  APIToOfferShortList,
  PaginatedOfferDataFromAPI,
  OfferSearchFilterToAPI,
} from './api.interfaces';
import { AuthResponseData } from 'src/app/core/auth/auth.interfaces';
import { LogService } from 'src/app/core/services/logger/log.service';
import {
  ErrorCodes,
  ErrorHandlerService,
} from 'src/app/core/services/error-handling/error-handling';

/**
 * api.service.ts
 * Contains API-Calls
 * Handles Errors
 * Created 30.10.2020
 * Latest update 17.02.2022/ml
 */

/* eslint-disable no-console */

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private logService: LogService,
    private errorHandler: ErrorHandlerService
  ) {}

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
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return this.handleError(errorResponse);
        })
      );
  }

  /**
   * Logout on Server (Carefully! If token isn't valid anymore -> 401)
   * @returns Observable<any>
   */
  public logoutUser(): Observable<any> {
    return this.http.get<any>(environment.apiURL + '/api/logout').pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  /**
   * Called, if token is expired
   * @param refreshToken
   * @returns
   */
  public updateUserSession(refreshToken: string): Observable<any> {
    return this.http
      .post<AuthResponseData>(environment.apiURL + '/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: environment.clientLoginData.clientId,
        client_secret: environment.clientLoginData.clientSecret,
      })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return this.handleError(errorResponse);
        })
      );
  }

  ////////////////////////////////////////////////
  // Offers Paginated
  ////////////////////////////////////////////////

  /**
   * Load paginated OfferList
   * ! post not get
   * @param page
   * @param count
   * @param filterObj
   * @returns
   */
  public postPaginatedOfferShortList(
    page: number,
    count: number,
    filterSearchObj: OfferSearchFilterToAPI
  ): Observable<PaginatedOfferDataFromAPI> {
    if (count == null || count <= 0) {
      // default value items per page
      count = environment.offerItemPerPage;
    }
    if (page == null || page < 1) {
      page = 1;
    }
    if (!filterSearchObj) {
      filterSearchObj = {};
    }

    return this.http
      .post<PaginatedOfferDataFromAPI>(
        environment.apiURL + '/api/list/offer/short/paginated/' + count + '?page=' + page,
        filterSearchObj
      )
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return this.handleError(errorResponse);
        })
      );
  }

  ////////////////////////////////////////////////
  // Offers
  ////////////////////////////////////////////////

  public getAllOfferShortList(): Observable<APIToOfferShortList[]> {
    return this.http.get<APIToOfferShortList[]>(environment.apiURL + '/api/list/offer/short').pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  /**
   * @deprecated keine lange Liste nötig, besser getAllOfferShortList
   * @returns Observable<Offer[]>
   */
  public getAllOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(environment.apiURL + '/api/offer').pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public getOfferSubListWithKeyWords(keyword: string): Observable<APIToOfferShortList[]> {
    return this.http.get<Offer[]>(environment.apiURL + '/api/search/offer/sublist/' + keyword).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public getOfferLatest(): Observable<APIToOfferShortList[]> {
    return this.http.get<Offer[]>(environment.apiURL + '/api/search/offer/latest').pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public getOffer(id: number): Observable<Offer> {
    return this.http.get<Offer>(environment.apiURL + '/api/offer/' + id).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public putOffer(id: number, data: OfferToAPI): Observable<Offer> {
    return this.http.put<Offer>(environment.apiURL + '/api/offer/' + id, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public postOffer(data: OfferToAPI): Observable<Offer> {
    return this.http.post<Offer>(environment.apiURL + '/api/offer', data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public deleteOffer(id: number) {
    return this.http.delete(environment.apiURL + '/api/offer/' + id).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  ////////////////////////////////////////////////
  // Subscriptions
  // !! Die Funktionen müssen überarbeitet werden !!
  ////////////////////////////////////////////////

  public getAllSubscriptions(): Observable<SubscriptionData[]> {
    return this.http.get<SubscriptionData[]>(environment.apiURL + '/api/subscription').pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public getSubscriptionById(id: number): Observable<SubscriptionData> {
    return this.http.get<SubscriptionData>(environment.apiURL + '/api/subscription/' + id).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public getSubscriptionByIds(user_id: number, offer_id: number): Observable<SubscriptionData[]> {
    return this.http
      .get<SubscriptionData[]>(environment.apiURL + '/api/subscription/' + user_id + '/' + offer_id)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return this.handleError(errorResponse);
        })
      );
  }

  public getUserSubscriptions(user_id: number) {
    return this.http
      .get<SubscriptionData[]>(environment.apiURL + '/api/subscription/user/' + user_id)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return this.handleError(errorResponse);
        })
      );
  }

  public putSubscription(id: number, data: Object): Observable<SubscriptionData> {
    return this.http
      .put<SubscriptionData>(environment.apiURL + '/api/subscription/' + id, data)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return this.handleError(errorResponse);
        })
      );
  }

  public postSubscription(data: Object): Observable<SubscriptionData> {
    return this.http.post<SubscriptionData>(environment.apiURL + '/api/subscription', data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public deleteSubscription(id: number) {
    return this.http.delete(environment.apiURL + '/api/subscription/' + id).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  ////////////////////////////////////////////////
  // User
  ////////////////////////////////////////////////

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiURL + '/api/user').pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public getUser(id: number): Observable<User> {
    return this.http.get<User>(environment.apiURL + '/api/user/' + id).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(environment.apiURL + '/api/user/email?email=' + email).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public putUser(id: number, data: Object): Observable<User> {
    return this.http.put<User>(environment.apiURL + '/api/user/' + id, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public postUser(data: Object): Observable<User> {
    return this.http.post<User>(environment.apiURL + '/api/user', data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public deleteUser(id: number) {
    return this.http.delete(environment.apiURL + '/api/user/' + id).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  ////////////////////////////////////////////////
  // Institutions
  ////////////////////////////////////////////////

  public getInstitutions(): Observable<Institution[]> {
    return this.http.get<Institution[]>(environment.apiURL + '/api/institution/').pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public getInstitutionById(id: number): Observable<Institution> {
    return this.http.get<Institution>(environment.apiURL + '/api/institution/' + id).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public postInstitution(institution: Institution): Observable<Institution> {
    let data = {
      title: institution.title,
      url: institution.url,
    };
    return this.http.post<Institution>(environment.apiURL + '/api/institution/', data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public putInstitution(institution: Institution): Observable<Institution> {
    let id = institution.id;
    let data = {
      title: institution.title,
      url: institution.url,
    };
    return this.http.put<Institution>(environment.apiURL + '/api/institution/' + id, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  public deleteInstitution(institution: Institution): Observable<any> {
    let id = institution.id;
    if (id == undefined) {
      // TODO: Rückgabewert nochmal checken
      return of(false);
    }
    return this.http.delete(environment.apiURL + '/api/institution' + id).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  ////////////////////////////////////////////////
  // META DATA
  ///////////////////////////////////////////////

  public getFilterTags(): Observable<OfferPropertyTagResponse> {
    return this.http.get<OfferPropertyTagResponse>(environment.apiURL + '/api/filter/tags').pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      })
    );
  }

  // Die Filter sind im Moment identisch mit den Properties
  public getOfferProperties(): Observable<OfferPropertyTagResponse> {
    return this.getFilterTags();
  }

  ////////////////////////////////////////////////
  // ErrorHandling
  ////////////////////////////////////////////////
  // Todo: Fehlermeldungstexte für die GUI
  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorCode = ErrorCodes.UNKNOWN;

    switch (errorRes.status) {
      case 0:
        errorCode = ErrorCodes.E0;
        break;
      case 400:
        errorCode = ErrorCodes.E400;
        break;
      case 401:
        errorCode = ErrorCodes.E401;
        break;
      case 403:
        errorCode = ErrorCodes.E403;
        break;
      case 404:
        errorCode = ErrorCodes.E404;
        break;
      case 422:
        errorCode = ErrorCodes.E422;
        break;
      case 429:
        errorCode = ErrorCodes.E429;
        break;
      case 500:
        errorCode = ErrorCodes.E500;
        break;
    }
    let newError = new Error(errorCode);

    console.log('ErrorResponse:', errorRes);
    return throwError(() => newError);
  }
}
