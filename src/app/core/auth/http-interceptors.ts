import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenCheckInterceptor } from '../interceptors/token-check.interceptor';
import { AuthInterceptorService } from 'src/app/core/interceptors/auth-interceptor.service';

export const httpInterceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenCheckInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true,
  },
];
