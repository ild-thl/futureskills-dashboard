import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KiToolsComponent } from './pages/ki-tools.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: KiToolsComponent
    }])
  ]
})
export class KiToolsModule { }
