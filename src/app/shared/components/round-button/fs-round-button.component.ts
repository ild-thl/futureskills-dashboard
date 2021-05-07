import { Component, OnInit } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fs-round-button',
  templateUrl: './fs-round-button.component.html',
  styleUrls: ['./fs-round-button.component.scss']
})
export class RoundButton implements OnInit {

  chevronIcon = faChevronRight;

  constructor() { }

  ngOnInit(): void {
  }

}
