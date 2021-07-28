import { Component, Input, OnInit } from '@angular/core';
import { KIToolsTypes } from '../../interfaces/types';

@Component({
  selector: 'fs-sentiment-example',
  templateUrl: './sentiment-example.component.html',
  styleUrls: ['./sentiment-example.component.scss']
})
export class SentimentExampleComponent implements OnInit {

  @Input() scriptLoadingStatus: KIToolsTypes.ScriptLoadingStatus;
  @Input() public modus = 'window';


  constructor() { }

  ngOnInit(): void {
  }

}
