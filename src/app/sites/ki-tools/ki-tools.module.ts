import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { KiToolsRoutingModule } from './ki-tools-routing.module';
import { KiToolsComponent } from './pages/ki-tools.component';

@NgModule({
  declarations: [KiToolsComponent],
  imports: [
    SharedModule,
    KiToolsRoutingModule,
  ]
})
export class KiToolsModule { }
