import { Injectable } from '@angular/core';

export enum ErrorCodes {
  UNKNOWN = 'unknown_error',
  E400 = 'e400',
  E400LOGIN = 'e400_invalid_grant',
  E401 = 'e401',
  E403 = 'e403',
  E500 = 'e500',
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private _errorMap = new Map();
  public get errorMap() {
    return this._errorMap;
  }

  private static UNKNOWN_ERROR = 'Ein unbekannter Fehler ist aufgetreten.';
  private static DEFAULT_ERROR = 'Ein Fehler ist aufgetreten.';
  private static DEFAULT_SERVER_ERROR = 'Ein Serverfehler ist aufgetreten.';

  constructor() {
    // Unknown
    this._errorMap.set(ErrorCodes.UNKNOWN, ErrorHandlerService.UNKNOWN_ERROR);

    // 400
    this._errorMap.set(ErrorCodes.E400, ErrorHandlerService.DEFAULT_ERROR);
    this._errorMap.set(ErrorCodes.E400LOGIN, 'E-Mail oder Passwort sind nicht korrekt.');
    this._errorMap.set(ErrorCodes.E401, ErrorHandlerService.DEFAULT_ERROR);
    this._errorMap.set(ErrorCodes.E403, ErrorHandlerService.DEFAULT_ERROR);

    // 500
    this._errorMap.set(ErrorCodes.E500, ErrorHandlerService.DEFAULT_SERVER_ERROR);
  }

  public getErrorMessage(error: Error) {
    return this._errorMap.has(error.message)
      ? this._errorMap.get(error.message)
      : ErrorHandlerService.UNKNOWN_ERROR;
  }
}
