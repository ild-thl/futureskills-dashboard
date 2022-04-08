import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
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
export class ManagementGuard implements CanActivate, CanActivateChild {
  lnkLogin = this.staticConfig.getPathInfo().lnkLogin;
  lnkNotAllowed = this.staticConfig.getPathInfo().lnkNotAllowed;
  constructor(
    private authService: AuthService,
    private router: Router,
    private permissionService: PermissionService,
    private staticConfig: StaticService
  ) {}

  // canActivateChild checks all child-routes
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkPermissions(childRoute);
  }
  // canActivate checks current route
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree {
    return this.checkPermissions(route);
  }

  /**
   * Only if Permission is set
   * @param route
   * @returns
   */
  checkPermissions(
    route: ActivatedRouteSnapshot
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
