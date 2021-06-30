import { Component } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-herocontainer',
  templateUrl: './herocontainer.component.html',
  styleUrls: ['./herocontainer.component.scss'],
  providers: [NgbCarouselConfig],
})
export class HerocontainerComponent {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  constructor(config: NgbCarouselConfig, private staticConfig: StaticService) {
    config.interval = 4000;
    config.pauseOnHover = true;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
  }
}
