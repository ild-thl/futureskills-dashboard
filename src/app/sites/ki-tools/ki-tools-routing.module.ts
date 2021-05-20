import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiToolsComponent } from 'src/app/sites/ki-tools/pages/ki-tools.component';

const routes: Routes = [
  {
    path: '',
    component: KiToolsComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KiToolsRoutingModule {}
