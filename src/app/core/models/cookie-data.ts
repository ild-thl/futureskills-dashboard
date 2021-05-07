// CookieData im CookieService
export class CookieData {
  public cookieSet: boolean;
  public technical: boolean;
  public functional: boolean;
  constructor() {
    this.cookieSet = false;
    this.technical = true;
    this.functional = false;
  }
}

// Übergabeparameter an den Service
export interface ICookieData {
  technical?: boolean;
  functional: boolean;
}

