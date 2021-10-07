import { Component, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { PageLoader } from '../../components/shared/templates/page_loader';

@Component({
  selector: 'app-demonstrators',
  template: ` <section class="mt-3">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <a [routerLink]="lnkKITools"> zur Übersicht </a>
        </div>
      </div>
      <div class="row mt-3 mb-3">
        <div class="col-12">
          <h3 class="h3">Link-Sammlung</h3>
        </div>
      </div>
      <div class="row mt-3 mb-3">
        <div class="col-12">
          <fs-demonstrator-example [modus]="'window'"></fs-demonstrator-example>
        </div>
      </div>
    </div>
  </section>`,
})
export class DemonstratorsStandaloneComponent extends PageLoader implements OnInit {
  ngOnInit() {
    super.ngOnInit();
  }

  constructor(
    public staticService: StaticService,
  ) {
    super(staticService);
  }
}
