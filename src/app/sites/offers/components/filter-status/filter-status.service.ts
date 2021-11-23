import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export type OfferListFilterStatus = {
  page: number;
  filterMap: Map<string, number>;
  filterOn: boolean;
  searchString: string;
};

@Injectable({
  providedIn: 'root',
})
export class FilterStatusService {
  private offerListFilterSiteStatus: OfferListFilterStatus;

  public getofferListSearchFilterStatus(): OfferListFilterStatus {
    return this.offerListFilterSiteStatus;
  }

  constructor() {
    this.resetFilterSearchStatus();
  }

  public saveFilterStatus(page: number, filterMap: Map<string, number>, searchString: string) {
    this.offerListFilterSiteStatus.page = page;
    this.offerListFilterSiteStatus.filterMap = filterMap;
    this.offerListFilterSiteStatus.filterOn = this.checkOnFilterOn(filterMap);
    this.offerListFilterSiteStatus.searchString = searchString;
  }

  public resetFilterSearchStatus(): OfferListFilterStatus {
    const searchString = '';
    this.offerListFilterSiteStatus = {
      page: 1,
      filterMap: this.getEmptyOfferFilterValues(),
      filterOn: this.checkOnFilterOn(this.getEmptyOfferFilterValues()),
      searchString: searchString,
    };
    return this.getofferListSearchFilterStatus();
  }

  public getEmptyOfferFilterValues(): Map<string, number> {
    const resetMap = new Map();
    resetMap.set('competences', -1);
    resetMap.set('institutions', -1);
    resetMap.set('formats', -1);
    resetMap.set('languages', -1);
    return resetMap;
  }

  private checkOnFilterOn(filterMap: Map<string, number>): boolean {
    let returnValue = false;
    for (let value of filterMap.values()) {
      if (value !== -1) {
        returnValue = true;
        break;
      }
    }
    return returnValue;
  }

  private checkOnSearchFilterOn(filterMap: Map<string, number>, searchString: string): boolean {
    if (searchString && searchString.length > 0) return true;
    return this.checkOnFilterOn(filterMap);
  }
}
