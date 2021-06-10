import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ScriptLoaderService } from 'src/app/core/services/script-loader/script-loader.service';
import { StaticService } from 'src/app/config/static.service';
import { empty, of } from 'rxjs';
import { delay, startWith, concatMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
  kitoolsAreOnline: boolean;
  kiToolsModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;
  message = '';

  delayedMessage = (message, delayedTime = 1000) => {
    return empty().pipe(startWith(message), delay(delayedTime));
  };

  constructor(
    private scriptLoader: ScriptLoaderService,
    private renderer: Renderer2,
    private staticService: StaticService
  ) {}

  ngOnInit(): void {
    this.isLoadingScripts = false;
    this.isLoadingError = false;

    this.kitoolsAreOnline = this.staticService.getKIConfig().online;
    if (this.kitoolsAreOnline) {
      this.initializeKITools();
    }
  }

  initializeKITools() {
    // Erst die Scripte, dann die Modelle laden
    this.scriptLoader
      .load(this.renderer, ['tensorflow'])
      .pipe(
        tap((value) => console.log('Scripte:', value)),
        concatMap((val) => this.loadModels().pipe())
      )
      .subscribe(
        (value) => {
          console.log('init: ', value);
          this.isLoadingError = false;
        },
        (error) => {
          console.log('Error: ', error);
          this.isLoadingError = true;
        },
        () => {
          //console.log('Completed: ');
          this.isLoadingScripts = false;
        }
      );
  }

  loadModels() {
    console.log('PAth to Models', this.kiToolsModelPath);
    return of('Todo: Modelle laden');
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
