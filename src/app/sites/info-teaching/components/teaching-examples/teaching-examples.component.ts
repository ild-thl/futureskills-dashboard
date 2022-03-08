import { Component, Input } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'fs-teaching-examples',
  templateUrl: './teaching-examples.component.html',
  styleUrls: ['./teaching-examples.component.scss']
})
export class TeachingExamplesComponent {

  constructor(private staticConfig: StaticService) { }

  lnkKICoursePackage = this.staticConfig.getPathInfo().lnkOffers + this.staticConfig.getCourseNumbers().FS_SuperKI;
  hrefStringToolbox = "https://toolbox.eduloop.de/";

}
