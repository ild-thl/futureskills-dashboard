import {
  Directive,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FilterComboBoxComponent,
  FilterFunctionCallbackItem,
} from './filter-combo-box/filter-combo-box.component';

@Directive({ selector: 'app-server-filter, [app-server-filter]' })
export class FilterRowServerDirective implements AfterContentInit, OnChanges {
  @Input() initFilterMap: Map<string, number>;
  @Output() filterChanged = new EventEmitter<Map<string, number>>();
  @ContentChildren(FilterComboBoxComponent, { descendants: true })
  filterBoxes: QueryList<FilterComboBoxComponent>;

  private boxMap: Map<string, number> = new Map();
  private initboxMap: Map<string, number> = null;

  constructor() {}

  ngAfterContentInit() {
    this.filterBoxes.forEach((filterBox) => {
      const type = filterBox.filterList.type;
      let currentIndex = -1;

      if (this.initboxMap) {
        // Defaultwerte setzen
        currentIndex = this.initboxMap.get(filterBox.filterList.type);
        filterBox.onChangeFilterFromExtern(currentIndex);
      } else {
        // Standardwerte setzen
        currentIndex = filterBox.currentIndex;
      }

      this.boxMap.set(type, currentIndex);

      filterBox.valueChanged.subscribe((item: FilterFunctionCallbackItem) => {
        this.boxMap.set(item.type, item.id);
        this.filterChanged.emit(this.boxMap);
      });
    });
    // console.log("CurrentMap:", this.boxMap);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.initFilterMap) {
      console.log('Filter changed.', changes);
      if (changes.initFilterMap.previousValue == undefined) {
        this.initboxMap = changes.initFilterMap.currentValue;
        console.log('First Values for Comboboxes', this.initboxMap);
      } else {
        const newFilterMap = changes.initFilterMap.currentValue;
        console.log('New Values for Comboboxes', this.initboxMap);
        this.setComboBoxValues(newFilterMap);
      }
    }
  }

  setComboBoxValues(filterMap: Map<string, number>) {
    if (this.filterBoxes) {
      this.filterBoxes.forEach((filterBox) => {
        const type = filterBox.filterList.type;
        const currentIndex = filterMap.get(type);

        this.boxMap.set(type, currentIndex);
        filterBox.onChangeFilterFromExtern(currentIndex);
      });
    }
  }
}
