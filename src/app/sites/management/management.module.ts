import { OfferTableModule } from './modules/offer-table/offer-table.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageLandingComponent } from './pages/manage-landing/manage-landing.component';
import { ManageOffersComponent } from './pages/offers/manage-offers/manage-offers.component';
import { ManagementRoutingModule } from './management-routing.module';
import { EditOfferComponent } from './pages/offers/edit-offer/edit-offer.component';
import { CreateOfferComponent } from './pages/offers/create-offer/create-offer.component';

@NgModule({
  declarations: [
    ManageLandingComponent,
    ManageOffersComponent,
    EditOfferComponent,
    CreateOfferComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    OfferTableModule
  ]
})
export class ManagementModule { }
