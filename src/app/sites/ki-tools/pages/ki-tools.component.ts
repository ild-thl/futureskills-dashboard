import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ScriptLoaderService } from 'src/app/core/services/script-loader/script-loader.service';
import { StaticService } from 'src/app/config/static.service';
import { empty, of } from 'rxjs';
import { delay, startWith, concatMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare var tf: any;

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
    this.isLoadingScripts = true;
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
}
