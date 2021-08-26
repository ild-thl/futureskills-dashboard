import { Component, Input, OnInit } from '@angular/core';
import { KIToolsTypes } from '../../../interfaces/types';

@Component({
  selector: 'app-example-card',
  templateUrl: './example-card.component.html',
  styleUrls: ['./example-card.component.scss']
})
export class ExampleCardComponent implements OnInit {

  @Input() public cardTextData: KIToolsTypes.LinkCardData;
  constructor() { }
  ngOnInit(): void {}

  goToUrl(url: string){
    console.log(url);
  }

  getType(){
    return this.cardTextData.style;
  }

}
