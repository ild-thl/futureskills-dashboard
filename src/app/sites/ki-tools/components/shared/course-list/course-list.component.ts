import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fs-ki-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CourseListComponent {
  @Output() linkWasClicked = new EventEmitter<any>();

  lnkCoursePath2 =
    this.staticService.getPathInfo().lnkOffers + this.staticService.getCourseNumbers().FS_SuperKI;
  lnkCoursePath1 =
    this.staticService.getPathInfo().lnkOffers +
    this.staticService.getCourseNumbers().FS_NeuronaleNetze;

  constructor(
    private staticService: StaticService,
    private router: Router
  ) {}

  goToUrl(url: string) {
    this.linkWasClicked.emit();
    this.router.navigate([url]);
  }
}