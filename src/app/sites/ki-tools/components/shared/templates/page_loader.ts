import { Component, OnInit, Renderer2 } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { KIToolsHelper } from '../../../services/helper/helper';
import { KIToolsTypes } from '../../../interfaces/types';


/**
 * Vorlage für das Laden der Standalone-Versionen von MNIST und Sentimentanalyse
 * Lädt die Packages nach.
 * Von der Klasse wird nur abgeleitet.
 */

@Component({
    selector: 'app-page-loader',
    template: ``
})
export class PageLoaderComponent implements OnInit {

    loadingStatus: KIToolsTypes.ScriptLoadingStatus;
    kitoolsAreOnline: boolean;
    lnkKITools = this.staticService.getPathInfo().lnkKITools;

    constructor(
      public staticService: StaticService,
    ) {}

    ngOnInit(): void {
      this.loadingStatus = {
        isLoaded: true,
        isError: false,
      }
    }

    onModalClose() {
     // Kein modales Fenster
    }

}
