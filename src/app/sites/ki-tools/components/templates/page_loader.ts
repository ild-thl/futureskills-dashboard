import { Component, OnInit, Renderer2 } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { KIToolsHelper } from '../../services/helper/helper';
import { KIToolsTypes } from '../../interfaces/types';


/**
 * Vorlage für das Laden der Standalone-Versionen von MNIST und Sentimentanalyse
 * Lädt die Packages nach.
 * Von der Klasse wird nur abgeleitet.
 */

@Component({
    selector: 'app-page-loader',
    template: ``
})
export class PageLoader implements OnInit {

    loadingStatus: KIToolsTypes.ScriptLoadingStatus;
    kitoolsAreOnline: boolean;
    lnkKITools = this.staticService.getPathInfo().lnkKITools;
  
    constructor(
      public renderer: Renderer2,
      public staticService: StaticService,
      public kiStatusService: KiStatusService
    ) {}
  
    ngOnInit(loadPackage: boolean = true): void {
      this.loadingStatus = {
        isLoaded: false,
        isError: false,
      };
      
      if (loadPackage){
        this.kitoolsAreOnline = this.staticService.getKIConfig().online;
        if (this.kitoolsAreOnline) {
          this.loadKIPackages();
        }
      }
    }
  
    // Falls die Scripte nicht geladen sind
    loadKIPackages() {
      this.kiStatusService.loadKIScript(this.renderer).subscribe(
        (scripts) => {
          if (!KIToolsHelper.checkLoadedScripts(scripts)) {
            // Eines der Scripte wurde nicht geladen
            console.log('Scriptfehler');
            this.loadingStatus = {
              isLoaded: false,
              isError: true,
            };
          } else {
            this.loadingStatus = {
              isLoaded: true,
              isError: false,
            };
          }
        },
        (error) => {
          console.log('Error: ', error);
          this.loadingStatus = {
            isLoaded: false,
            isError: true,
          };
        }
      );
    }

}