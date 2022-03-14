import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageLandingComponent } from './pages/manage-landing/manage-landing.component';
import { ManageOffersComponent } from './pages/offers/manage-offers/manage-offers.component';
import { EditOfferComponent } from './pages/offers/edit-offer/edit-offer.component';
import { CreateOfferComponent } from './pages/offers/create-offer/create-offer.component';

const routes: Routes = [
  {
    path: '',
    component: ManageLandingComponent,
  },
  {
    path: 'kurse',
    component: ManageOffersComponent,
  },
  {
    path: 'kurs/neu',
    component: CreateOfferComponent,
  },
  {
    path: 'kurs/edit/:id',
    component: EditOfferComponent,
  },
  {
    path: 'kurs/edit',
    redirectTo: 'kurs/neu'
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
