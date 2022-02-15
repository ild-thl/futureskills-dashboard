import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fs-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

  @Input() cardContentImage: string;
  @Input() cardContentHeader: string;
  @Input() cardContentText: string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.cardContentHeader);
  }

}
