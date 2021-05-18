import { Injectable, Renderer2 } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ExternScripts } from 'src/app/config/extern-scripts.config';

declare var document: any;

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private scripts: any = {};
  private isInitialized: boolean;
  private renderer: Renderer2;

  constructor() {
    this.isInitialized = false;

    ExternScripts.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
      };
    });
  }

  init(renderer: Renderer2) {
    this.renderer = renderer;
    this.isInitialized = true;
    console.log('Inizialized');
  }

  load(renderer: Renderer2, scripts: string[]): Observable<any> {
    this.renderer = renderer;
    const streams: Observable<any>[] = [];

    for (var script of scripts) {
      streams.push(this.loadScript(script));
    }
    return forkJoin(streams);
  }

  loadScript(name: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.scripts[name]) {
        subscriber.next({ script: name, loaded: false, status: 'Unknown Scriptname' });
        subscriber.complete();
      } else {
        if (!this.scripts[name].loaded) {
          console.log('Script to load: ', name);
          let script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = this.scripts[name].src;

          if (script.readyState) {
            //IE
            script.onreadystatechange = () => {
              if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                this.scripts[name].loaded = true;
                subscriber.next({ script: name, loaded: true, status: 'Loaded' });
                subscriber.complete();
              }
            };
          } else {
            //Others
            script.onload = () => {
              this.scripts[name].loaded = true;
              subscriber.next({ script: name, loaded: true, status: 'Loaded' });
              subscriber.complete();
            };
          }

          script.onerror = (error: any) => {
            subscriber.next({ script: name, loaded: false, status: 'Loaded' });
            subscriber.complete();
          };

          document.getElementsByTagName('head')[0].appendChild(script);
        } else {
          subscriber.next({ script: name, loaded: true, status: 'Already Loaded' });
          subscriber.complete();
        }
      }
    });
  }
}
