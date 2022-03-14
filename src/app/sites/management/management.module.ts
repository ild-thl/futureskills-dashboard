import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageLandingComponent } from './pages/manage-landing/manage-landing.component';
import { ListOffersComponent } from './pages/manage-offers/list-offer/list-offers.component';
import { ManagementRoutingModule } from './management-routing.module';
import { EditOfferComponent } from './pages/manage-offers/edit-offer/edit-offer.component';
import { CreateOfferComponent } from './pages/manage-offers/create-offer/create-offer.component';
import { BreadcrumbHeaderComponent } from './components/breadcrumb-header/breadcrumb-header.component';
import { OfferTableComponent } from './components/offer-table/offer-table.component';
import { SortableHeaderDirective } from './components/offer-table/component/sortable-header.directive';



@NgModule({
  declarations: [
    ManageLandingComponent,
    ListOffersComponent,
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
