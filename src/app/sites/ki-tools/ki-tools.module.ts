import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { KiToolsRoutingModule } from './ki-tools-routing.module';
import { KiStatusService } from './services/ki-status.service';
import { MNISTExampleComponent } from './components/mnist-example/mnist-example.component';
import { KIPlaygroundComponent } from './pages/ki-playground/ki-playground.component';
import { DrawableCanvasComponent } from './components/mnist-example/drawable-canvas/drawable-canvas.component';
import { NgbdMnistModalComponent } from './pages/mnist/mnist-modal.component';
import { MnistStandaloneComponent } from './pages/mnist/mnist-standalone.component';
import { MnistLinkFooterComponent } from './components/mnist-example/mnist-link-footer/mnist-link-footer.component';
import { EventCanvasDirective } from './components/mnist-example/drawable-canvas/event-canvas.directive';
import { SentimentStandAloneComponent } from './pages/sentiment/sentiment-standalone.component';
import { SentimentModalComponent } from './pages/sentiment/sentiment-modal.component';
import { SentimentExampleComponent } from './components/sentiment-example/sentiment-example.component';

@NgModule({
  declarations: [
    MNISTExampleComponent,
    KIPlaygroundComponent,
    MnistStandaloneComponent,
    DrawableCanvasComponent,
    NgbdMnistModalComponent,
    MnistLinkFooterComponent,
    EventCanvasDirective,
    SentimentStandAloneComponent,
    SentimentModalComponent,
    SentimentExampleComponent
  ],
  imports: [SharedModule, KiToolsRoutingModule],
  providers: [KiStatusService]
})
export class KiToolsModule {}
