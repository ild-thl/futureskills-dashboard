import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fs-error-back-text',
  templateUrl: './error-back-text.component.html'
})
export class ErrorBackTextComponent implements OnInit {
  @Input() errorText: string;

  constructor() {}

  ngOnInit(): void {
  }

}
