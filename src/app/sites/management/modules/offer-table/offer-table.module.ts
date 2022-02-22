import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { OfferTableComponent } from './component/offer-table.component';

import { SortableHeaderDirective } from './sortable-header.directive';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    OfferTableComponent,
    SortableHeaderDirective
  ],
  imports: [
    SharedModule, FormsModule
  ],
  exports:[
    OfferTableComponent
  ]
})
export class OfferTableModule { }
