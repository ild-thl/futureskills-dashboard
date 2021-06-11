import { Component, OnInit, Renderer2 } from '@angular/core';
import { ScriptLoaderService } from 'src/app/core/services/script-loader/script-loader.service';
import { StaticService } from 'src/app/config/static.service';
import { environment } from 'src/environments/environment';

declare var tf: any;

@Component({
  selector: 'app-ki-playground',
  templateUrl: './ki-playground.component.html',
  styleUrls: ['./ki-playground.component.scss']
})
export class KIPlaygroundComponent implements OnInit {
  isLoadingScripts: boolean;
  isLoadingError: boolean;
  kitoolsAreOnline: boolean;
  kiToolsModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;
  additionalText = '';

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
      this.loadKiPackages();
    }
  }

  loadKiPackages() {
    this.isLoadingScripts = true;

    this.scriptLoader.load(this.renderer, ['tensorflow']).subscribe(
      (value) => {
        console.log('init: ', value);
        this.isLoadingError = false;
      },
      (error) => {
        console.log('Error: ', error);
        this.isLoadingError = true;
      },
      () => {
        console.log('Completed: ');
        this.additionalText = '';
        this.isLoadingScripts = false;
      }
    );
  }
}
