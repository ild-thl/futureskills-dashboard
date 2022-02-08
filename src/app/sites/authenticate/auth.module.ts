import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { SsoAuthComponent } from './pages/sso-auth/sso-auth.component';
import { AuthLandingComponent } from './pages/auth-landing/auth-landing.component';

@NgModule({
  declarations: [SsoAuthComponent, AuthLandingComponent],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
