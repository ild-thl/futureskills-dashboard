import { Component, Input, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'manage-breadcrumb-header',
  templateUrl: './breadcrumb-header.component.html'
})
export class BreadcrumbHeaderComponent implements OnInit {
  @Input() linkText: string = 'root';
  lnkManage = this.staticService.getPathInfo().lnkManage;
  lnkManageOfferList = this.staticService.getPathInfo().lnkManageOfferList;
  lnkManageOfferEdit = this.staticService.getPathInfo().lnkManageOfferEdit;
  lnkManageOfferNew = this.staticService.getPathInfo().lnkManageOfferNew;

  stages: { link: string; name: string }[];

  constructor(private staticService: StaticService) {
    this.stages = [];
  }

  ngOnInit(): void {
    this.stages = [{ link: this.lnkManage, name: 'Verwaltung' }];

    switch (this.linkText) {
      case 'course_list':
        this.stages.push({ link: this.lnkManageOfferList, name: 'Kursverwaltung' });
        break;
      case 'course_edit':
        this.stages.push({ link: this.lnkManageOfferList, name: 'Kursverwaltung' });
        this.stages.push({ link: this.lnkManageOfferEdit, name: 'Kurs bearbeiten' });
        break;
      case 'course_new':
        this.stages.push({ link: this.lnkManageOfferList, name: 'Kursverwaltung' });
        this.stages.push({ link: this.lnkManageOfferNew, name: 'Neuer Kurs' });
        break;
    }
  }
}
