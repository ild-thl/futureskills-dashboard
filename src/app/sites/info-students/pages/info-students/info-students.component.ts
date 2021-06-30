import { Component, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-info-students',
  templateUrl: './info-students.component.html',
  styleUrls: ['./info-students.component.scss']
})
export class InfoStudentsComponent implements OnInit {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  constructor(private staticConfig: StaticService) { }

  ngOnInit(): void {
  }

}
