import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fs-headline-banner',
  templateUrl: './headline-banner.component.html',
  styleUrls: ['./headline-banner.component.scss']
})
export class HeadlineBannerComponent implements OnInit {

  @Input() headline: string;

  constructor() { }

  ngOnInit(): void {
  }

}
