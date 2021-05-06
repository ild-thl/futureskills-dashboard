import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // TODO: userChanged$ nehmen, wenn user_id mitgesendet wird
    console.log('HTTP Request', req);
    return this.authService.userForInterceptor$.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }

        const headerSettings: { [name: string]: string | string[] } = {};

        for (const key of req.headers.keys()) {
          headerSettings[key] = req.headers.getAll(key);
        }

        headerSettings['Authorization'] = 'Bearer ' + user.token;

        headerSettings['Content-Type'] = 'application/json';
        const newHeader = new HttpHeaders(headerSettings);

        const modifiedReq = req.clone({
          headers: newHeader,
        });

        return next.handle(modifiedReq);
      })
    );
  }
}
