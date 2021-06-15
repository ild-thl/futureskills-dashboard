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
  predicted: string = '';
  public predictions = new Array(10);
  miniCanvasHTMLElement: HTMLCanvasElement;
  miniCanvasHTMLContext: CanvasRenderingContext2D;

  constructor(private kiService: KiStatusService, private staticService: StaticService) {}

  lnkKITools = this.staticService.getPathInfo().lnkKITools;
  kiToolsModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;

  ngOnChanges() {
    if (this.scriptLoaded && !this.modelLoaded) {
      this.loadingModel();
    }
  }

  ngOnInit(): void {}

  loadingModel() {
    this.kiService.loadMNISTModel().subscribe(model=>{
      this.model = model;
      this.modelLoaded = true;
      //console.log(this.model.summary());
    })

  }

  async predict(imageData: ImageData) {
    const pred = await tf.tidy(() => {
      // Convert the canvas pixels to
      let img = tf.browser.fromPixels(imageData, 1);
      let imgtmp = img.reshape([1, 28, 28, 1]);
      img = tf.cast(imgtmp, 'float32');

      // Make and format the predications
      const output = this.model.predict(img) as any;
      let pred = Array.from(output.dataSync());
      console.log(pred);

      for (let i = 0; i < pred.length; i++) {
        let nrPred = +pred[i];
        this.predictions[i] = nrPred.toFixed(2).toString();

        if (pred[i] == '1') {
          this.predicted = i.toString();
        } else {
        }
      }
      if (this.predicted == '') {
        this.predicted = ':(';
      }
    });
  }

  onClearButtonClicked(){
    this.drawablecanvas.clearCanvas();
    this.predicted='';
  }
}
