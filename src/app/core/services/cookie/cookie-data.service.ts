import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieData, ICookieData } from 'src/app/core/models/cookie-data';
import { CookieService } from 'ngx-cookie-service';
import { StaticService } from 'src/app/config/static.service';

@Injectable({
  providedIn: 'root',
})
export class CookieDataService {
  private cookieName: string;
  private cookie = new CookieData();
  private _localStorageIsOk: boolean = null;
  public get localStorageIsOk(): boolean {
    return this._localStorageIsOk;
  }

  private _cookieInfo$ = new BehaviorSubject<CookieData>(this.cookie);
  public get cookieInfos$() {
    return this._cookieInfo$;
  }

  constructor(
    private cookieService: CookieService,
    private options: StaticService
  ) {
    this.cookieName = options.getCookieOptions().preferenceCookieName;
  }

  public checkCookies(): void {
    const cookieExists: boolean = this.cookieService.check(this.cookieName);

    if (cookieExists && !this.cookie.cookieSet) {
      this.cookie.cookieSet = true;
      this.cookie.technical = true; //default
      const cookiePrefs = this.getCookiePreferences();
      this.cookie.functional = cookiePrefs.functional;
      this._cookieInfo$.next(this.cookie);
    }
  }

  /**
   * Saves CookieData
   * @param cookieData
   */
  public saveCookieInfo(cookieData: ICookieData) {
    this.cookie.cookieSet = true;
    this.cookie.technical = true; //default
    this.cookie.functional = cookieData.functional;

    this.saveCookiePreferences({
      technical: this.cookie.technical,
      functional: this.cookie.functional,
    });
    this._cookieInfo$.next(this.cookie);
  }

  private saveCookiePreferences(cookieData: ICookieData) {

    const cookieConvertedValue = this.convertToCookieString(cookieData);
    const exp: number = this.options.getCookieOptions().technical.expiresIn;
    this.cookieService.set(this.cookieName, cookieConvertedValue, {
      expires: exp,
    });
  }

  private getCookiePreferences(): ICookieData {
    const cookieConvertedValue = this.cookieService.get(this.cookieName);
    const cookieValue = this.convertToDataObject(cookieConvertedValue);

    return cookieValue;
  }

  private convertToCookieString(cookieData: ICookieData): string {
    const cookieString = JSON.stringify(cookieData);
    return btoa(cookieString);
  }

  private convertToDataObject(cookieString: string): ICookieData {
    const dataObject = atob(cookieString);
    return JSON.parse(dataObject);
  }

  // //////////////////////////////
  // LOCAL STORAGE
  // /////////////////////////////

  public checkLocalStorage() {
    this._localStorageIsOk = this.testLocalStorage();

  }

  private testLocalStorage(): boolean {
    var test = 'testLocalStorage';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  public setLocalStorageItem(key: string, value: string): boolean {
    if (this.localStorageIsOk === null) this.checkLocalStorage();

    if (this.localStorageIsOk === true) {
      localStorage.setItem(key, value);
      return true;
    } else {
      return false;
    }
  }

  public getLocalStorageItem(key: string): string {
    if (this.localStorageIsOk === null) this.checkLocalStorage();

    if (this.localStorageIsOk === true) {
      return localStorage.getItem(key);
    } else {
      return null;
    }
  }

  public deleteLocalStorageItem(key: string) {
    if (this.localStorageIsOk === null) this.checkLocalStorage();

    if (this.localStorageIsOk === true) {
      localStorage.removeItem(key);
    }
  }
}
