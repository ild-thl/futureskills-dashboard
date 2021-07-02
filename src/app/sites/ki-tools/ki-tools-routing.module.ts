import { MnistComponent } from './pages/mnist/mnist-standalone/mnist.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KIPlaygroundComponent } from 'src/app/sites/ki-tools/pages/ki-playground/ki-playground.component';

const routes: Routes = [
  {
    path: '',
    component: KIPlaygroundComponent,
  },
  {
    path: 'mnist',
    component: MnistComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KiToolsRoutingModule {}
