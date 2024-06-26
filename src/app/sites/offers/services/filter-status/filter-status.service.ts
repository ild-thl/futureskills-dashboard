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

  constructor() {
    this.offerListFilterSiteStatus = this.createEmptyFilterStatus();
  }

  public getofferListSearchFilterStatus(): OfferListFilterStatus {
    return this.offerListFilterSiteStatus;
  }

  public saveFilterStatus(
    page: number,
    filterMap: Map<string, number>,
    searchString: string
  ): boolean {
    this.offerListFilterSiteStatus.page = page;
    this.offerListFilterSiteStatus.filterMap = filterMap;
    this.offerListFilterSiteStatus.searchString = searchString;
    this.offerListFilterSiteStatus.filterOn = this.checkOnSearchFilterOn(filterMap, searchString);
    return this.offerListFilterSiteStatus.filterOn;
  }

  public resetFilterSearchStatus(): OfferListFilterStatus {
    const searchString = '';
    this.offerListFilterSiteStatus = this.createEmptyFilterStatus();
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

  private createEmptyFilterStatus(): OfferListFilterStatus {
    const searchString = '';
    const emptyFilterStatus = {
      page: 1,
      filterMap: this.getEmptyOfferFilterValues(),
      filterOn: this.checkOnSearchFilterOn(this.getEmptyOfferFilterValues(), searchString),
      searchString: searchString,
    };
    return emptyFilterStatus;
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

  public isFilterOrSearchOn(): boolean {
    return this.checkOnSearchFilterOn(
      this.offerListFilterSiteStatus.filterMap,
      this.offerListFilterSiteStatus.searchString
    );
  }
}
