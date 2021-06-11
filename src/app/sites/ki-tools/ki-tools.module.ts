import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { KiToolsRoutingModule } from './ki-tools-routing.module';
import { KiToolsComponent } from './pages/ki-tools.component';
import { MNISTExampleComponent } from './components/mnist-example/mnist-example.component';
import { PredictNumberDirective } from './components/mnist-example/predict-number.directive';

@NgModule({
  declarations: [
    KiToolsComponent,
    MNISTExampleComponent,
    PredictNumberDirective
  ],
  imports: [SharedModule, KiToolsRoutingModule],
})
export class KiToolsModule {}
