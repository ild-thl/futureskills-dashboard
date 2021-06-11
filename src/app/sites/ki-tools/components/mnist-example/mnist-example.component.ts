import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fs-number-canvas',
  templateUrl: './mnist-example.component.html',
  styleUrls: ['./mnist-example.component.scss']
})
export class MNISTExampleComponent implements OnInit {
  @Input() public width = 200;
  @Input() public height = 200;
  constructor() { }

  ngOnInit(): void {
  }


  async predictImage(imageData: ImageData) {
    console.log("Image was drawn:");
  }

}
