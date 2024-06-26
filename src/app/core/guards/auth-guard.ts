import {
  UrlTree,
  Router,
  CanLoad,
  Route,
  UrlSegment,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StaticService } from 'src/app/config/static.service';
import { TokenService } from 'src/app/core/services/token-check/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
  lnkLogin = this.staticConfig.getPathInfo().lnkLogin;
  lnkNotAllowed = this.staticConfig.getPathInfo().lnkNotAllowed;
  constructor(
    private router: Router,
    private staticConfig: StaticService,
    private tokenService: TokenService,
  ) {}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const token = this.tokenService.getAccessToken();
    const isAuth = token !== null;
    // eslint-disable-next-line no-console
    console.log("Try to access management-pages. Access: ", isAuth);
    if (!isAuth){
      return this.router.createUrlTree([this.lnkLogin]);
    } else {
      return true;
    }
  }
}
