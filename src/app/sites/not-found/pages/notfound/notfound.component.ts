import { Component } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html'
})
export class NotfoundComponent {

  errorText:string;
  constructor() { 
    this.errorText = 'Die Seite wurde nicht gefunden.';
  }
}
