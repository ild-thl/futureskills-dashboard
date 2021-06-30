import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ScriptLoaderService } from 'src/app/core/services/script-loader/script-loader.service';

declare var tf: any;
//declare var ml5: any;

@Component({
  selector: 'app-ki-tools',
  templateUrl: './ki-tools.component.html',
  styleUrls: ['./ki-tools.component.scss'],
})
export class KiToolsComponent implements OnInit {
  isLoadingScripts: boolean;
  isLoadingError: boolean;

  constructor(private scriptLoader: ScriptLoaderService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.isLoadingScripts = true;
    this.isLoadingError = false;
    this.loadScripts();
  }

  loadScripts() {
    this.scriptLoader.load(this.renderer, ['tensorflow']).subscribe(
      (value) => {
        console.log('Loaded Scripts: ', value);
        this.isLoadingError = false;
      },
      (error) => {
        console.log('Error: ', error);
        this.isLoadingError = true;
      },
      () => {
        this.isLoadingScripts = false;
      }
    );
  }

  testCalc() {
    // Define a model for linear regression.
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    // Generate some synthetic data for training.
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

    // Train the model using the data.
    model.fit(xs, ys, { epochs: 10 }).then(() => {
      // Use the model to do inference on a data point the model hasn't seen before:
      model.predict(tf.tensor2d([5], [1, 1])).print();
      // Open the browser devtools to see the output
    });
  }
}
