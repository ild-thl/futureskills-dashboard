import { StaticService } from 'src/app/config/static.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/user';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { AuthResponseData } from 'src/app/core/auth/auth.interfaces';
import { ApiService } from 'src/app/core/http/api/api.service';
import { ObjectPermission, Objects, Permissions, UserRoles } from 'src/app/core/models/permissions';
import { TokenService } from 'src/app/core/services/token-check/token.service';
import { LogService } from './../services/logger/log.service';

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
        let tmpUser: User = null;

        if (serverResponse.access_token) {
          tmpUser = this.createUserFromToken(serverResponse.access_token);
          if (tmpUser) {
            this.tokenService.saveAccessToken(serverResponse.access_token);
            this.tokenService.saveRefreshToken(serverResponse.refresh_token);
            this.logService.log('AuthService', 'login', tmpUser);
            //this.logService.log('AuthService', 'login:', tmpUser.name);
          }
        }
        if (!tmpUser) {
          // eslint-disable-next-line no-console
          console.warn('Auth:', 'Es wurde kein Token gesendet');
        }

        this.user$.next(tmpUser);
        return tmpUser;
      })
    );
  }

  /**
   * Auto-Login reading localStorage
   */
  public autoLogin() {
    // Userdaten im localStorage
    let tmpUser: User = null;
    this.tokenService.removeOldToken();
    const token = this.tokenService.getAccessToken();

    if (token) {
      tmpUser = this.createUserFromToken(token);
      if (tmpUser) {
        this.logService.log('AuthService', 'autologin: ', tmpUser);
      } else {
        this.logService.log('AuthService', 'autologout');
        this.tokenService.removeAccessToken();
        this.tokenService.removeRefreshToken();
      }
    }
    this.user$.next(tmpUser);
  }

  public logoutUser(): Observable<boolean> {
    this.logService.log('AuthService', 'logout');
    this.signOff();
    return of(true);
  }

  public logoutUserOnTokenExpired(): Observable<boolean> {
    this.logService.log('AuthService', 'logout(automatically)');
    this.signOff();
    return of(true);
  }

  private signOff() {
    this.tokenService.removeAccessToken();
    this.tokenService.removeRefreshToken();
    this.user$.next(null);
  }

  private createUserFromToken(token: string): User | null {
    let tmpUser: User = null;
    const decoded = this.tokenService.getDecodedToken(token);
    const expirationDate = new Date(decoded.exp * this.EXPIRES_FACTOR);

    if (this.tokenCheckOk(expirationDate)) {
      this.logService.log('EXP-DATE:', '', expirationDate);
      // Featurepermission setzen
      const user_role = decoded.user_role == undefined ? UserRoles.DEFAULT : decoded.user_role;
      const user_featurepermission = this.setUserPermissions(user_role);
      // User erstellen
      tmpUser = new User(
        decoded.user_id,
        undefined,
        decoded.user_name,
        user_role,
        user_featurepermission
      );
    }

    return tmpUser;
  }

  private tokenCheckOk(expirationDate: Date): boolean {
    const expirationDuration = expirationDate.getTime() - new Date().getTime();
    const logOutAutomatically = this.staticService.getAuthBehaviour().autoLogout;
    return expirationDuration > 0 || !logOutAutomatically;
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
}
