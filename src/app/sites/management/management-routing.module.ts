import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageLandingComponent } from './pages/manage-landing/manage-landing.component';
import { ManageOffersComponent } from './pages/offers/manage-offers/manage-offers.component';

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
    path: 'kurs/edit/:id',
    //component: OfferEditComponent,
  },
  {
    path: 'kurs/neu',
    //component: OfferEditComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}