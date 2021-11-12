import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
export class FilterComboBoxComponent implements OnInit, OnChanges {
  @Input() defaultText: string;
  @Input() filterList: OfferPropertyList;
  @Input() disabled: boolean=false;
  @Output() valueChanged = new EventEmitter<FilterFunctionCallbackItem>();

  currentText: string = 'Alle';
  filterItems: PropertyItem[];
  currentIndex: number = -1;

  constructor() {}

  ngOnInit(): void {
    this.currentIndex = -1;
    this.currentText = this.defaultText;
    this.filterItems = [{ id: -1, identifier: undefined, description: this.currentText }];
    this.filterItems = this.filterItems.concat(this.filterList.list);
  }

  /**
   * Is called on Input-Changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
   if (this.filterList){
      //console.log ("comboBox ", this.filterList.type, ' changed: ', changes);
   }

  }

  /**
   * Combobox Value was clicked
   * @param item
   * @returns
   */
  onChangeFilter(item: PropertyItem) {
    if (item.id === this.currentIndex) return;

    this.currentIndex = item.id;
    this.currentText = item.description;

    this.valueChanged.emit({
      type: this.filterList.type,
      id: item.id
    });
  }

  /**
   * Filter is changed from outside
   * @see FilterRowServerDirective
   * @param index
   */
  onChangeFilterFromExtern(index: number){
    //console.log("CurrentIndex for:", this.filterList.type, ' index:', index);

    const selectedItem = this.filterItems.find((item) => {
      return item.id === index;
    });
    if (selectedItem){
      this.currentIndex = index;
      this.currentText = selectedItem.description;
    }
  }
}
