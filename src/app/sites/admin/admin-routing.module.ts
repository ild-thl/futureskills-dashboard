import { AdminLandingComponent } from './pages/admin-landing/admin-landing.component';
import { OfferEditComponent } from 'src/app/sites/admin/pages/offer-edit/offer-edit.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdminLandingComponent,
  },
  {
    path: 'kurs/edit/:id',
    component: OfferEditComponent,
  },
  {
    path: 'kurs/neu',
    component: OfferEditComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
