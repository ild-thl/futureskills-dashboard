import { Injectable, Renderer2 } from '@angular/core';
import { ScriptLoaderService } from 'src/app/core/services/script-loader/script-loader.service';
import { StaticService } from 'src/app/config/static.service';
import { environment } from 'src/environments/environment';
import { AsyncSubject, Observable, from, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare var tf: any;

@Injectable()
export class KiStatusService {
  private scriptLoading$: AsyncSubject<any>;
  private MNISTModel$: AsyncSubject<any>;
  private SentimentModel$: AsyncSubject<any>;
  constructor(private scriptLoader: ScriptLoaderService, private staticService: StaticService, private httpClient: HttpClient) {}

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
  const  kiToolsMnistModelPath = environment.modelURL + this.staticService.getKIModelPathMNIST() + '/model.json';
    if (this.scriptLoading$) {
      return new Observable((observer$) => {
        if (!this.MNISTModel$) {
         console.log("Load MNIST-Model");
         this.MNISTModel$ = new AsyncSubject();
         from(tf.loadLayersModel(kiToolsMnistModelPath)).subscribe(this.MNISTModel$);
        }
        return this.MNISTModel$.subscribe(observer$);
      });
    } else {
      throw throwError('Tensorflow was not loaded');
    }
  }

  public loadSentimentModel(lang: string = 'en'): Observable<any>{
    const kiToolsSentimentModelPath_en = environment.modelURL + this.staticService.getKIModelPathSentiment(lang) + '/model/model.json';
    if (this.scriptLoading$) {
      return new Observable((observer$) => {
        if (!this.SentimentModel$) {
         console.log("Load Sentiment-Model");
         this.SentimentModel$ = new AsyncSubject();
         from(tf.loadLayersModel(kiToolsSentimentModelPath_en)).subscribe(this.SentimentModel$);
        }
        return this.SentimentModel$.subscribe(observer$);
      });
    } else {
      throw throwError('Tensorflow was not loaded');
    }
  }

  public loadWordIndex(lang: string = 'en'): Observable<any>{
    const kiToolsSentimentIndexPath_en = environment.modelURL + this.staticService.getKIModelPathSentiment(lang) + '/imdb_word_index.json';
    return this.httpClient.get(kiToolsSentimentIndexPath_en);
  }
}
