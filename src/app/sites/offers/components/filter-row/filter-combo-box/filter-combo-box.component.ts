import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilterList, FilterItem, FilterFunctionCallbackItem } from 'src/app/core/models/meta';

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
  @Input() filterList: FilterList;
  @Output() valueChanged = new EventEmitter<FilterFunctionCallbackItem>();

  currentText: string = '';
  filterItems: FilterItem[];
  currentIndex: number = -1;

  constructor() {}

  ngOnInit(): void {
    this.currentText = this.defaultText;
    // Standard Eintrag
    this.filterItems = [{ id: -1, identifier: undefined, description: this.currentText }];
    this.loadData();
  }

  setFilter(item: FilterItem) {
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
