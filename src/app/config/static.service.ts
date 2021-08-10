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
  getKIConfig(): any {
    return CustomConfig.kiConfig;
  }
  getKIModelPathMNIST(): any {
    return CustomConfig.kiConfig.mnistPath;
  }
  getKIModelPathSentiment(lang: string = 'en'): any {
    if (lang=='de') {
      return CustomConfig.kiConfig.sentimentPath.de;
    } else{
      return CustomConfig.kiConfig.sentimentPath.en;
    }
  }
  getCourseNumbers(): any {
    return CustomConfig.courseNumbers;
  }
}
