import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KIPlaygroundComponent } from 'src/app/sites/ki-tools/pages/ki-playground/ki-playground.component';

const routes: Routes = [
  {
    path: '',
    component: KIPlaygroundComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KiToolsRoutingModule {}
