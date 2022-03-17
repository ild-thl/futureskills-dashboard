import { OfferListPaginatedComponent } from './sites/offers/pages/offer-list-paginated/offer-list-paginated.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core/guards/auth-guard';
import { ManagementGuard } from 'src/app/core/guards/management.guard';

// Pages
import { LandingComponent } from 'src/app/sites/landing/pages/landing/landing.components';
import { AuthComponent } from 'src/app/sites/login/pages/auth/auth.component';
import { ImprintComponent } from 'src/app/sites/imprint/pages/imprint/imprint.component';
import { PrivacyComponent } from 'src/app/sites/privacy/pages/privacy/privacy.component';
import { NotfoundComponent } from 'src/app/sites/not-found/pages/notfound/notfound.component';
import { InfoStudentsComponent } from 'src/app/sites/info-students/pages/info-students/info-students.component';
import { InfoTeachingComponent } from 'src/app/sites/info-teaching/pages/info-teaching/info-teaching.component';
import { OfferDetailComponent } from 'src/app/sites/offers/pages/offer-detail/offer-detail.component';
import { NotAllowedComponent } from './sites/not-allowed/pages/not-allowed.component';
import { Objects, Permissions } from 'src/app/core/models/permissions';

// Routing
// see at src/app/config for RouteVars in Links

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'kurse',
    component: OfferListPaginatedComponent,
  },
  {
    path: 'kurse/:id',
    component: OfferDetailComponent,
  },
  { path: 'login', component: AuthComponent },
  {
    path: 'impressum',
    component: ImprintComponent,
  },
  {
    path: 'datenschutz',
    component: PrivacyComponent,
  },
  {
    path: 'info-lehrende',
    component: InfoTeachingComponent,
  },
  {
    path: 'info-studierende',
    component: InfoStudentsComponent,
  },
  {
    path: 'ki-playground',
    loadChildren: () => import('./sites/ki-tools/ki-tools.module').then((s) => s.KiToolsModule),
  },
  {
    path: 'verwaltung',
    loadChildren: () => import('./sites/management/management.module').then((s) => s.ManagementModule),
    canLoad: [ManagementGuard],
    canActivate: [AuthGuard],
    data: { object: Objects.OFFERS, permission: Permissions.ADMINACCESS },
  },
  {
    path: 'auth',
    loadChildren: () => import('./sites/authenticate/auth.module').then((s) => s.AuthModule),
  },
  { path: 'kein-zugriff', component: NotAllowedComponent },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' }, // this must be the last route!
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
