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
  info(source: string, description: string, value: any = ''): void {
    if (!environment.production) {
      console.info(source + ':' + description, value);
    }
  }
  log(source: string, description: string, value: any = ''): void {
    if (!environment.production) {
      console.log(source + ':' + description, value);
    }
  }
  warn(source: string, description: string, value: any = ''): void {
    if (!environment.production) {
      console.warn(source + ':' + description, value);
    }
  }
  error(source: string, description: string, value: any = ''): void {
    if (!environment.production) {
      console.error(source + ':' + description, value);
    }
  }
  table(data: any): void {
    if (!environment.production) {
      console.table(data);
    }
  }
}
