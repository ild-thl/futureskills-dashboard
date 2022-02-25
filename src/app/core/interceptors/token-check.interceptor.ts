import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, EMPTY, throwError, BehaviorSubject } from 'rxjs';
import { take, exhaustMap, map, catchError, tap, switchMap, filter } from 'rxjs/operators';
import { StaticService } from 'src/app/config/static.service';
import { UserData } from './../data/user/user-data.interface';
import { TokenService } from 'src/app/core/services/token-check/token.service';

@Injectable()
export class TokenCheckInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private staticConfig: StaticService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  private lnkLogin = this.staticConfig.getPathInfo().lnkLogin;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isRefreshing = false;
  private isAuth = false;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Eingeloggt
    let authReq = request;
    const token = this.tokenService.getAccessToken();
    this.isAuth = token !== null;
    console.log('IsAuth: ', this.isAuth);
    console.log('event (request) ->>> ', request);

    if (token != null) {
      authReq = this.addTokenHeader(request, token);
    }

    return next.handle(authReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('<--- event (response)', event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (this.isAuth) {
            console.log('logged In: Error 401', error);
            return this.handle401Error(authReq, next);
          } else {
            console.log('NOT logged In: Error 401', error);
            // 401 obwohl nichht eingeloggt?
            // zum login fenster leiten?
          }
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.tokenService.getRefreshToken();
      if (token) {
        return this.authService.refreshToken(token).pipe(
          switchMap((token: { accessToken: string; refreshToken: string }) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.accessToken);
            this.authService.refreshUserData(token.accessToken, token.refreshToken);
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logoutUser();
            return throwError(() => error);
          })
        );
      }
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<unknown> {
    const headerSettings: { [name: string]: string | string[] } = {};

    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }

    headerSettings['Authorization'] = 'Bearer ' + token;
    headerSettings['Content-Type'] = 'application/json';
    const newHeader = new HttpHeaders(headerSettings);

    return request.clone({
      headers: newHeader,
    });
  }

  // private handleLoggedInRequest(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   return next.handle(request).pipe(
  //     map((event: HttpEvent<any>) => {
  //       if (event instanceof HttpResponse) {
  //         console.log('event--->>>', event);
  //       }
  //       return event;
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       console.log('Error mit Login:', error);

  //       if (error instanceof HttpErrorResponse && error.status === 401) {
  //         if (!this.isRefreshing) {
  //           const refreshToken = this.tokenService.getRefreshToken();
  //           this.isRefreshing = true;

  //           this.authService.updateUserSession(refreshToken).subscribe({
  //             next: (value) => {
  //               this.isRefreshing = false;
  //               console.log('REFRESH TOKEN SENT');
  //             },
  //             error: (error) => {
  //               this.isRefreshing = false;
  //               console.log('REFRESH TOKEN SENT ERROR', error);
  //             },
  //           });
  //         } else {
  //           // Token wird noch upgedated
  //         }
  //       }
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // private handleRequest(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   return next.handle(request).pipe(
  //     map((event: HttpEvent<any>) => {
  //       if (event instanceof HttpResponse) {
  //         console.log('event--->>>', event);
  //       }
  //       return event;
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       console.log('Error ohne Login:', error);
  //       if (error.status === 401) {
  //         // this.router.navigate(['/login']).then((_) => console.log('redirect to login'));
  //       }
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // private createNewHeader(request: HttpRequest<unknown>, token: String): HttpRequest<unknown> {
  //   const headerSettings: { [name: string]: string | string[] } = {};

  //   for (const key of request.headers.keys()) {
  //     headerSettings[key] = request.headers.getAll(key);
  //   }

  //   headerSettings['Authorization'] = 'Bearer ' + token;
  //   headerSettings['Content-Type'] = 'application/json';
  //   const newHeader = new HttpHeaders(headerSettings);

  //   const modifiedReq = request.clone({
  //     headers: newHeader,
  //   });
  //   return modifiedReq;
  // }
}
