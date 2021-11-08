import { Component, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { PageLoader } from 'src/app/sites/ki-tools/components/shared/templates/page_loader';

@Component({
  selector: 'app-sentiment',
  template: `
    <section class="mt-3">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <a [routerLink]="lnkKITools"> zur Übersicht </a>
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
          (modalClose)="onModalClose()"
        ></fs-sentiment-example>
      </div>
    </section>
  `,
})
export class SentimentStandAloneComponent extends PageLoader implements OnInit {
  ngOnInit() {
    super.ngOnInit();
  }

  constructor(
    public staticService: StaticService,
  ) {
    super(staticService);
  }
}
