import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { ILogService } from './log.interface';
/**
 * log.service.ts
 * Service to log Console Messages
 * 01.12.2020/ml
 */

@Injectable({
  providedIn: 'root',
})
export class LogService implements ILogService {
  constructor() {}
  info(value: any, ...opt: any[]): void {
    if (!environment.production) {
      console.info(value, opt);
    }
  }
  log(value: any, ...opt: any[]): void {
    if (!environment.production) {
      console.log(value, opt);
    }
  }
  warn(value: any, ...opt: any[]): void {
    if (!environment.production) {
      console.warn(value, opt);
    }
  }
  error(value: any, ...opt: any[]): void {
    if (!environment.production) {
      console.error(value, opt);
    }
  }
}
