import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { KIToolsHelper } from './../../services/helper/helper';
import { Component, Input, OnInit } from '@angular/core';
import { KIToolsTypes } from '../../interfaces/types';
import { DemonstratorExamples } from './data/example-data';

@Component({
  selector: 'fs-demonstrator-example',
  templateUrl: './demonstrator-example.component.html',
  styleUrls: ['./demonstrator-example.component.scss'],
})
export class DemonstratorExampleComponent implements OnInit {
  @Input() public modus = 'window';

  constructor(private kiStatusService: KiStatusService) {}
  demoList: KIToolsTypes.LinkCardData[] = [];
  projectList: KIToolsTypes.LinkCardData[] = [];

  ngOnInit(): void {
    this.initText();
  }

  initText() {
    const list = this.kiStatusService.loadLinkList();
    this.demoList = list.demoList;
    this.projectList = list.projectList;
    KIToolsHelper.shuffleArray(this.demoList);
    KIToolsHelper.shuffleArray(this.projectList);
  }
}
