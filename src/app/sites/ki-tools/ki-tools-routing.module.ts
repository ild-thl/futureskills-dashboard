import { DemonstratorsStandaloneComponent } from './pages/demonstrators/demonstrators-standalone.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KIPlaygroundComponent } from 'src/app/sites/ki-tools/pages/ki-playground/ki-playground.component';
import { MnistStandaloneComponent } from './pages/mnist/mnist-standalone.component';
import { SentimentStandAloneComponent } from 'src/app/sites/ki-tools/pages/sentiment/sentiment-standalone.component';

const routes: Routes = [
  {
    path: '',
    component: KIPlaygroundComponent,
  },
  {
    path: 'mnist',
    component: MnistStandaloneComponent
  }
  ,
  {
    path: 'sentiment',
    component: SentimentStandAloneComponent
  },
  {
    path: 'examples',
    component: DemonstratorsStandaloneComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KiToolsRoutingModule {}
