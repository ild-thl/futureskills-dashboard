import { Component } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(private staticConfig: StaticService) {}

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  lnkInfoTeaching = this.staticConfig.getPathInfo().lnkInfoTeaching;
  lnkInfoStudents =  this.staticConfig.getPathInfo().lnkInfoStudents;
  lnkImprint = this.staticConfig.getPathInfo().lnkImprint;
  lnkPrivacy = this.staticConfig.getPathInfo().lnkPrivacy;
  lnkLanding = this.staticConfig.getPathInfo().lnkLanding;

}
