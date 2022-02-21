import { Component } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-manage-landing',
  templateUrl: './manage-landing.component.html',
  styleUrls: ['./manage-landing.component.scss']
})
export class ManageLandingComponent {

  lnkManageOffers = this.staticConfig.getPathInfo().lnkManageOfferList;

  constructor(private staticConfig: StaticService) { }

}
