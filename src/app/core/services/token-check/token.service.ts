import { AuthTokenStructure } from 'src/app/core/auth/auth.interfaces';
import { Injectable } from '@angular/core';
import { CookieDataService } from 'src/app/core/services/cookie/cookie-data.service';
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

  private ACCESS_TOKEN = 'fs_atoken';
  private REFRESH_TOKEN = 'fs_rtoken';

  constructor(private cookieDataService: CookieDataService) {}

  // NEW ///////////////////////
  public saveAccessToken(token: string) {
    this.cookieDataService.setLocalStorageItem(this.ACCESS_TOKEN, token);
  }

  public getAccessToken(): string {
    return this.cookieDataService.getLocalStorageItem(this.ACCESS_TOKEN);
  }

  public saveRefreshToken(token: string) {
    this.cookieDataService.setLocalStorageItem(this.REFRESH_TOKEN, token);
  }

  public getRefreshToken(): string {
    return this.cookieDataService.getLocalStorageItem(this.REFRESH_TOKEN);
  }

  public removeAccessToken() {
    this.cookieDataService.deleteLocalStorageItem(this.ACCESS_TOKEN);
  }

  public removeRefreshToken() {
    this.cookieDataService.deleteLocalStorageItem(this.REFRESH_TOKEN);
  }
  /////////////////////////

  public decodeToken(token: string): AuthTokenStructure | null {
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

  public getDecodedToken(token: string): AuthTokenStructure {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  public removeOldToken() {
    this.cookieDataService.deleteLocalStorageItem('userData');
  }

}
