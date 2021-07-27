import { Injectable, Renderer2 } from '@angular/core';
import { ScriptLoaderService } from 'src/app/core/services/script-loader/script-loader.service';
import { StaticService } from 'src/app/config/static.service';
import { environment } from 'src/environments/environment';
import { AsyncSubject, Observable, BehaviorSubject, from, throwError } from 'rxjs';

declare var tf: any;

@Injectable()
export class KiStatusService {
  private scriptLoading$: AsyncSubject<any>;
  private MNISTModel$: AsyncSubject<any>;
  private SentimentModel$: AsyncSubject<any>;

  private kiToolsMnistModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;
  private kiToolsSentimentPath = environment.modelURL + this.staticService.getKIConfig().sentimentPath;

  constructor(private scriptLoader: ScriptLoaderService, private staticService: StaticService) {}

  public loadKIScript(renderer: Renderer2): Observable<any> {
    return new Observable((observer$) => {
      if (!this.scriptLoading$) {
        console.log("Load Tensorflow");
        this.scriptLoading$ = new AsyncSubject();
        this.scriptLoader.load(renderer, ['tensorflow']).subscribe(this.scriptLoading$);
      }
      return this.scriptLoading$.subscribe(observer$);
    });
  }

  public loadMNISTModel(){
    if (this.scriptLoading$) {
      return new Observable((observer$) => {
        if (!this.MNISTModel$) {
         console.log("Load MNIST-Model");
         this.MNISTModel$ = new AsyncSubject();
         from(tf.loadLayersModel(this.kiToolsMnistModelPath)).subscribe(this.MNISTModel$);
        }
        return this.MNISTModel$.subscribe(observer$);
      });
    } else {
      throw throwError('Tensorflow was not loaded');
    }
  }

  public loadSentimentModel(){
    if (this.scriptLoading$) {
      return new Observable((observer$) => {
        if (!this.SentimentModel$) {
         console.log("Load Sentiment-Model");
         this.SentimentModel$ = new AsyncSubject();
         from(tf.loadLayersModel(this.kiToolsSentimentPath)).subscribe(this.SentimentModel$);
        }
        return this.SentimentModel$.subscribe(observer$);
      });
    } else {
      throw throwError('Tensorflow was not loaded');
    }
  }
}
