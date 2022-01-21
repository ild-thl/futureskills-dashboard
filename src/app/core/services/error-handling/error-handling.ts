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
    E401_DEFAULT_UNAUTHORIZED: 'Die Anfrage kann ohne Authentifizierung nicht durchgeführt werden.',
    E403_DEFAULT_FORBIDDEN: 'Es fehlt die Berechtigung um auf die Daten zuzugreifen.',
    E404_DEFAULT_NOT_FOUND: 'Die angeforderten Daten konnten nicht gefunden werden.',
    E422_DEFAULT_UNPROCESSABLE: 'Die Daten konnten nicht verarbeitet werden.',
    E500_DEFAULT_SERVER_ERROR: 'Der Server kann die Anfrage aktuell nicht bearbeiten.',
    E403_OFFERS_FORBIDDEN: 'Es fehlen die Rechte um Kurse zu bearbeiten.',
    E404_OFFERS_NOT_FOUND:
      'Ein Fehler ist aufgetreten. Es konnten leider keine Angebote geladen werden.',
    E404_OFFER_NOT_FOUND: 'Der Kurs konnte leider nicht gefunden werden.',
    E422_OFFERS_INVALID_DATA: 'Die Daten konnten nicht verarbeitet werden.',
    E400_LOGIN_FAILURE: 'E-Mail oder Passwort sind nicht korrekt.',
  };
  public get ERROR_MESSAGES() {
    return this._ERROR_MESSAGES;
  }

  private _defaultErrorMap = new Map();
  public get defaultErrorMap() {
    return this._defaultErrorMap;
  }

  constructor() {
    // Unknown
    this._defaultErrorMap.set(ErrorCodes.UNKNOWN, this.ERROR_MESSAGES.UNKNOWN_ERROR);

    // Der Dienst läuft nicht, API nicht erreichbar
    this._defaultErrorMap.set(ErrorCodes.E0, this.ERROR_MESSAGES.E0_DEFAULT_SERVICE_UNAVAILABLE);

    // 400 - (Bad Request) Beim Login sind Name/Passswort nicht korrekt
    this._defaultErrorMap.set(ErrorCodes.E400, this.ERROR_MESSAGES.E400_DEFAULT_BAD_REQUEST);

    // 401 - (Unauthorized) - Zugriff auf Serverbereiche die nicht authorisiert sind
    this._defaultErrorMap.set(ErrorCodes.E401, this.ERROR_MESSAGES.E401_DEFAULT_UNAUTHORIZED);

    // 403 - (Forbidden)
    this._defaultErrorMap.set(ErrorCodes.E403, this.ERROR_MESSAGES.E403_DEFAULT_FORBIDDEN);

    // 404 - (Not Found) Der Pfad ist nicht korrekt oder es konnten allgemein keine Daten gefunden werden.
    this._defaultErrorMap.set(ErrorCodes.E404, this.ERROR_MESSAGES.E404_DEFAULT_NOT_FOUND);

    // 422 - (Unprocessable Entity)
    this._defaultErrorMap.set(ErrorCodes.E422, this.ERROR_MESSAGES.E422_DEFAULT_UNPROCESSABLE);

    // 500 - Serverfehler (meistens ist die Db nicht erreichbar)
    this._defaultErrorMap.set(ErrorCodes.E500, this.ERROR_MESSAGES.E500_DEFAULT_SERVER_ERROR);
  }

  public getErrorMessage(error: Error, target: ErrorSource = 'default') {
    switch (target) {
      case 'login':
        break;
      case 'offer':
        break;
      case 'offers':
        break;
      default:
        return this._defaultErrorMap.has(error.message)
          ? this._defaultErrorMap.get(error.message)
          : this.ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }
}
