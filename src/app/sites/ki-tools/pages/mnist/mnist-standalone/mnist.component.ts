import { Component, OnInit, Renderer2 } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { PageLoader } from '../../../components/templates/page_loader';

@Component({
  selector: 'app-mnist',
  templateUrl: './mnist.component.html',
})
export class MnistComponent extends PageLoader implements OnInit {
  ngOnInit() {
    super.ngOnInit();
  }

  constructor(
    public renderer: Renderer2,
    public staticService: StaticService,
    public kiStatusService: KiStatusService
  ) {
    super(renderer, staticService, kiStatusService);
  }
}
