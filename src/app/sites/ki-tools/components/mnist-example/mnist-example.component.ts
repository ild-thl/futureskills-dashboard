import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { from, Subject } from 'rxjs';

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
  //@ViewChild('minicanvas', { static: true }) public minicanvas: ElementRef;

  private model: any;
  predicted: string = '';
  private modelLoaded = false;
  public predictions = new Array(10);
  miniCanvasHTMLElement: HTMLCanvasElement;
  miniCanvasHTMLContext: CanvasRenderingContext2D;

  constructor(private kiService: KiStatusService, private staticService: StaticService) {}

  eventSubject: Subject<string> = new Subject<string>();

  lnkKITools = this.staticService.getPathInfo().lnkKITools;
  kiToolsModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;

  ngOnChanges() {
    console.log('Scripts loaded: ', this.scriptLoaded);
    if (this.scriptLoaded) {
      this.loadingModel();
    }
  }

  ngAfterViewInit() {
    //this.miniCanvasHTMLElement = this.minicanvas.nativeElement;
    //this.miniCanvasHTMLContext = this.miniCanvasHTMLElement.getContext('2d');
  }

  ngOnInit(): void {}

  loadingModel() {
    from(tf.loadLayersModel(this.kiToolsModelPath)).subscribe((model) => {
      this.model = model;
      //console.log(this.model.summary());
      this.modelLoaded = true;
    });
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

  clearButtonClicked(){
    this.eventSubject.next('action:clear');
  }
}
