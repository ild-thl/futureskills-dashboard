import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageLandingComponent } from './pages/manage-landing/manage-landing.component';
import { ManageOffersComponent } from './pages/offers/manage-offers/manage-offers.component';
import { ManagementRoutingModule } from './management-routing.module';



@NgModule({
  declarations: [
    ManageLandingComponent,
    ManageOffersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ManagementModule { }
