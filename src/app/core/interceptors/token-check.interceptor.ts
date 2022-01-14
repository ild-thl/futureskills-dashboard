import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { take, exhaustMap, map } from 'rxjs/operators';
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

  lnkLogin = this.staticConfig.getPathInfo().lnkLogin;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const response = this.authService.userAuthenticated$.pipe(
      take(1),
      exhaustMap((userData: UserData) => {
        if (userData.isAuth) {
          const token = this.tokenService.getToken();
          const isValid = this.tokenService.isTokenValid(token);

          if (isValid) {
            console.log('Token check (Interceptor) ok');
            return next.handle(request);
          } else {
            console.log('Token expired');
            // Erstmal kein Logout
            return next.handle(request);
            // this.handleExpiredToken();
            // return EMPTY;
          }
        } else {
          // not logged in or logged in another window (todo)
          return next.handle(request);
        }
      })
    );
    return response;
  }

  private handleExpiredToken() {
    this.authService.logoutUserOnTokenExpired().subscribe((value) => {
      this.router.navigate([this.lnkLogin]);
    });
  }
}
