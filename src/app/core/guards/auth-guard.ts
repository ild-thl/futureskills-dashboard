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
import { PermissionService } from 'src/app/core/services/permissions/permission.service';
import { User } from 'src/app/core/models/user';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  lnkLogin = this.staticConfig.getPathInfo().lnkLogin;
  lnkNotAllowed = this.staticConfig.getPathInfo().lnkNotAllowed;
  constructor(
    private authService: AuthService,
    private router: Router,
    private staticConfig: StaticService,
    private permissionService: PermissionService
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
          if (this.permissionService.checkPermission(user, route.data.object, route.data.permission)){
            return true;
          } else {
            return this.router.createUrlTree([this.lnkNotAllowed]);
          }

        }
      })
    );
  }
}
