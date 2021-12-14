import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { User, UserStorageData } from 'src/app/core/models/user';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { AuthResponseData, AuthTokenStructure } from 'src/app/core/auth/auth.interfaces';
import { ApiService } from 'src/app/core/http/api/api.service';
import { CookieDataService } from 'src/app/core/services/cookie/cookie-data.service';
import { StaticService } from 'src/app/config/static.service';
import { ObjectPermission, Objects, Permissions, UserRoles } from 'src/app/core/models/permissions';
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
        console.table(serverResponse);

        const decoded = this.getDecodedToken(serverResponse.access_token);
        console.log('Access-Token: ', decoded);


        const expirationDate = new Date(new Date().getTime() + +serverResponse.expires_in * 1000);
        const tokenExpires = new Date(decoded.exp);
        console.log("Expires In:", tokenExpires);
        console.log("expirationDate:", expirationDate);



        const user_role =
          decoded.user_role == undefined ? UserRoles.DEFAULT : decoded.user_role;

        const user = new User(
          decoded.user_id,
          email,
          decoded.user_name,
          user_role,
          serverResponse.access_token,
          expirationDate,
          this.setUserPermissions(user_role)
        );

        this.saveUserDataToLocalStorage(user);
        this.user$.next(user);

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
    // Userdaten im localStorage
    const user = this.loadUserDataFromLocalStorage();
    if (user) console.log('User (localStorage): ', user);
    this.user$.next(user);
  }

  private getDecodedToken(token: string): AuthTokenStructure {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  private setUserPermissions(user_role: string | string[]): ObjectPermission[] {
    const userPermissions: ObjectPermission[] = [];

    switch(user_role){
      case UserRoles.ADMIN:
        userPermissions.push({
          object: Objects.OFFERS,
          permission: Permissions.ADMINACCESS
        })
    }
    return userPermissions;
  }

  saveUserDataToLocalStorage(user: User) {
    const saveData: UserStorageData = {
      token: user.token,
      tokenExpirationDate: user.tokenExpirationDate,
    };
    this.cookieDataService.setLocalStorageItem('userData', JSON.stringify(saveData));
  }

  loadUserDataFromLocalStorage(): User {
    const userData: UserStorageData = JSON.parse(
      this.cookieDataService.getLocalStorageItem('userData')
    );
    // Kein User
    if (!userData || !userData.token) {
      return null;
    }

    const decoded = this.getDecodedToken(userData.token);
    const user_role =
    decoded.user_role == undefined ? UserRoles.DEFAULT : decoded.user_role;


    // Featurepermission setzen
    const user_featurepermission = this.setUserPermissions(user_role);

    const user = new User(
      decoded.user_id,
      undefined,
      decoded.user_name,
      user_role,
      userData.token,
      new Date(userData.tokenExpirationDate),
      user_featurepermission
    );

    return user;
  }
}
