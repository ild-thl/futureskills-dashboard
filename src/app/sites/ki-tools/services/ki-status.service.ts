import { Injectable, Renderer2 } from '@angular/core';
import { ScriptLoaderService } from 'src/app/core/services/script-loader/script-loader.service';
import { AsyncSubject, Observable } from 'rxjs';

@Injectable()
export class KiStatusService {
  private scriptLoading$: AsyncSubject<any>;
  constructor(private scriptLoader: ScriptLoaderService) {}

  public loadKIScript(renderer: Renderer2): Observable<any> {
    return new Observable((observer$) => {
      if (!this.scriptLoading$) {
        console.log("Load Scripts new");
        this.scriptLoading$ = new AsyncSubject();
        this.scriptLoader.load(renderer, ['tensorflow']).subscribe(this.scriptLoading$);
      }
      return this.scriptLoading$.subscribe(observer$);
    });
  }
}
