import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { map, take } from 'rxjs/operators';
import { StaticService } from 'src/app/config/static.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  lnkLogin = this.staticConfig.getPathInfo().lnkLogin;
  constructor(private authService: AuthService, private router: Router, private staticConfig: StaticService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree>
    | UrlTree {
    return this.authService.user$.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;

        if (isAuth) {
          return true;
        }

        return this.router.createUrlTree([this.lnkLogin]);
      })
    );
  }
}
