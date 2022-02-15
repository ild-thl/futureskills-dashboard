import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fs-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

  @Input() buttonActive: boolean;
  @Input() buttonLabel: string;
  @Input() hrefString: string;
  @Input() cardContentImage: string;
  @Input() cardContentHeader: string;
  @Input() cardContentText: string;

  constructor() { }

  ngOnInit(): void {
  }

}
