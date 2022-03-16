import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { take, catchError, switchMap, filter } from 'rxjs/operators';
import { StaticService } from 'src/app/config/static.service';
import { TokenService } from 'src/app/core/services/token-check/token.service';
import { LogService } from 'src/app/core/services/logger/log.service';
import { TOKEN_PATH, LOGOUT_PATH } from './../http/api/api.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private lnkLogin = this.staticConfig.getPathInfo().lnkLogin;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isRefreshing = false;
  private isAuth = false;

  constructor(
    private authService: AuthService,
    private staticConfig: StaticService,
    private tokenService: TokenService,
    private logService: LogService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = request;
    const token = this.tokenService.getAccessToken();
    this.isAuth = token !== null;
    console.log('event (request) ->>> ', request);

    if (this.isAuth) {
      authReq = this.addTokenHeader(request, token);
    }

    return next.handle(authReq).pipe(
      catchError((error: any) => {
        // 401 Only and only if logged in
        if (this.isAuth && error instanceof HttpErrorResponse && error.status === 401) {
          // Only some paths
          if (!request.url.includes(TOKEN_PATH) && !request.url.includes(LOGOUT_PATH)) {
            this.logService.warn('interceptor', '401 - invalid token:', error);
            this.logService.log('interceptor', 'try to get new token');
            return this.handle401Error(authReq, next);
          }
        }
        // Alle anderen Fehlernummern und /oauth/token Fehler
        this.logService.error('interceptor', 'HTTP-Error', error);
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
        return this.authService.getRefreshTokenFromServer(token).pipe(
          switchMap((token: { accessToken: string; refreshToken: string }) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.accessToken);
            this.authService.refreshLocalTokenUserData(token.accessToken, token.refreshToken);
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((error: HttpErrorResponse) => {
            this.logService.error('interceptor', 'HTTP-Error after Token Refresh', error);
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
}
