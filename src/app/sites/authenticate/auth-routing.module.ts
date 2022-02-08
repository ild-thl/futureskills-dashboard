import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SsoAuthComponent } from './pages/sso-auth/sso-auth.component';
import { AuthLandingComponent } from './pages/auth-landing/auth-landing.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLandingComponent,
  },
  {
    path: 'redirect',
    component: SsoAuthComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
