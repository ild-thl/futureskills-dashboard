import { Inject, Injectable, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IExternScripts } from 'src/app/config/extern-scripts.config';
import { forkJoin, Observable } from 'rxjs';
import { ExternScripts } from 'src/app/config/extern-scripts.config';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private scriptMap = new Map();
  private renderer: Renderer2;

  constructor(@Inject(DOCUMENT) private doc: Document) {
    ExternScripts.forEach((script: IExternScripts) => {
      this.scriptMap.set(script.name, { loaded: false, src: script.src });
    });
  }

  load(renderer: Renderer2, scripts: string[]): Observable<any> {
    this.renderer = renderer;
    const streamArr: Observable<any>[] = [];
    scripts.forEach((script) => streamArr.push(this.loadScript(script)));
    return forkJoin(streamArr);
  }

  loadScript(name: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.scriptMap.has(name)) {
        subscriber.next({ script: name, loaded: false, status: 'Unknown Scriptname' });
        subscriber.complete();
      } else {
        if (this.scriptMap.get(name).loaded) {
          subscriber.next({ script: name, loaded: true, status: 'Already Loaded' });
          subscriber.complete();
        } else {
          let script = this.renderer.createElement('script');
          script.src = this.scriptMap.get(name).src;
          script.type = 'text/javascript';

          if (script.readyState) {
            script.onreadystatechange = () => {
              if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                this.scriptMap.get(name).loaded = true;
                subscriber.next({ script: name, loaded: true, status: 'Loaded' });
                subscriber.complete();
              }
            };
          } else {
            //Others
            script.onload = () => {
              this.scriptMap.get(name).loaded = true;
              subscriber.next({ script: name, loaded: true, status: 'Loaded' });
              subscriber.complete();
            };
          }

          script.onerror = (error: any) => {
            subscriber.next({ script: name, loaded: false, status: 'Loaded' });
            subscriber.complete();
          };

          this.renderer.appendChild(this.doc.head, script);
        }
      }
    });
  }
}
