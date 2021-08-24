import { Component, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-info-teaching',
  templateUrl: './info-teaching.component.html',
  styleUrls: ['./info-teaching.component.scss']
})
export class InfoTeachingComponent implements OnInit {

  constructor(private staticConfig: StaticService) { }

  lnkKICoursePackage = this.staticConfig.getPathInfo().lnkOffers + this.staticConfig.getCourseNumbers().FS_SuperKI;

  ngOnInit(): void {
  }

}
