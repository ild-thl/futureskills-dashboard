import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLandingComponent } from 'src/app/sites/admin/pages/admin-landing/admin-landing.component';
import { AdminRoutingModule } from 'src/app/sites/admin/admin-routing.module';

import { OfferEditComponent } from 'src/app/sites/admin/pages/offer-edit/offer-edit.component';
import { OfferRelationsSelectionComponent } from 'src/app/sites/admin/components/offer-relations-selection/offer-relations-selection.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MultiselectComponent } from './components/multiselect/multiselect.component';

@NgModule({
  declarations: [
    AdminLandingComponent,
    OfferEditComponent,
    OfferRelationsSelectionComponent,

    MultiselectComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,
  ],
  providers: [],
})
export class AdminModule {}
