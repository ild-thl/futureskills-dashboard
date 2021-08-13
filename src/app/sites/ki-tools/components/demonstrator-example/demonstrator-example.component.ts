import { KIToolsHelper } from './../../services/helper/helper';
import { Component, Input, OnInit } from '@angular/core';
import { KIToolsTypes } from '../../interfaces/types';
import { DemonstratorExamples } from './data/example-data';

@Component({
  selector: 'fs-demonstrator-example',
  templateUrl: './demonstrator-example.component.html',
  styleUrls: ['./demonstrator-example.component.scss']
})
export class DemonstratorExampleComponent implements OnInit {
  @Input() public modus = 'window';

  constructor() { }
  demoList: KIToolsTypes.LinkCardData[] = [];
  projectList: KIToolsTypes.LinkCardData[] = [];

  ngOnInit(): void {
    this.initText();
  //  KIToolsHelper.shuffleArray(this.demoList);
  //  KIToolsHelper.shuffleArray(this.projectList);
  }

  initText() {
    this.demoList = DemonstratorExamples.exampleText;
    this.projectList = DemonstratorExamples.projectText;
  }


}
