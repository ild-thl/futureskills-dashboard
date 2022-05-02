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
import { OfferTableComponent } from './pages/manage-offers/components/offer-table/offer-table.component';
import { SortableHeaderDirective } from './pages/manage-offers/components/offer-table/component/sortable-header.directive';
import { MultiselectComponent } from './pages/manage-offers/components/multiselect/multiselect.component';
import { OfferRelationsSelectionComponent } from './pages/manage-offers/components/offer-relations-selection/offer-relations-selection.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { OfferEditComponent } from './pages/alt/offer-edit/offer-edit.component';
import { BoostrapValidationDirective } from './components/directives/boostrap-validation.directive';
import { ManageCourseListService } from './services/manage-course-list.service';
import { SearchFieldAutoComponent } from './pages/manage-offers/components/search-field-auto/search-field-auto.component';

@NgModule({
  declarations: [
    ManageLandingComponent,
    ListOffersComponent,
    EditOfferComponent,
    OfferEditComponent,
    CreateOfferComponent,
    OfferTableComponent,
    BreadcrumbHeaderComponent,
    SortableHeaderDirective,
    MultiselectComponent,
    OfferRelationsSelectionComponent,
    BoostrapValidationDirective,
    SearchFieldAutoComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,
  ],
  providers: [ManageCourseListService],
})
export class ManagementModule {}
