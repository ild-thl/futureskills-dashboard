import { Component, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

import { PageLoader } from '../../components/shared/templates/page_loader';

@Component({
  selector: 'app-mnist',
  template: ` <section class="mt-3">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <a [routerLink]="lnkKITools"> zur Übersicht </a>
        </div>
      </div>
      <div class="row mt-3 mb-1">
        <div class="col-12">
          <h3 class="h3">Handschrifterkennung mit dem MNIST-Datensatz</h3>
        </div>
      </div>
      <fs-mnist-example [scriptLoadingStatus]="loadingStatus" [modus]="'window'" (modalClose)="onModalClose()"></fs-mnist-example>
    </div>
  </section>`,
})
export class MnistStandaloneComponent extends PageLoader implements OnInit {
  ngOnInit() {
    super.ngOnInit();
  }

  constructor(
    public staticService: StaticService,
  ) {
    super(staticService);
  }
}
