import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, concatMap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from 'src/app/shared//models/user';
import { UserData } from 'src/app/core/http/data/user/user-data.interface';
import { AuthResponseData } from 'src/app/core/http/api.interfaces';
import { ApiService } from 'src/app/core/http/api.service';
import { CookieDataService } from 'src/app/core/http/tools/cookie-data.service';

/**
 * auth.service.ts
 * User Authentication
 */

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Userdata
  public user$ = new BehaviorSubject<User>(null);
  // Userdata, streams with every change
  public userAuthenticated$: Observable<UserData>;
  // TODO: userForInterceptor$ löschen, wenn userID im Token ist
  // (wird nur noch im Interceptor verwendet, um die Anfrage auf die UserId zuzulassen)
  public userForInterceptor$ = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cookieDataService: CookieDataService
  ) {
    this.userAuthenticated$ = this.user$.pipe(
      map((user: User) => {
        return {
          isAuth: !!user && user.id !== 0,
          user: user,
        };
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.loginUser(email, password).pipe(
      concatMap((serverResponse: AuthResponseData) => {
        console.table(serverResponse);
        const expirationDate = new Date(
          new Date().getTime() + +serverResponse.expires_in * 1000
        );
        const user = new User(
          0,
          email,
          undefined,
          serverResponse.access_token,
          expirationDate
        );

        // Sonst kann das Token über den Interceptor nicht mitgesendet werden
        this.userForInterceptor$.next(user); // Todo: Delete

        // Todo: Die UserID und Namen im Token mitsenden,
        // dann muss man hier keine weiteren Abfragen machen
        return this.apiService.getUserByEmail(email).pipe(
          tap((userDataArr) => {
            //console.log('UserData from Server: ', userDataArr);
            let userData = userDataArr[0];
            if (userData) {
              user.id = userData.id;
              user.name = userData.name;
              this.user$.next(user);
              this.userForInterceptor$.next(user);
              this.cookieDataService.setLocalStorageItem('userData',JSON.stringify(user) );
              const expirationDuration =
                new Date(user.tokenExpirationDate).getTime() -
                new Date().getTime();
              this.autoLogout(expirationDuration);
            }
          })
        );
      })
    );
  }

  logout() {
    this.user$.next(null);
    this.userForInterceptor$.next(null);
    this.cookieDataService.deleteLocalStorageItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin() {
    // Userdaten sind jetzt mit ID und Namen im localStorage
    const userData: {
      id: number;
      email: string;
      name: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(this.cookieDataService.getLocalStorageItem('userData'));

    if (!userData || !userData._token) {
      this.user$.next(null);
      this.userForInterceptor$.next(null);
      return;
    }

    //console.log('UserData: ', userData);
    //console.log('LocalStorage' + JSON.stringify(localStorage.getItem('userData')));

    const user = new User(
      userData.id,
      userData.email,
      userData.name,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    this.user$.next(user);
    this.userForInterceptor$.next(user);
  }
}
