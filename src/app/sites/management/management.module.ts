import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageLandingComponent } from './pages/manage-landing/manage-landing.component';
import { ManageOffersComponent } from './pages/offers/manage-offers/manage-offers.component';
import { ManagementRoutingModule } from './management-routing.module';
import { EditOfferComponent } from './pages/offers/edit-offer/edit-offer.component';
import { CreateOfferComponent } from './pages/offers/create-offer/create-offer.component';
import { BreadcrumbHeaderComponent } from './components/breadcrumb-header/breadcrumb-header.component';
import { OfferTableComponent } from './components/offer-table/offer-table.component';
import { SortableHeaderDirective } from './components/offer-table/component/sortable-header.directive';



@NgModule({
  declarations: [
    ManageLandingComponent,
    ManageOffersComponent,
    EditOfferComponent,
    CreateOfferComponent,
    OfferTableComponent,
    BreadcrumbHeaderComponent,
    SortableHeaderDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ManagementModule {}
