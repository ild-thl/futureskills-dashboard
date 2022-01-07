import { Component, Input } from '@angular/core';
import { KIToolsTypes } from '../../../interfaces/types';

@Component({
  selector: 'app-example-card',
  templateUrl: './example-card.component.html',
  styleUrls: ['./example-card.component.scss']
})
export class ExampleCardComponent {

  @Input() public cardTextData: KIToolsTypes.LinkCardData;
  constructor() { }

  goToUrl(url: string){
    console.log(url);
  }

  getType(){
    return this.cardTextData.style;
  }

}
