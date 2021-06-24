import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ViewChildren,
  QueryList,
  Renderer2,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { Subscription } from 'rxjs';
import { DrawableCanvasComponent } from './drawable-canvas/drawable-canvas.component';

declare var tf: any;

@Component({
  selector: 'fs-mnist-example',
  templateUrl: './mnist-example.component.html',
  styleUrls: ['./mnist-example.component.scss'],
})
export class MNISTExampleComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public width = 200;
  @Input() public height = 200;
  @Input() scriptLoaded = false;
  @Input() public modus = 'window';

  @ViewChild(DrawableCanvasComponent) drawablecanvas: DrawableCanvasComponent;
  @ViewChildren('tableCanvas') public tablerow: QueryList<ElementRef>;

  private MODEL_SIZE = 28;
  modelLoaded = false;
  private viewIsInitialized = false;

  private model: any;
  predicted: string = '';
  prediction_available: boolean = false;
  miniCanvasHTMLElement: HTMLCanvasElement;
  miniCanvasHTMLContext: CanvasRenderingContext2D;
  predictions = [];
  predictionIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  private tableRowSubscription: Subscription;

  constructor(
    private kiService: KiStatusService,
    private staticService: StaticService,
    private renderer: Renderer2
  ) {}

  lnkKITools = this.staticService.getPathInfo().lnkKITools;
  kiToolsModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;

  ngOnChanges() {
    if (this.scriptLoaded && !this.modelLoaded) {
      this.loadingModel();
    }
  }

  ngOnInit(): void {
    this.clearText();
    this.miniCanvasHTMLElement = this.renderer.createElement('canvas') as HTMLCanvasElement;
    this.miniCanvasHTMLContext = this.miniCanvasHTMLElement.getContext('2d');
    this.miniCanvasHTMLElement.width = this.MODEL_SIZE;
    this.miniCanvasHTMLElement.height = this.MODEL_SIZE;
    this.clearMiniCanvas();
  }

  ngAfterViewInit(): void {
    if (this.tablerow.first && !this.viewIsInitialized) {
      const td = this.tablerow.first.nativeElement;
      this.renderer.appendChild(td, this.miniCanvasHTMLElement);
    }

    this.tableRowSubscription = this.tablerow.changes.subscribe((value) => {
      const tableRow = this.tablerow.first;
      //console.log('Panel ', tableRow);
      if (tableRow) {
        const td = this.tablerow.first.nativeElement;
        this.renderer.appendChild(td, this.miniCanvasHTMLElement);
      }
    });
    this.viewIsInitialized = true;
  }

  ngOnDestroy(): void {
    if (this.tableRowSubscription) this.tableRowSubscription.unsubscribe();
  }

  onClearButtonClicked() {
    this.clearContexts();
  }

  onCanvasResized(event: { width: number; height: number }) {
    // could be called before View is available
    if (this.viewIsInitialized) {
      this.clearContexts();
    }
  }

  public async predict(imageData: ImageData) {
    this.miniCanvasHTMLContext.putImageData(imageData, 0, 0);

    const pred = await tf.tidy(() => {
      // Convert Image
      let img = tf.browser.fromPixels(imageData, 1);
      let imgtmp = img.reshape([1, this.MODEL_SIZE, this.MODEL_SIZE, 1]);
      img = tf.cast(imgtmp, 'float32');

      // Predictions
      const output = this.model.predict(img) as any;
      let predictionArr = Array.from(output.dataSync());
      return predictionArr;
    });
    //console.log('Predictions => ', pred);
    this.showResults(pred);
  }

  private loadingModel() {
    this.kiService.loadMNISTModel().subscribe((model) => {
      this.model = model;
      this.modelLoaded = true;
      //console.log(this.model.summary());
    });
  }

  private getPredictedNumber(predictions: number[]) {
    return predictions
      .map((x: any, i: any) => [x, i])
      .reduce((b: any, a: any) => (a[0] > b[0] ? a : b))[1];
  }

  private showResults(predictionArr: any[]) {
    this.predicted = this.getPredictedNumber(predictionArr);
    this.prediction_available = true;
    for (let i = 0; i < predictionArr.length; i++) {
      this.predictions[i] = predictionArr[i].toFixed(2);
    }
    //console.log('AllPredictions: ', this.predictions);
  }

  private clearContexts() {
    this.drawablecanvas.clearCanvas();
    this.clearMiniCanvas();
    this.clearText();
  }

  private clearText() {
    this.predicted = '';
    this.prediction_available = false;
    this.predictions = [
      '0.00',
      '0.00',
      '0.00',
      '0.00',
      '0.00',
      '0.00',
      '0.00',
      '0.00',
      '0.00',
      '0.00',
    ];
  }

  private clearMiniCanvas() {
    this.miniCanvasHTMLContext.clearRect(
      0,
      0,
      this.miniCanvasHTMLContext.canvas.width,
      this.miniCanvasHTMLContext.canvas.height
    );
  }
}
