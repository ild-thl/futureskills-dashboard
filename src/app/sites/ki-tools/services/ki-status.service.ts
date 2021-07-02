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

  private kiToolsModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;
  //public imageDraw: BehaviorSubject<any> = new BehaviorSubject(null);

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
         console.log("Load Model");
         this.MNISTModel$ = new AsyncSubject();
         from(tf.loadLayersModel(this.kiToolsModelPath)).subscribe(this.MNISTModel$);
        }
        return this.MNISTModel$.subscribe(observer$);
      });
    } else {
      throw throwError('Tensorflow was not loaded');
    }
  }
}
