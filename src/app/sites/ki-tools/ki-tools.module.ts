import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KiToolsRoutingModule } from './ki-tools-routing.module';
import { CourseSliderModule } from './components/course-slider/course-slider.module';

import { KiStatusService } from './services/ki-status.service';
import { MNISTExampleComponent } from './components/mnist-example/mnist-example.component';
import { KIPlaygroundComponent } from './pages/ki-playground/ki-playground.component';
import { DrawableCanvasComponent } from './components/mnist-example/drawable-canvas/drawable-canvas.component';
import { NgbdMnistModalComponent } from './pages/mnist/mnist-modal.component';
import { MnistStandaloneComponent } from './pages/mnist/mnist-standalone.component';
import { EventCanvasDirective } from './components/mnist-example/drawable-canvas/event-canvas.directive';
import { SentimentStandAloneComponent } from './pages/sentiment/sentiment-standalone.component';
import { NgbdSentimentModalComponent } from './pages/sentiment/sentiment-modal.component';
import { SentimentExampleComponent } from './components/sentiment-example/sentiment-example.component';
import { DemonstratorsStandaloneComponent } from './pages/demonstrators/demonstrators-standalone.component';
import { NgbdDemonstratorsModalComponent } from './pages/demonstrators/demonstrators-modal.component';
import { ExampleCardComponent } from './components/demonstrator-example/example-card/example-card.component';
import { DemonstratorExampleComponent } from './components/demonstrator-example/demonstrator-example.component';
import { CourseListComponent } from './components/shared/course-list/course-list.component';


@NgModule({
  declarations: [
    MNISTExampleComponent,
    KIPlaygroundComponent,
    MnistStandaloneComponent,
    DrawableCanvasComponent,
    NgbdMnistModalComponent,
    EventCanvasDirective,
    SentimentStandAloneComponent,
    NgbdSentimentModalComponent,
    SentimentExampleComponent,
    DemonstratorsStandaloneComponent,
    NgbdDemonstratorsModalComponent,
    ExampleCardComponent,
    DemonstratorExampleComponent,
    CourseListComponent,
  ],
  imports: [SharedModule, KiToolsRoutingModule, ReactiveFormsModule, FormsModule, CourseSliderModule],
  providers: [KiStatusService]
})
export class KiToolsModule {}
