import { Component, OnInit, Renderer2 } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
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
      <fs-mnist-example [scriptLoadingStatus]="loadingStatus" [modus]="'window'"></fs-mnist-example>
    </div>
  </section>`,
})
export class MnistStandaloneComponent extends PageLoader implements OnInit {
  ngOnInit() {
    // Keine Packages nachladen
    super.ngOnInit(false);
  }

  constructor(
    public renderer: Renderer2,
    public staticService: StaticService,
    public kiStatusService: KiStatusService
  ) {
    super(renderer, staticService, kiStatusService);
  }
}
