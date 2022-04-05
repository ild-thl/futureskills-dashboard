import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { StaticService } from 'src/app/config/static.service';
import { environment } from 'src/environments/environment';

import { OfferShortListForTiles, PaginatedOfferData } from 'src/app/core/models/offer';
import { FilterStatusService } from 'src/app/sites/offers/services/filter-status/filter-status.service';
import { MetaDataService } from 'src/app/core/data/meta/meta-data.service';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { OfferFilterToAPI } from 'src/app/core/http/api/api.interfaces';
import { DataMapping } from 'src/app/core/http/api/data-mapping';
import { OfferListFilterStatus } from 'src/app/sites/offers/services/filter-status/filter-status.service';
import { Objects, Permissions } from 'src/app/core/models/permissions';
import { ErrorHandlerService } from 'src/app/core/services/error-handling/error-handling';
import { LogService } from 'src/app/core/services/logger/log.service';

@Component({
  selector: 'app-offer-list-paginated',
  templateUrl: './offer-list-paginated.component.html',
  styleUrls: ['./offer-list-paginated.component.scss'],
})
export class OfferListPaginatedComponent implements OnInit, OnDestroy {
  private offerSubscription: Subscription | undefined;
  private metaSubscription: Subscription | undefined;

  lnkAdminOfferNew = this.staticService.getPathInfo().lnkAdminOfferNew;
  lnkLanding = this.staticService.getPathInfo().lnkLanding;
  lnkOffers = this.staticService.getPathInfo().lnkOffers;

  // Permission-Set (unused)
  object = Objects;
  permission = Permissions;

  // Pagination
  pageCollectionSize: number; // Anzahl der Items
  page: number; // aktuelle Seite
  pageMaxSize: number; //max.Seiten die angezeigt werden
  pageSize: number; //Anzahl der Items per Seite

  loadedOffers: OfferShortListForTiles[] = [];

  componentsDisabled = true;
  noFilterSet = true;

  // Filter
  filterMapIsLoaded = false;
  staticFilterList: Map<string, OfferPropertyList>; // Properties/Filter aus der API
  filterObj: OfferFilterToAPI; // Filter an die API
  filterInit: Map<string, number>; // gespeicherter Filter
  currentFilter: Map<string, number>; //aktueller Filter

  //Search
  searchString: string;

  message: string;
  isError: boolean;
  isLoading: boolean;

  constructor(
    private offerDataService: OfferDataService,
    private metaDataService: MetaDataService,
    private statusService: FilterStatusService,
    private staticService: StaticService,
    private errorHandler: ErrorHandlerService,
    private logService: LogService
  ) {
    this.pageCollectionSize = 10; // Anzahl der Items
    this.pageMaxSize = 1; // max.Seiten die in der Pagination Leiste angezeigt werden (+1 und max)
    this.pageSize = environment.offerItemPerPage; // Items per Page

    this.page = 1; // Current Page
    this.filterObj = {};
    this.staticFilterList = new Map();
    this.searchString = '';

    this.message = '';
    this.isError = false;
    this.isLoading = false;

    this.filterInit = this.statusService.getEmptyOfferFilterValues();
    this.currentFilter = this.filterInit;
  }

  ngOnInit() {
    const savedFilter = this.statusService.getofferListSearchFilterStatus();
    this.setFilterParams(savedFilter);
    this.loadFilterMetaData();
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.offerSubscription) this.offerSubscription.unsubscribe();
    if (this.metaSubscription) this.metaSubscription.unsubscribe();
  }

  // //////// EVENTS //////////////////////////////////////
  // //////////////////////////////////////////////////////

  /**
   * Called from Directive when FilterBox was changed
   * @param filterInComboboxes
   */
  onFilterChanged(filterInComboboxes: Map<string, number>) {
    this.currentFilter = filterInComboboxes;
    this.changeFilter();
  }

  /**
   * SearchButton was clicked
   * @param searchString
   */
  onStartSearch(searchString: string) {
    // this.searchstring wird autom. upgedated (two-way-binding)
    this.changeSearch();
  }

  /**
   * Called from PaginationComponent when page was changed
   */
  onPageChange() {
    this.pageChange();
  }

  /**
   * Called from Reset Button
   */
  onResetFilter() {
    const resetFilter = this.statusService.resetFilterSearchStatus();
    this.setFilterParams(resetFilter);
    this.loadData();
  }

  onReloadAfterError() {
    this.onResetFilter();
  }

  // //////////////////////////////////////////////////////

  // //////// LOADING DATA FROM API ////////////////////////
  // //////////////////////////////////////////////////////

  /**
   * Loads FilterProperties from API
   */
  private loadFilterMetaData() {
    this.metaSubscription = this.metaDataService.getFilterTags().subscribe({
      next: (filterMap: Map<string, OfferPropertyList>) => {
        this.staticFilterList = filterMap;
        this.filterMapIsLoaded = true;
      },
      error: (error: Error) => {
        this.staticFilterList.delete;
        this.filterObj = {};
        this.filterMapIsLoaded = false;
      },
    });
  }

  /**
   * Loads Offerdata (with Pagination and Filter)
   */
  private loadData() {
    this.message = '';
    this.isError = false;
    this.isLoading = true;
    this.componentsDisabled = true;

    this.offerSubscription = this.offerDataService
      .getPaginatedOfferList(this.page, this.pageSize, this.filterObj, this.searchString)
      .subscribe({
        next: (paginatedData: PaginatedOfferData) => {
          this.loadedOffers = paginatedData.data;
          this.pageCollectionSize = paginatedData.total;
          this.isError = false;
          this.componentsDisabled = false;
          this.message = '';
          this.isLoading = false;
          //this.logService.log('offer-list', 'Offers', this.loadedOffers);
        },
        error: (error: Error) => {
          this.loadedOffers = [];
          this.isError = true;
          this.isLoading = false;
          this.componentsDisabled = true;
          // this.message = this.errorHandler.getErrorMessage(error,'offers');
          // Besser immer die not-found-Fehlermeldung anzeigen.
          this.message = this.errorHandler.ERROR_MESSAGES.E404_OFFERS_NOT_FOUND;
          const resetFilter = this.statusService.resetFilterSearchStatus();
          this.setFilterParams(resetFilter);
        },
      });
  }

  // //////////////////////////////////////////////////////

  // //////// FILTER/SEARCH CHANGE ////////////////////////
  // //////////////////////////////////////////////////////

  /**
   * Called when Filter was changed in Comboboxes
   * @param page
   */
  private changeFilter(page: number = 1) {
    this.page = page;
    this.filterObj = DataMapping.mapFilterToAPIFilter(this.currentFilter);

    this.reloadAndSaveData();
  }

  /**
   * Called when search was changed
   * @param page
   */
  private changeSearch(page: number = 1) {
    this.page = page;

    this.checkSearchText();

    this.reloadAndSaveData();
  }

  private pageChange() {
    this.reloadAndSaveData();
  }

  // ////////////////////////////////////////////////////////

  // //////// SAVE/CHANGE DATA IN PROPS /////////////////////
  // ////////////////////////////////////////////////////////

  /**
   * saves filter and search
   * sets reload-Button
   * starts loading
   */
  private reloadAndSaveData() {
    this.noFilterSet = !this.statusService.saveFilterStatus(
      this.page,
      this.currentFilter,
      this.searchString
    );
    //console.log('Saved Filter:', this.statusService.getofferListSearchFilterStatus());
    this.loadData();
  }

  /**
   * Sets local FilterParams from saved params
   * @param filter
   */
  private setFilterParams(filter: OfferListFilterStatus) {
    //console.log('savedFilters:', filter);
    this.filterInit = filter.filterMap;
    this.currentFilter = this.filterInit;
    this.page = filter.page;
    this.noFilterSet = !filter.filterOn;
    this.searchString = filter.searchString;
    this.filterObj = DataMapping.mapFilterToAPIFilter(this.filterInit);
  }

  private checkSearchText(): any {
    // this.searchString = this.searchString.trim();
    // in HTML?      pattern="[a-zA-Z0-9-_()& ]*"
  }

  // disabled
  private setPaginationMaxLength() {
    if (window) {
      if (window.innerWidth > 576) {
        this.pageMaxSize = 3;
      }
    }
  }
}
