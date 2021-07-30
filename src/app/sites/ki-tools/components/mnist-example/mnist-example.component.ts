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
import { KIToolsTypes } from '../../interfaces/types';
import { AlertList } from '../../services/helper/helper';

declare var tf: any;

@Component({
  selector: 'fs-mnist-example',
  templateUrl: './mnist-example.component.html',
  styleUrls: ['./mnist-example.component.scss'],
})
export class MNISTExampleComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public width = 200;
  @Input() public height = 200;
  @Input() public modus = 'window';
  @Input() scriptLoadingStatus: KIToolsTypes.ScriptLoadingStatus;

  @ViewChild(DrawableCanvasComponent) drawablecanvas: DrawableCanvasComponent;
  @ViewChildren('tableCanvas') public tablerow: QueryList<ElementRef>;

  private THRESHOLD = 1.0;
  private MAYBE = 0.95;

  private MODEL_SIZE = 28;
  modelLoaded = false;
  private viewIsInitialized = false;

  private model: any;
  predicted: string = '';
  prediction_available: boolean = false;
  miniCanvasHTMLElement: HTMLCanvasElement;
  miniCanvasHTMLContext: CanvasRenderingContext2D;
  predictions: string[] = [];
  predictionIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  private tableRowSubscription: Subscription;

  textIfSure = [
    'Ich glaube die Zahl ist eine ',
    'Ich denke die Zahl ist eine '
  ];
  textIfUnknown = 'Ich kann die Zahl nicht erkennen.';
  textMayBe = 'Ich kann die Zahl nicht genau erkennen. Vielleicht ist es eine ';
  textPrediction = '';
  alertList: AlertList = new AlertList();

  constructor(
    private kiService: KiStatusService,
    private staticService: StaticService,
    private renderer: Renderer2
  ) {}

  lnkKITools = this.staticService.getPathInfo().lnkKITools;
  kiToolsModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;

  ngOnChanges() {
    if (this.scriptLoadingStatus.isLoaded && !this.modelLoaded){
      this.loadingModel();
    }

    if (this.scriptLoadingStatus.isError){
      this.alertList.addAlert('danger', 'Die benötigten Daten konnten leider nicht geladen werden.');
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
      const img = tf.browser.fromPixels(imageData, 1);
      const resized = tf.image.resizeBilinear(img, [28, 28]);
      const tensor = resized.expandDims(0);
      const prediction = this.model.predict(tensor);
      return prediction;
    });
    this.showResults(pred);
  }

  private loadingModel() {
    this.kiService.loadMNISTModel().subscribe((model) => {
      this.model = model;
      this.modelLoaded = true;
      //console.log(this.model.summary());
    });
  }

  private showResults(prediction: any) {
    let predictionArr = Array.from(prediction.dataSync()) as number[];
    console.log('Predictions => ', predictionArr);

    const maxValue = tf.argMax(prediction, 1).dataSync()[0];
    const pMaxValue = tf.max(prediction, 1).dataSync()[0];
    console.log('MaxValue: ', maxValue, "P(MaxValue): ", pMaxValue);
    


    if (pMaxValue >= this.THRESHOLD) {
      this.textPrediction = this.textIfSure[this.randomNumber(0,this.textIfSure.length-1)];
      this.predicted = maxValue.toString() + '.';
    } else if (pMaxValue >= this.MAYBE) {
      this.textPrediction = this.textMayBe;
      this.predicted = maxValue.toString() + '.';
    } else {
      this.textPrediction = this.textIfUnknown;
      this.predicted = '';
    }

    this.prediction_available = true;

    for (let i = 0; i < predictionArr.length; i++) {
      const tempStr = predictionArr[i].toFixed(10).substr(0,4);
      this.predictions[i] = tempStr;
    }
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

  private randomNumber(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  /**
   * 
   * @param predictions @deprecated
   * @returns 
   */
  private getPredictedNumber(predictions: any[]) {
    return predictions
      .map((x: any, i: any) => [x, i])
      .reduce((b: any, a: any) => (a[0] > b[0] ? a : b))[1];
  }
}
