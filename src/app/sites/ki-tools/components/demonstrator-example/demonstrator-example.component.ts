import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { KIToolsTypes } from '../../interfaces/types';

import { KIToolsHelper } from 'src/app/sites/ki-tools/services/helper/helper';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';

@Component({
  selector: 'fs-demonstrator-example',
  templateUrl: './demonstrator-example.component.html',
  styleUrls: ['./demonstrator-example.component.scss'],
})
export class DemonstratorExampleComponent implements OnInit, OnDestroy {
  @Input() public modus = 'window';
  isLoading = true;
  errorOccurred = false;
  linkListSub: Subscription;

  constructor(private kiStatusService: KiStatusService) {}

  demoList: KIToolsTypes.LinkCardData[] = [];
  projectList: KIToolsTypes.LinkCardData[] = [];

  ngOnInit(): void {
    this.initText();
  }

  ngOnDestroy(): void {
    if (this.linkListSub) this.linkListSub.unsubscribe();
  }

  initText() {
    this.isLoading = true;
    this.linkListSub = this.kiStatusService.loadLinkList().subscribe({
      next: (list) => {
        this.demoList = list.demoCards;
        this.projectList = list.projectCards;

        KIToolsHelper.shuffleArray(this.demoList);
        KIToolsHelper.shuffleArray(this.projectList);
        this.errorOccurred = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorOccurred = true;
      },
    });
  }
}
