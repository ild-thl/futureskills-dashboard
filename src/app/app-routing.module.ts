import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core/guards/auth-guard';

// Pages
import { LandingComponent } from 'src/app/sites/landing/pages/landing/landing.components';
import { OfferListComponent } from 'src/app/sites/offers/pages/offer-list/offer-list.component';
import { AuthComponent } from 'src/app/sites/login/pages/auth/auth.component';
import { ImprintComponent } from 'src/app/sites/imprint/pages/imprint/imprint.component';
import { PrivacyComponent } from 'src/app/sites/privacy/pages/privacy/privacy.component';
import { NotfoundComponent } from 'src/app/sites/not-found/pages/notfound/notfound.component';
import { InfoStudentsComponent } from 'src/app/sites/info-students/pages/info-students/info-students.component';
import { InfoTeachingComponent } from 'src/app/sites/info-teaching/pages/info-teaching/info-teaching.component';
import { OfferDetailComponent } from 'src/app/sites/offers/pages/offer-detail/offer-detail.component';
import { OfferEditComponent } from 'src/app//sites/admin/pages/offer-edit/offer-edit.component';



// Routing
// see at src/app/config for RouteVars in Links

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'kurse',
    component: OfferListComponent,
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
    path: 'admin',
    loadChildren: () =>
    import('./sites/admin/admin.module').then((module)=> module.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'ki-playground',
    loadChildren: () =>
      import('./sites/ki-tools/ki-tools.module').then((s) => s.KiToolsModule),
  },
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
