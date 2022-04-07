import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/auth.service';
import { StaticService } from 'src/app/config/static.service';
import { User } from 'src/app/core/models/user';
import { PermissionService } from 'src/app/core/services/permissions/permission.service';

@Injectable({
  providedIn: 'root',
})
export class ManagementGuard implements CanActivate {
  lnkLogin = this.staticConfig.getPathInfo().lnkLogin;
  lnkNotAllowed = this.staticConfig.getPathInfo().lnkNotAllowed;
  constructor(
    private authService: AuthService,
    private router: Router,
    private permissionService: PermissionService,
    private staticConfig: StaticService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree {
    return this.authService.user$.pipe(
      take(1),
      map((user: User) => {
        const isAuth = !!user;

        if (!isAuth) {
          return this.router.createUrlTree([this.lnkLogin]);
        } else {
          if (
            this.permissionService.checkPermission(user, route.data.object, route.data.permission)
          ) {
            return true;
          } else {
            return this.router.createUrlTree([this.lnkNotAllowed]);
          }
        }
      })
    );
  }
}
