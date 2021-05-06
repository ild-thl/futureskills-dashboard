import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-fsbutton',
  templateUrl: './fsbutton.component.html',
  styleUrls: ['./fsbutton.component.scss']
})
export class FsbuttonComponent implements OnInit {

  chevronIcon = faChevronRight;

  constructor() { }

  ngOnInit(): void {
  }

}