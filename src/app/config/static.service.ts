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
  getKIDemoLinkPath(): any {
    return CustomConfig.kiConfig.linkListPath;
  }
  getKIModelPathSentiment(lang: string = 'en'): any {
    if (lang=='de') {
      return CustomConfig.kiConfig.sentimentPath.de;
    } else{
      return CustomConfig.kiConfig.sentimentPath.en;
    }
  }
  getFilterParams(): any{
    return CustomConfig.filterParams;
  }
  getCourseNumbers(): any {
    return CustomConfig.courseNumbers;
  }
  getKeyWords(): any {
    return CustomConfig.courseKeyWords;
  }
  getKeyForSuperKICourse(): string {
    return CustomConfig.courseKeyWordKeys.keyForSuperKIKurs;
  }
  getKeyForPlaygroundKiCourse(): string {
    return CustomConfig.courseKeyWordKeys.keyForPlaygroundKIKurs;
  }
  getComponentVisibility(): any {
    return CustomConfig.general.isVisible;
  }
  getAuthBehaviour(): any {
    return CustomConfig.general.authBehaviour;
  }
  getAssetPaths():any{
    return CustomConfig.assets;
  }
}
