import { Component } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-info-teaching',
  templateUrl: './info-teaching.component.html',
  styleUrls: ['./info-teaching.component.scss']
})
export class InfoTeachingComponent {

  headlineText = "Skills, die Ihre Studierenden für die Zukunft brauchen.";

  constructor(private staticConfig: StaticService) { }

  lnkKICoursePackage = this.staticConfig.getPathInfo().lnkOffers + this.staticConfig.getCourseNumbers().FS_SuperKI;

}
