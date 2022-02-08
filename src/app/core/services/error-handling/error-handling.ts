import { Injectable } from '@angular/core';

export type ErrorSource = 'default' | 'offers' | 'offer' | 'login';
export enum ErrorCodes {
  UNKNOWN = 'unknown_error',
  E0 = 'failure',
  E200 = 'ok',
  E400 = 'bad_request',
  E401 = 'unauthorized',
  E403 = 'forbidden',
  E404 = 'not_found',
  E422 = 'unprocessable_entity',
  E429 = 'too_many_requests',
  E500 = 'internal_server_errior',
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private _ERROR_MESSAGES = {
    UNKNOWN_ERROR: 'Ein unbekannter Fehler ist aufgetreten.',
    DEFAULT_ERROR: 'Ein Fehler ist aufgetreten.',
    E0_DEFAULT_SERVICE_UNAVAILABLE: 'Der Service ist aktuell nicht erreichbar.',
    E400_DEFAULT_BAD_REQUEST: 'Die Daten sind nicht korrekt.',
    E400_LOGIN_BAD_REQUEST: 'E-Mail oder Passwort sind nicht korrekt.',
    E401_DEFAULT_UNAUTHORIZED: 'Die Anfrage kann ohne Authentifizierung nicht durchgeführt werden.',
    E403_DEFAULT_FORBIDDEN: 'Es fehlt die Berechtigung Daten zu lesen oder zu bearbeiten.',
    E403_OFFER_FORBIDDEN: 'Es fehlen die Rechte um diesen Kurs zu bearbeiten.',
    E404_DEFAULT_NOT_FOUND: 'Die angeforderten Daten konnten nicht gefunden werden.',
    E404_OFFERS_NOT_FOUND:
    'Es konnten leider keine Kurse geladen werden. Bitte versuche es später noch einmal.',
    E404_OFFER_NOT_FOUND: 'Der Kurs konnte leider nicht gefunden werden.',
    E422_DEFAULT_UNPROCESSABLE: 'Die Daten konnten nicht verarbeitet werden.',
    E429_DEFAULT_TOO_MANY_REQUESTS: 'Ein Fehler ist aufgetreten.',
    E500_DEFAULT_SERVER_ERROR: 'Der Server kann die Anfrage aktuell nicht bearbeiten.',
  };
  public get ERROR_MESSAGES() {
    return this._ERROR_MESSAGES;
  }

  private defaultErrorMap = new Map();
  private loginErrorMap = new Map();
  private offersErrorMap = new Map();
  private offerErrorMap = new Map();

  constructor() {
    this.setDefaultMapTexts();
    this.setLoginTexts();
    this.setOffersTexts();
  }

  public getErrorMessage(error: Error, target: ErrorSource = 'default') {
    switch (target) {
      case 'login':
        if (this.loginErrorMap.has(error.message)) {
          return this.loginErrorMap.get(error.message);
        } else {
          return this.getDefaultErrorMessage(error);
        }
        break;
      case 'offer':
        if (this.offerErrorMap.has(error.message)) {
          return this.offerErrorMap.get(error.message);
        } else {
          return this.getDefaultErrorMessage(error);
        }
        break;
      case 'offers':
        if (this.offersErrorMap.has(error.message)) {
          return this.offersErrorMap.get(error.message);
        } else {
          return this.getDefaultErrorMessage(error);
        }
        break;
      default:
        return this.getDefaultErrorMessage(error);
    }
  }

  public getDefaultErrorMessage(error: Error) {
    return this.defaultErrorMap.has(error.message)
      ? this.defaultErrorMap.get(error.message)
      : this.ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  private setDefaultMapTexts() {
    // Unknown
    this.defaultErrorMap.set(ErrorCodes.UNKNOWN, this.ERROR_MESSAGES.UNKNOWN_ERROR);

    // Der Dienst läuft nicht, API nicht erreichbar
    this.defaultErrorMap.set(ErrorCodes.E0, this.ERROR_MESSAGES.E0_DEFAULT_SERVICE_UNAVAILABLE);

    // 400 - (Bad Request) Beim Login sind Name/Passswort nicht korrekt
    this.defaultErrorMap.set(ErrorCodes.E400, this.ERROR_MESSAGES.E400_DEFAULT_BAD_REQUEST);

    // 401 - (Unauthorized) - Zugriff auf Serverbereiche die nicht authorisiert sind
    this.defaultErrorMap.set(ErrorCodes.E401, this.ERROR_MESSAGES.E401_DEFAULT_UNAUTHORIZED);

    // 403 - (Forbidden)
    this.defaultErrorMap.set(ErrorCodes.E403, this.ERROR_MESSAGES.E403_DEFAULT_FORBIDDEN);

    // 404 - (Not Found) Der Pfad ist nicht korrekt oder es konnten allgemein keine Daten gefunden werden.
    this.defaultErrorMap.set(ErrorCodes.E404, this.ERROR_MESSAGES.E404_DEFAULT_NOT_FOUND);

    // 422 - (Unprocessable Entity)
    this.defaultErrorMap.set(ErrorCodes.E422, this.ERROR_MESSAGES.E422_DEFAULT_UNPROCESSABLE);

    // 429 - (Too many requests)
    this.defaultErrorMap.set(ErrorCodes.E429, this.ERROR_MESSAGES.E429_DEFAULT_TOO_MANY_REQUESTS);

    // 500 - Serverfehler (meistens ist die Db nicht erreichbar)
    this.defaultErrorMap.set(ErrorCodes.E500, this.ERROR_MESSAGES.E500_DEFAULT_SERVER_ERROR);
  }

  private setLoginTexts() {
    this.loginErrorMap.set(ErrorCodes.E400, this.ERROR_MESSAGES.E400_LOGIN_BAD_REQUEST);
  }

  private setOffersTexts() {
    // Für offers
    this.offersErrorMap.set(ErrorCodes.E404, this.ERROR_MESSAGES.E404_OFFERS_NOT_FOUND);
     // Für offer
    this.offerErrorMap.set(ErrorCodes.E403, this.ERROR_MESSAGES.E403_OFFER_FORBIDDEN);
    this.offerErrorMap.set(ErrorCodes.E404, this.ERROR_MESSAGES.E404_OFFER_NOT_FOUND);
   
  }
}
