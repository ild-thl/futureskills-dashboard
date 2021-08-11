import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, concatMap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { PossibleUserRoles, User } from 'src/app/core/models/user';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { AuthResponseData, AuthTokenStructure } from 'src/app/core/auth/auth.interfaces';
import { ApiService } from 'src/app/core/http/api/api.service';
import { CookieDataService } from 'src/app/core/services/cookie/cookie-data.service';
import { StaticService } from 'src/app/config/static.service';
import jwt_decode from 'jwt-decode';

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
  private tokenExpirationTimer: any;

  lnkAfterLogout = this.staticConfig.getRoutingInfo().lnkAfterLogout;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cookieDataService: CookieDataService,
    private staticConfig: StaticService
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

  login(email: string, password: string): Observable<User> {
    return this.apiService.loginUser(email, password).pipe(
      map((serverResponse: AuthResponseData) => {
        // console.table(serverResponse);
        const expirationDate = new Date(new Date().getTime() + +serverResponse.expires_in * 1000);
        const decoded = this.getDecodedToken(serverResponse.access_token);
        // console.log('Decoded Token: ', decoded);
        const user_role =
          decoded.user_role == undefined ? PossibleUserRoles.DEFAULT : decoded.user_role;
        const user = new User(
          decoded.user_id,
          email,
          decoded.user_name,
          user_role,
          serverResponse.access_token,
          expirationDate
        );
        this.user$.next(user);
        this.cookieDataService.setLocalStorageItem('userData', JSON.stringify(user));
        const expirationDuration =
          new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
        return user;
      })
    );
  }

  logout() {
    this.user$.next(null);
    this.cookieDataService.deleteLocalStorageItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate([this.lnkAfterLogout]);
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
      role: PossibleUserRoles;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(this.cookieDataService.getLocalStorageItem('userData'));

    if (!userData || !userData._token) {
      this.user$.next(null);
      return;
    }
 
    // Übergangsweise checken ob die Rolle im localStorage ist, Standard ist default
    const user_role = userData.role == undefined ? PossibleUserRoles.DEFAULT : userData.role ;

    //console.log('UserData: ', userData);
    //console.log('LocalStorage' + JSON.stringify(localStorage.getItem('userData')));

    const user = new User(
      userData.id,
      userData.email,
      userData.name,
      user_role,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    console.log('User (localStorage): ', user);
    this.user$.next(user);
  }

  private getDecodedToken(token: string): AuthTokenStructure {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
