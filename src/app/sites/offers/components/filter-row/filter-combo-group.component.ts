import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-combo-group',
  template: '<ng-content></ng-content>',
  styles: [
    `
      :host {
        display: inline-block;
        margin-bottom: 15px;
      }
    `,
  ],
})
export class FilterComboGroupComponent {}
