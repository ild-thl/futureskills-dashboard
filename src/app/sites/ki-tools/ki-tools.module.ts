import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { KiToolsRoutingModule } from './ki-tools-routing.module';
import { KiToolsComponent } from './pages/ki-tools.component';
import { NumberCanvasComponent } from './components/number-canvas/number-canvas.component';
import { PredictNumberDirective } from './components/number-canvas/predict-number.directive';

@NgModule({
  declarations: [
    KiToolsComponent,
    NumberCanvasComponent,
    PredictNumberDirective
  ],
  imports: [SharedModule, KiToolsRoutingModule],
})
export class KiToolsModule {}
