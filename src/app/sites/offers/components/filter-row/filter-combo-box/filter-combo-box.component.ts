import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OfferPropertyList, PropertyItem } from 'src/app/core/models/offer-properties';

export type FilterFunctionCallbackItem = {
  type: string,
  id: number
}

@Component({
  selector: 'app-filter-combo-box',
  templateUrl: './filter-combo-box.component.html',
  styles: [
    `
      :host {
        margin-right: 10px;
      }
    `,
  ],
})
export class FilterComboBoxComponent implements OnInit {
  @Input() defaultText: string;
  @Input() filterList: OfferPropertyList;
  @Input() disabled: boolean=false;
  @Output() valueChanged = new EventEmitter<FilterFunctionCallbackItem>();

  currentText: string = '';
  filterItems: PropertyItem[];
  currentIndex: number = -1;

  constructor() {}

  ngOnInit(): void {
    this.currentText = this.defaultText;
    // Standard Eintrag
    this.filterItems = [{ id: -1, identifier: undefined, description: this.currentText }];
    //console.log("ComboBox:", this.currentText);
    this.loadData();
  }

  setFilter(item: PropertyItem) {
    if (item.id === this.currentIndex) return;

    this.currentIndex = item.id;
    this.currentText = item.description;

    this.valueChanged.emit({
      type: this.filterList.type,
      id: item.id
    });
  }

  loadData() {
    this.filterItems = this.filterItems.concat(this.filterList.list);
  }
}
