import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fs-number-canvas',
  templateUrl: './number-canvas.component.html',
  styleUrls: ['./number-canvas.component.scss']
})
export class NumberCanvasComponent implements OnInit {
  @Input() public width = 200;
  @Input() public height = 200;
  constructor() { }

  ngOnInit(): void {
  }


  async predictImage(imageData: ImageData) {
    console.log("Image was drawn:");
  }

}
