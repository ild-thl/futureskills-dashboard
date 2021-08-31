import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { KIToolsHelper } from './../../services/helper/helper';
import { Component, Input, OnInit } from '@angular/core';
import { KIToolsTypes } from '../../interfaces/types';

@Component({
  selector: 'fs-demonstrator-example',
  templateUrl: './demonstrator-example.component.html',
  styleUrls: ['./demonstrator-example.component.scss'],
})
export class DemonstratorExampleComponent implements OnInit {
  @Input() public modus = 'window';
  isLoading = true;
  errorOccurred = false;

  constructor(private kiStatusService: KiStatusService) {}
  demoList: KIToolsTypes.LinkCardData[] = [];
  projectList: KIToolsTypes.LinkCardData[] = [];

  ngOnInit(): void {
    this.initText();
  }

  initText() {
    this.isLoading = true;
    this.kiStatusService.loadLinkList().subscribe((list) => {
      console.log("Lists: ", list);
      this.demoList = list.demoCards;
      this.projectList = list.projectCards;

      KIToolsHelper.shuffleArray(this.demoList);
      KIToolsHelper.shuffleArray(this.projectList);
      this.errorOccurred = false;
 
    }, error=>{
      this.errorOccurred = true;
      console.log("DemoError: ", error);
    }, ()=>{
      this.isLoading = false;
    });
  }
}
