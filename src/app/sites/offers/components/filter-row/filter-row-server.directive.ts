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
import { OfferFilterToAPI } from 'src/app/core/http/api/api.interfaces';

@Directive({ selector: 'app-server-filter, [app-server-filter]' })
export class FilterRowServerDirective implements AfterContentInit {
  @Output() filterChanged = new EventEmitter<OfferFilterToAPI>();
  @ContentChildren(FilterComboBoxComponent, { descendants: true })
  filterBoxes: QueryList<FilterComboBoxComponent>;

  private boxMap = new Map();
  constructor() {}

  ngAfterContentInit() {
    this.filterBoxes.forEach((filterBox) => {
      const type = filterBox.filterList.type;
      const currentIndex = filterBox.currentIndex;
      this.boxMap.set(type, currentIndex);

      filterBox.valueChanged.subscribe((item: FilterFunctionCallbackItem) => {
        this.boxMap.set(item.type, item.id);
        const filterArr = this.constructFilterArrays(item);
        this.filterChanged.emit(filterArr);
      });
    });
  }

  // Filter sammeln
  private constructFilterArrays(item: FilterFunctionCallbackItem): OfferFilterToAPI {
    //console.log('Item:', item);
    //console.log("FilterItems:",  this.boxMap);

    let filterObj: OfferFilterToAPI = {};

    // Institutionen
    if (this.boxMap.has('institutions')) {
      const institutionid = this.boxMap.get('institutions');
      if (institutionid !== -1) {
        filterObj.institution_id = [this.boxMap.get('institutions')];
      }
    }

    // Languages
    if (this.boxMap.has('languages')) {
      const languageid = this.boxMap.get('languages');
      if (languageid !== -1) {
        filterObj.language_id = [this.boxMap.get('languages')];
      }
    }

    // Competeneces
    if (this.boxMap.has('competences')) {
      const competenceid = this.boxMap.get('competences');
      if (competenceid!== -1) {
        filterObj.competences = [this.boxMap.get('competences')];
      }
    }

    // Formats
    if (this.boxMap.has('formats')) {
      const formatid = this.boxMap.get('formats');
      if (formatid !== -1) {
        filterObj.offertype_id = [this.boxMap.get('formats')];
      }
    }
    return filterObj;
  }
}
