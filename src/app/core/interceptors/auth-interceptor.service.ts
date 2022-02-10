import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpEvent,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from 'src/app/core/auth/auth.service';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { TokenService } from 'src/app/core/services/token-check/token.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService,  private tokenService: TokenService,) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //console.log('HTTP-Request: ', request);

    const response = this.authService.userAuthenticated$.pipe(
      take(1),
      exhaustMap((userData: UserData) => {
        if (userData.isAuth) {
          const accessToken = this.tokenService.getAccessToken();
          const refreshToken = this.tokenService.getRefreshToken();

          const headerSettings: { [name: string]: string | string[] } = {};

          for (const key of request.headers.keys()) {
            headerSettings[key] = request.headers.getAll(key);
          }

          headerSettings['Authorization'] = 'Bearer ' + accessToken;
          headerSettings['Content-Type'] = 'application/json';
          const newHeader = new HttpHeaders(headerSettings);

          const modifiedReq = request.clone({
            headers: newHeader,
          });

          return next.handle(modifiedReq);
        } else {
          return next.handle(request);
        }
      })
    );
    return response;
  }
}
