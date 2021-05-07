import {
  Directive,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FilterComboBoxComponent } from './filter-combo-box/filter-combo-box.component';
import { FilterFunctionCallbackItem } from 'src/app/core/models/meta';
import { Offer } from 'src/app/core/models/offer';

@Directive({ selector: 'app-filter-row, [app-filter-row]' })
export class FilterRowDirective implements AfterContentInit {
  @Output() filterChanged = new EventEmitter<Function[]>();
  @ContentChildren(FilterComboBoxComponent, { descendants: true }) filterBoxes: QueryList<
    FilterComboBoxComponent
  >;

  private boxMap = new Map();

  constructor() {}

  ngAfterContentInit() {
    this.filterBoxes.forEach((filterBox) => {
      const type = filterBox.filterList.type;
      const currentIndex = filterBox.currentIndex;
      this.boxMap.set(type, currentIndex);

      filterBox.valueChanged.subscribe((item: FilterFunctionCallbackItem) => {
        this.boxMap.set(item.type, item.id);
        const functArr = this.constructFilterFunction(item);
        this.filterChanged.emit(functArr);
      });
    });
  }

  // Filter sammeln
  private constructFilterFunction(item: FilterFunctionCallbackItem): Function[] {
    let arrFilterFunctions: Function[] = [];

    // Institutionen
    if (this.boxMap.has('institutions')) {
      arrFilterFunctions.push(this.getFilterFunctionForInstitutions());
    }

    // Languages
    if (this.boxMap.has('languages')) {
      arrFilterFunctions.push(this.getFilterFunctionForLanguages());
    }

    // Competeneces
    if (this.boxMap.has('competences')) {
      // TODO
      arrFilterFunctions.push(this.getFilterFunctionForCompetences());
    }

    // Formats
    if (this.boxMap.has('formats')) {
      arrFilterFunctions.push(this.getFilterFunctionForFormats());
    }
    return arrFilterFunctions;
  }

  /////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  // Für jeden neuen Filter hier eine Filterfunktion
  // hinzufügen und in constructFilterFunction in das Array pushen

  private getFilterFunctionForInstitutions(): Function {
    const institutionid = this.boxMap.get('institutions');
    // Standard alle
    let func: Function = (): boolean => {
      return true;
    };
    if (institutionid !== -1) {
      func = (value: Offer): boolean => {
        return value.institution_id === institutionid;
      };
    }
    return func;
  }

  private getFilterFunctionForLanguages(): Function {
    const languageid = this.boxMap.get('languages');
    // Standard alle
    let func: Function = (): boolean => {
      return true;
    };
    if (languageid !== -1) {
      func = (value: Offer): boolean => {
        return value.language_id === languageid;
      };
    }
    return func;
  }

  private getFilterFunctionForCompetences(): Function {
    const competenceid = this.boxMap.get('competences');
    // Standard alle
    let func: Function = (): boolean => {
      return true;
    };
    if (competenceid!== -1) {
      func = (value: Offer): boolean => {
        return value.competences.includes(competenceid);
      };
    }
    return func;
  }

  private getFilterFunctionForFormats(): Function {
    const formatid = this.boxMap.get('formats');
    // Standard alle
    let func: Function = (): boolean => {
      return true;
    };
    if (formatid !== -1) {
      func = (value: Offer): boolean => {
        return value.offertype_id === formatid;
      };
    }
    return func;
  }
}
