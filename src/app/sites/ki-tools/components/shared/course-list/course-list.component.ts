import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'fs-ki-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CourseListComponent{
  lnkCoursePath2 =
    this.staticService.getPathInfo().lnkOffers + this.staticService.getCourseNumbers().FS_SuperKI;
  lnkCoursePath1 =
    this.staticService.getPathInfo().lnkOffers +
    this.staticService.getCourseNumbers().FS_NeuronaleNetze;

  constructor(private kiService: KiStatusService, private staticService: StaticService) {}

}
