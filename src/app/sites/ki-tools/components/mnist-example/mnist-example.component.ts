import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { from } from 'rxjs';
import { DrawableCanvasComponent } from './drawable-canvas/drawable-canvas.component';

declare var tf: any;

@Component({
  selector: 'fs-mnist-example',
  templateUrl: './mnist-example.component.html',
  styleUrls: ['./mnist-example.component.scss'],
})
export class MNISTExampleComponent implements OnInit {
  @Input() public width = 200;
  @Input() public height = 200;
  @Input() scriptLoaded = false;
  @ViewChild(DrawableCanvasComponent) drawablecanvas: DrawableCanvasComponent;

  private modelLoaded = false;
  private model: any;
  summary: any;
  isCollapsed = true;
  predicted: string = '';
  miniCanvasHTMLElement: HTMLCanvasElement;
  miniCanvasHTMLContext: CanvasRenderingContext2D;
  predictions = [];
  predictionIndex = [0,1,2,3,4,5,6,7,8,9];
  scaledCanvas: HTMLCanvasElement;

  constructor(private kiService: KiStatusService, private staticService: StaticService) {}

  lnkKITools = this.staticService.getPathInfo().lnkKITools;
  kiToolsModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;

  ngOnChanges() {
    if (this.scriptLoaded && !this.modelLoaded) {
      this.loadingModel();
    }
  }

  ngOnInit(): void {
    this.clearPredictions();
    this.isCollapsed = false;
  }

  loadingModel() {
    this.kiService.loadMNISTModel().subscribe((model) => {
      this.model = model;
      this.modelLoaded = true;
      //console.log(this.model.summary());
    });
  }

  async predict(imageData: ImageData) {
    const pred = await tf.tidy(() => {
      // Convert Image
      let img = tf.browser.fromPixels(imageData, 1);
      let imgtmp = img.reshape([1, 28, 28, 1]);
      img = tf.cast(imgtmp, 'float32');

      // Predictions
      const output = this.model.predict(img) as any;
      let predictionArr = Array.from(output.dataSync());
      console.log('Predictions:', predictionArr);
      return predictionArr;
    });
    console.log('Predictions => ', pred);
    this.showResults(pred);
  }

  getPredictedNumber(predictions: number[]) {
    return predictions
      .map((x: any, i: any) => [x, i])
      .reduce((b: any, a: any) => (a[0] > b[0] ? a : b))[1];
  }

  getPredictedNumberOnly100Percent(predictions: number[]) {
    let returnValue: string;
    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] === 1) {
        returnValue = i.toString();
        console.log('Sicher eine: ', i);
        break;
      }
    }
    return returnValue;
  }

  showResults(predictionArr: any[]) {
    this.predicted = this.getPredictedNumberOnly100Percent(predictionArr);
    for (let i = 0; i < predictionArr.length; i++) {
      this.predictions[i] = predictionArr[i].toFixed(2);
    }
    console.log("AllPredictions: ",  this.predictions);
  }

  calculateValues(predictionArr: any[]) {
    // Zahlen als float
    let predNumberArr = [];

    for (let i = 0; i < predictionArr.length; i++) {
      if (predictionArr[i] === 1) {
        this.predicted = i.toString();
        console.log('Sicher eine: ', i);
      }
      const rounded: string = predictionArr[i].toFixed(4);
      const percent = +rounded;

      predNumberArr.push({ number: i, value: rounded, percent });
    }
    console.log(predNumberArr);
  }

  calc2(pred) {
    console.log(pred);

    this.calculateValues(pred);
    return;

    for (let i = 0; i < pred.length; i++) {
      let nrPred = +pred[i];
      pred[i] = nrPred.toFixed(2).toString();

      if (pred[i] == '1') {
        this.predicted = i.toString();
      } else {
      }
    }
    if (this.predicted == '') {
      this.predicted = ':(';
    }
  }

  onClearButtonClicked() {
    this.drawablecanvas.clearCanvas();
    this.predicted = '';
    this.clearPredictions();
  }
  clearPredictions(){
    this.predictions = ['0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00']
  }
}
