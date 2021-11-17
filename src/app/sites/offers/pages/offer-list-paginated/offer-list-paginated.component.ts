import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { StaticService } from 'src/app/config/static.service';
import { environment } from 'src/environments/environment';

import { OfferShortListForTiles, PaginatedOfferData } from 'src/app/core/models/offer';
import { FilterStatusService } from 'src/app/sites/offers/components/filter-status/filter-status.service';
import { MetaDataService } from 'src/app/core/data/meta/meta-data.service';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { OfferFilterToAPI } from 'src/app/core/http/api/api.interfaces';
import { DataMapping } from 'src/app/core/http/api/data-mapping';
import { OfferListFilterStatus } from 'src/app/sites/offers/components/filter-status/filter-status.service';

@Component({
  selector: 'app-offer-list-paginated',
  templateUrl: './offer-list-paginated.component.html',
  styleUrls: ['./offer-list-paginated.component.scss'],
})
export class OfferListPaginatedComponent implements OnInit, OnDestroy {
  private onIsAuthenticated: Subscription;
  private offerSubscription: Subscription;
  private metaSubscription: Subscription;

  lnkAdminOfferNew = this.staticService.getPathInfo().lnkAdminOfferNew;

  // Pagination
  pageCollectionSize: number; // Anzahl der Items
  page: number; // aktuelle Seite
  pageMaxSize: number; //max.Seiten die angezeigt werden
  pageSize: number; //Anzahl der Items per Seite

  loadedOffers: OfferShortListForTiles[] = [];

  isAuthenticated = false;
  componentsDisabled = true;
  noFilterSet = true;

  // Filter
  filterMapIsLoaded = false;
  staticFilterList: Map<string, OfferPropertyList>; // Properties/Filter aus der API
  filterObj: OfferFilterToAPI; // Filter an die API
  filterInit: Map<string, number>; // gespeicherter Filter
  currentFilter: Map<string, number>; //aktueller Filter

  message: string;
  isError: boolean;
  isLoading: boolean;

  constructor(
    private offerDataService: OfferDataService,
    private metaDataService: MetaDataService,
    private authService: AuthService,
    private statusService: FilterStatusService,
    private staticService: StaticService
  ) {
    this.pageCollectionSize = 10; // Anzahl der Items
    this.pageMaxSize = 5; //max.Seiten die angezeigt werden
    this.pageSize = environment.offerItemPerPage; // Items per Page

    this.page = 1; // Current Page
    this.filterObj = {};
    this.staticFilterList = new Map();
  }

  ngOnInit() {
    this.onIsAuthenticated = this.authService.userAuthenticated$.subscribe((userData: UserData) => {
      this.isAuthenticated = userData.isAuth;
    });

    const savedFilter = this.statusService.getofferListFilterStatus();
    this.setFilterParams(savedFilter);
    this.loadFilterMetaData();
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.onIsAuthenticated) this.onIsAuthenticated.unsubscribe();
    if (this.offerSubscription) this.offerSubscription.unsubscribe();
    if (this.metaSubscription) this.metaSubscription.unsubscribe();
  }

  /**
   * Called from Directive when FilterBox was changed
   * @param filterInComboboxes
   */
  onFilterChanged(filterInComboboxes: Map<string, number>) {
    this.currentFilter = filterInComboboxes;
    this.changeFilter();
  }

  /**
   * Called from PaginationComponent when page was changed
   */
  onPageChange() {
    //console.log('PageChange', this.page);
    this.statusService.saveFilterStatus(this.page, this.currentFilter);
    this.loadData();
  }

  /**
   * Called from Reset Button
   */
  onResetFilter() {
    const resetFilter = this.statusService.resetFilterStatus();
    this.setFilterParams(resetFilter);
    this.loadData();
  }

  /**
   * Loads FilterProperties from API
   */
  private loadFilterMetaData() {
    this.metaSubscription = this.metaDataService.getFilterTags().subscribe(
      (filterMap: Map<string, OfferPropertyList>) => {
        this.staticFilterList = filterMap;
        this.filterMapIsLoaded = true;
      },
      (error) => {
        this.staticFilterList.delete;
        this.filterObj = {};
        this.filterMapIsLoaded = false;
        console.log('Error-Filterdaten: ', error);
      }
    );
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
      .getPaginatedOfferList(this.page, this.pageSize, this.filterObj)
      .subscribe(
        (paginatedData: PaginatedOfferData) => {
          this.loadedOffers = paginatedData.data;
          this.pageCollectionSize = paginatedData.total;

          //this.page = paginatedData.current_page;
          //this.pageSize = paginatedData.per_page;

          this.isError = false;
          this.componentsDisabled = false;
          this.message = '';
        },
        (error) => {
          console.log('Error in OffersList:', error);
          this.loadedOffers = [];
          this.isError = true;
          this.componentsDisabled = true;
          this.message = 'Ein Fehler ist aufgetreten. Es konnten keine Angebote geladen werden.';
        },
        () => {
          this.isLoading = false;
          // console.log('Completed');
        }
      );
  }

  /**
   * Called when Filter was changed in Comboboxes
   * @param page
   */
  private changeFilter(page: number = 1) {
    this.filterObj = DataMapping.mapFilterToAPIFilter(this.currentFilter);
    this.noFilterSet = Object.keys(this.filterObj).length == 0;
    this.page = page;

    console.log('Filter-Map', this.currentFilter);
    console.log('Filter-Array to API', this.filterObj);

    this.statusService.saveFilterStatus(this.page, this.currentFilter);
    this.loadData();
  }

  /**
   * Sets local FilterParams from saved params
   * @param filter
   */
  private setFilterParams(filter: OfferListFilterStatus) {
    console.log('savedFilters:', filter);
    this.filterInit = filter.filterMap;
    this.currentFilter = this.filterInit;
    this.page = filter.page;
    this.noFilterSet = !filter.filterOn;
    this.filterObj = DataMapping.mapFilterToAPIFilter(this.filterInit);
  }
}
