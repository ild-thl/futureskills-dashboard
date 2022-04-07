import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageLandingComponent } from './pages/manage-landing/manage-landing.component';
import { ListOffersComponent } from './pages/manage-offers/list-offer/list-offers.component';
import { EditOfferComponent } from './pages/manage-offers/edit-offer/edit-offer.component';
import { CreateOfferComponent } from './pages/manage-offers/create-offer/create-offer.component';
import { OfferEditComponent } from './pages/alt/offer-edit/offer-edit.component';
import { ManagementGuard } from 'src/app/core/guards/management.guard';
import { Objects, Permissions } from 'src/app/core/models/permissions';

const routes: Routes = [
  {
    path: '',
    component: ManageLandingComponent,
    canActivate: [ManagementGuard],
    data: { object: Objects.OFFERS, permission: Permissions.ADMINACCESS },
  },
  {
    path: 'kurse',
    component: ListOffersComponent,
  },
  {
    path: 'kurs/neu',
    component: CreateOfferComponent,
    canActivate: [ManagementGuard],
    data: { object: Objects.OFFERS, permission: Permissions.ADMINACCESS },
  },
  {
    path: 'kurs/edit/:id',
    component: EditOfferComponent,
    canActivate: [ManagementGuard],
    data: { object: Objects.OFFERS, permission: Permissions.ADMINACCESS },
  },
  {
    path: 'kurs/edit',
    redirectTo: 'kurs/neu'
  },
  {
    path: 'kurs/alt/edit/:id',
    component: OfferEditComponent,
    canActivate: [ManagementGuard],
    data: { object: Objects.OFFERS, permission: Permissions.ADMINACCESS },
  },
  {
    path: 'kurs/alt/neu',
    component: OfferEditComponent,
    canActivate: [ManagementGuard],
    data: { object: Objects.OFFERS, permission: Permissions.ADMINACCESS },
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
