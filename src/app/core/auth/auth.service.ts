import { StaticService } from 'src/app/config/static.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/user';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { AuthResponseData } from 'src/app/core/auth/auth.interfaces';
import { ApiService } from 'src/app/core/http/api/api.service';
import { ObjectPermission, Objects, Permissions, UserRoles } from 'src/app/core/models/permissions';
import { TokenService } from 'src/app/core/services/token-check/token.service';
import { LogService } from 'src/app/core/services/logger/log.service';
import { AuthTokenStructure } from './auth.interfaces';

/**
 * auth.service.ts
 * User Authentication
 */

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // user
  public user$ = new BehaviorSubject<User>(null);
  // userdata stream
  public userAuthenticated$: Observable<UserData>;
  // exp-Date in form _x.xxxxxx
  private EXPIRES_FACTOR = 1000;
  // Logout if Token is expired on Page Start
  private logOutAutomatically: boolean;
  // Send LogoutMessage to server
  private logOutWithServer: boolean;

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private logService: LogService,
    private staticService: StaticService
  ) {
    this.userAuthenticated$ = this.user$.pipe(
      map((user: User) => {
        return {
          isAuth: !!user && user.id !== 0,
          user: user,
        };
      })
    );

    this.logOutAutomatically = this.staticService.getAuthBehaviour().autoLogout;
    this.logOutWithServer = this.staticService.getAuthBehaviour().logoutWithServer;
  }

  /**
   * Login
   * @param email
   * @param password
   * @returns
   */
  public login(email: string, password: string): Observable<User | null> {
    this.tokenService.removeOldToken(); //TO DELETE
    this.tokenService.removeAccessToken();
    this.tokenService.removeRefreshToken();

    return this.apiService.loginUser(email, password).pipe(
      map((serverResponse: AuthResponseData) => {
        return this.setUserAndTokenData(serverResponse.access_token, serverResponse.refresh_token);
      })
    );
  }

  /**
   * Auto-Login reading localStorage
   */
  public autoLogin(): void {
    // Userdaten im localStorage
    let tmpUser: User = null;
    this.tokenService.removeOldToken();
    const token = this.tokenService.getAccessToken();

    if (token) {
      const decodedToken = this.tokenService.getDecodedToken(token);
      const expirationDate = new Date(decodedToken.exp * this.EXPIRES_FACTOR);

      if (this.tokenCheckOk(expirationDate)) {
        tmpUser = this.createUserFromToken(decodedToken);
        this.logService.log('AuthService', 'autologin: ', tmpUser.name);
      } else {
        this.logService.log('AuthService', 'autologout');
        this.tokenService.removeAccessToken();
        this.tokenService.removeRefreshToken();
      }
    }
    this.user$.next(tmpUser);
  }

  /**
   * Use to logout user
   * @returns Observable<boolean>
   */
  public logoutUser(): Observable<boolean> {
    if (this.logOutWithServer){
      return this.logoutWithServerLogout();
    } 
    return this.logoutLocally();
  }

  // -----------------------------------------------------------------------
  //  getRefreshTokenFromServer and refreshLocalTokenUserData are used by AuthInterceptor
  // to Update the Token

  /**
   * RefreshToken (used by AuthInterceptor)
   * @param refreshToken
   * @returns accessToken: string; refreshToken: string
   */
  public getRefreshTokenFromServer(
    refreshToken: string
  ): Observable<{ accessToken: string; refreshToken: string } | null> {
    return this.apiService.updateUserSession(refreshToken).pipe(
      map((serverResponse: AuthResponseData) => {
        return {
          accessToken: serverResponse.access_token,
          refreshToken: serverResponse.refresh_token,
        };
      })
    );
  }

  /**
   * refreshUserData (used by AuthInterceptor)
   * @param accessToken
   * @param refreshToken
   * @returns User | null
   */
  public refreshLocalTokenUserData(accessToken: string, refreshToken: string): User | null {
    return this.setUserAndTokenData(accessToken, refreshToken);
  }

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  /**
   * Update the token manually (not used at the moment -> Manually when enter the Adminpages)
   * @param refreshToken
   * @returns Observable<User | null>
   */
  public updateUserSession(refreshToken: string): Observable<User | null> {
    //console.log('Try to refresh token');
    return this.apiService.updateUserSession(refreshToken).pipe(
      map((serverResponse: AuthResponseData) => {
        return this.setUserAndTokenData(serverResponse.access_token, serverResponse.refresh_token);
      })
    );
  }

  /**
   * Updates token in localStorage and Userdata in object
   * @param accessToken
   * @param refreshToken
   * @returns User | null
   */
  private setUserAndTokenData(accessToken: string, refreshToken: string): User | null {
    let tmpUser: User = null;
    if (accessToken) {
      this.tokenService.saveAccessToken(accessToken);
      this.tokenService.saveRefreshToken(refreshToken);
      const decodedToken = this.tokenService.getDecodedToken(accessToken);
      tmpUser = this.createUserFromToken(decodedToken);
      this.logExpDate(decodedToken, tmpUser);
    } else {
      this.logService.warn('AuthService', 'No Token from Server');
    }
    this.user$.next(tmpUser);
    return tmpUser;
  }

  /**
   * Logout User Locally Only
   */
  private logoutLocally(): Observable<boolean> {
    this.logService.log('AuthService', 'logout-locally');
    this.signOff();
    return of(true);
  }

  /**
   * SignOff User
   * Deletes the tokens and sets user to null
   * Also sends logout signal to server
   * not used at the moment
   * @returns Observable<boolean> if succeeded
   */
  private logoutWithServerLogout(): Observable<boolean> {
    return new Observable((observer$) => {
      this.apiService.logoutUser().subscribe({
        next: (response: any) => {
          this.logService.log('AuthService', 'logout-with server', response);
          this.signOff();
          observer$.next(true);
          observer$.complete();
        },
        error: (error) => {
          this.signOff();
          observer$.next(true);
          observer$.complete();
        },
      });
    });
  }

  /**
   * SignOff User
   * Deletes the tokens and sets user to null
   */
  private signOff() {
    this.tokenService.removeAccessToken();
    this.tokenService.removeRefreshToken();
    this.user$.next(null);
  }

  private createUserFromToken(decodedToken: AuthTokenStructure): User {
    let tmpUser: User = null;
    // Featurepermission setzen
    const user_role =
      decodedToken.user_role == undefined ? UserRoles.DEFAULT : decodedToken.user_role;
    const user_featurepermission = this.setUserPermissions(user_role);
    // User erstellen
    tmpUser = new User(
      decodedToken.user_id,
      undefined,
      decodedToken.user_name,
      user_role,
      user_featurepermission
    );
    return tmpUser;
  }

  private tokenCheckOk(expirationDate: Date): boolean {
    const expirationDuration = expirationDate.getTime() - new Date().getTime();

    if (expirationDuration > 0) {
      this.logService.log('AuthService:', 'TOKEN-EXP:', expirationDate);
    } else {
      this.logService.warn('AuthService:', 'Token EXPIRED', expirationDate);
    }

    return expirationDuration > 0 || !this.logOutAutomatically;
  }

  private setUserPermissions(user_role: string | string[]): ObjectPermission[] {
    const userPermissions: ObjectPermission[] = [];

    switch (user_role) {
      case UserRoles.ADMIN:
        userPermissions.push({
          object: Objects.OFFERS,
          permission: Permissions.ADMINACCESS,
        });
        break;
      case UserRoles.DEFAULT:
        userPermissions.push({
          object: Objects.OFFERS,
          permission: Permissions.NONE,
        });
        break;
    }
    return userPermissions;
  }

  private logExpDate(decodedToken: AuthTokenStructure, user: User) {
    try {
      const expirationDate = new Date(decodedToken.exp * this.EXPIRES_FACTOR);
      this.logService.log('AuthService Login-Exp:', user.name, expirationDate);
    } catch (e) {}
  }
}
