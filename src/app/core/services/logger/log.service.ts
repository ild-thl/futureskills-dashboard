import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ILogService } from './log.interface';

/* eslint-disable no-console */

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
  info(description: string, value: any = ''): void {
    if (!environment.production) {
      console.info(description, value);
    }
  }
  log(description: string, value: any = ''): void {
    if (!environment.production) {
      console.log(description, value);
    }
  }
  warn(description: string, value: any = ''): void {
    if (!environment.production) {
      console.warn(description, value);
    }
  }
  error(description: string, value: any = ''): void {
    if (!environment.production) {
      console.error(description, value);
    }
  }
  table(data: any): void {
    if (!environment.production) {
      console.table(data);
    }
  }
}
