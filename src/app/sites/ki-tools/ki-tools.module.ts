import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { KiToolsRoutingModule } from './ki-tools-routing.module';
import { KiStatusService } from './services/ki-status.service';
import { MNISTExampleComponent } from './components/mnist-example/mnist-example.component';
import { KIPlaygroundComponent } from './pages/ki-playground/ki-playground.component';
import { DrawableCanvasComponent } from './components/mnist-example/drawable-canvas/drawable-canvas.component';
import { NgbdMnistModalComponent } from './pages/mnist/mnist-modal/mnist-modal.component';
import { MnistComponent } from './pages/mnist/mnist-standalone/mnist.component';
import { MnistLinkFooterComponent } from './components/mnist-example/mnist-link-footer/mnist-link-footer.component';

@NgModule({
  declarations: [
    MNISTExampleComponent,
    KIPlaygroundComponent,
    MnistComponent,
    DrawableCanvasComponent,
    NgbdMnistModalComponent,
    MnistLinkFooterComponent
  ],
  imports: [SharedModule, KiToolsRoutingModule],
  providers: [KiStatusService]
})
export class KiToolsModule {}
