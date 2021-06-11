import { KiStatusService } from './services/ki-status.service';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { KiToolsRoutingModule } from './ki-tools-routing.module';
import { MNISTExampleComponent } from './components/mnist-example/mnist-example.component';
import { PredictNumberDirective } from './components/mnist-example/predict-number.directive';
import { KIPlaygroundComponent } from './pages/ki-playground/ki-playground.component';
import { MnistComponent } from './pages/mnist/mnist.component';

@NgModule({
  declarations: [
    MNISTExampleComponent,
    PredictNumberDirective,
    KIPlaygroundComponent,
    MnistComponent
  ],
  imports: [SharedModule, KiToolsRoutingModule],
  providers: [KiStatusService]
})
export class KiToolsModule {}
