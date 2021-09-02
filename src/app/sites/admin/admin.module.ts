import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLandingComponent } from './pages/admin-landing/admin-landing.component';
import { AdminRoutingModule } from './admin-routing.module';

import { OfferEditComponent } from 'src/app/sites/admin/pages/offer-edit/offer-edit.component';
import { OfferRelationsSelectionComponent } from 'src/app/sites/admin/components/offer-relations-selection/offer-relations-selection.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [AdminLandingComponent, OfferEditComponent, OfferRelationsSelectionComponent],
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
