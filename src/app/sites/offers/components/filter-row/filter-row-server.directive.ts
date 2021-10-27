import {
  Directive,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FilterComboBoxComponent,
  FilterFunctionCallbackItem,
} from './filter-combo-box/filter-combo-box.component';

@Directive({ selector: 'app-server-filter, [app-server-filter]' })
export class FilterRowServerDirective implements AfterContentInit {
  @Output() filterChanged = new EventEmitter<Map<string,number>>();
  @ContentChildren(FilterComboBoxComponent, { descendants: true })
  filterBoxes: QueryList<FilterComboBoxComponent>;

  private boxMap: Map<string,number> = new Map();
  constructor() {}

  ngAfterContentInit() {
    this.filterBoxes.forEach((filterBox) => {
      const type = filterBox.filterList.type;
      const currentIndex = filterBox.currentIndex;
      this.boxMap.set(type, currentIndex);

      filterBox.valueChanged.subscribe((item: FilterFunctionCallbackItem) => {
        this.boxMap.set(item.type, item.id);
        this.filterChanged.emit(this.boxMap);
      });
    });
  }
}
