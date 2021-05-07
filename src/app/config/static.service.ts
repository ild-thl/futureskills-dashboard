import { Injectable } from '@angular/core';
import { CustomConfig } from './static.config';

@Injectable({
  providedIn: 'root',
})
export class StaticService {
  constructor() {}
  getAllStaticOptions(): any {
    return CustomConfig;
  }
  getCookieOptions(): any {
    return CustomConfig.cookies;
  }
  getPathInfo(): any {
    return CustomConfig.paths;
  }
  getRoutingInfo(): any {
    return CustomConfig.routingInfo;
  }
}
