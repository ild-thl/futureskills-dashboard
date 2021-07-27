import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fs-sentiment-example',
  templateUrl: './sentiment-example.component.html',
  styleUrls: ['./sentiment-example.component.scss']
})
export class SentimentExampleComponent implements OnInit {

  @Input() scriptLoaded = false;
  @Input() public modus = 'window';


  constructor() { }

  ngOnInit(): void {
  }

}
