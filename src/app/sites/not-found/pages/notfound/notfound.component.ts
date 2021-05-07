import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html'
})
export class NotfoundComponent implements OnInit {

  errorText:string;
  constructor() { 
    this.errorText = 'Die Seite wurde nicht gefunden.';
  }

  ngOnInit(): void {
  }

}
