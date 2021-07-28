import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KIPlaygroundComponent } from 'src/app/sites/ki-tools/pages/ki-playground/ki-playground.component';
import { MnistComponent } from './pages/mnist/mnist-standalone/mnist.component';
import { SentimentComponent } from 'src/app/sites/ki-tools/pages/sentiment/sentiment.component';

const routes: Routes = [
  {
    path: '',
    component: KIPlaygroundComponent,
  },
  {
    path: 'mnist',
    component: MnistComponent
  }
  ,
  {
    path: 'sentiment',
    component: SentimentComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KiToolsRoutingModule {}
