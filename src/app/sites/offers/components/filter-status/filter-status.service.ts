import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export type OfferListFilterStatus = {
  page: number;
  filterMap: Map<string, number>;
  filterOn: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class FilterStatusService {
  private offerListFilterSiteStatus: OfferListFilterStatus;

  public getofferListFilterStatus(): OfferListFilterStatus {
    return this.offerListFilterSiteStatus;
  }

  constructor() {
    this.offerListFilterSiteStatus = {
      page: 1,
      filterMap: this.getEmptyOfferFilterValues(),
      filterOn: this.checkOnFilterOn(this.getEmptyOfferFilterValues()),
    };
  }

  public saveFilterStatus(page: number, filterMap: Map<string, number>) {
    this.offerListFilterSiteStatus.page = page;
    this.offerListFilterSiteStatus.filterMap = filterMap;
    this.offerListFilterSiteStatus.filterOn = this.checkOnFilterOn(filterMap);
  }

  public resetFilterStatus(): OfferListFilterStatus {
    this.offerListFilterSiteStatus = {
      page: 1,
      filterMap: this.getEmptyOfferFilterValues(),
      filterOn: this.checkOnFilterOn(this.getEmptyOfferFilterValues()),
    };
    return this.getofferListFilterStatus();
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
}
