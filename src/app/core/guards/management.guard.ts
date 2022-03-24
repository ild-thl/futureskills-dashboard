import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManagementGuard implements CanLoad {
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // TODO: erst gar nicht laden (muss zusammen mit den loadChildren der Module implementiert werden)
    return true;
  }
}
