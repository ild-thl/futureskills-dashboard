import { Component, Input } from '@angular/core';

@Component({
  selector: 'fs-round-easy-button',
  templateUrl: './round-easy-button.component.html',
  styleUrls: ['./round-easy-button.component.scss']
})
export class RoundEasyButtonComponent {

  @Input() public disabled: boolean;
  constructor() { }

}
