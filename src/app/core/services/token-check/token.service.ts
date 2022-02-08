import { AuthTokenStructure } from 'src/app/core/auth/auth.interfaces';
import { Injectable } from '@angular/core';
import { CookieDataService } from 'src/app/core/services/cookie/cookie-data.service';
import { User, UserStorageData } from 'src/app/core/models/user';
import jwt_decode from 'jwt-decode';

/**
 * token.service.
 * 14.01.20222
 * Handles token in localStorage
 */

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private EXPIRES_FACTOR = 1000;
  constructor(private cookieDataService: CookieDataService) {}

  public getToken(): string {
    const userData: UserStorageData = JSON.parse(
      this.cookieDataService.getLocalStorageItem('userData')
    );

    if (!userData || !userData.token) {
      return null;
    } else {
      return userData.token;
    }
  }

  public removeToken() {
    this.cookieDataService.deleteLocalStorageItem('userData');
  }

  public saveToken(token: string, tokenExpirationDate: Date) {
    const saveData: UserStorageData = {
      token: token,
      tokenExpirationDate: tokenExpirationDate,
    };
    this.cookieDataService.setLocalStorageItem('userData', JSON.stringify(saveData));
  }

  public getDecodedToken(token?: string): AuthTokenStructure {
    if (!token) {
      token = this.getToken();
    }

    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  public isTokenValid(token: string): boolean {
    if (token === null || token.length <= 1) {
      return false;
    }

    const decoded = this.getDecodedToken(token);
    if (token) {
      const timeDiff = new Date(decoded.exp * this.EXPIRES_FACTOR).getTime() - new Date().getTime();
      return timeDiff > 0;
    }
    return false;
  }

}
