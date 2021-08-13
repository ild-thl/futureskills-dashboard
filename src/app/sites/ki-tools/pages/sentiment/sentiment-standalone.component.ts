import { Component, OnInit, Renderer2 } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { PageLoader } from 'src/app/sites/ki-tools/components/shared/templates/page_loader';

@Component({
  selector: 'app-sentiment',
  template: `
    <section class="mt-3">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <a [routerLink]="lnkKITools" [queryParams]="{ preview: '1' }"> zur Übersicht </a>
          </div>
        </div>
        <div class="row mt-3 mb-1">
          <div class="col-12">
            <h3 class="h3">Sentimentanalyse</h3>
          </div>
        </div>
        <fs-sentiment-example
          [scriptLoadingStatus]="loadingStatus"
          [modus]="'window'"
        ></fs-sentiment-example>
      </div>
    </section>
  `,
})
export class SentimentStandAloneComponent extends PageLoader implements OnInit {
  ngOnInit() {
    super.ngOnInit(true);
  }

  constructor(
    public renderer: Renderer2,
    public staticService: StaticService,
    public kiStatusService: KiStatusService
  ) {
    super(renderer, staticService, kiStatusService);
  }
}
