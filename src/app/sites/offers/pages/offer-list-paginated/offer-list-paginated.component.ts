import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { StaticService } from 'src/app/config/static.service';

import { OfferShortListForTiles, PaginatedOfferData } from 'src/app/core/models/offer';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MetaDataService } from 'src/app/core/data/meta/meta-data.service';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { OfferFilterToAPI } from 'src/app/core/http/api/api.interfaces';

@Component({
  selector: 'app-offer-list-paginated',
  templateUrl: './offer-list-paginated.component.html',
  styleUrls: ['./offer-list-paginated.component.scss'],
})
export class OfferListPaginatedComponent implements OnInit, OnDestroy {
  private onIsAuthenticated: Subscription;
  private offerSubscription: Subscription;

  lnkAdminOfferNew = this.staticService.getPathInfo().lnkAdminOfferNew;

  // Pagination
  pageCollectionSize: number; // Anzahl der Items
  page: number; // aktuelle Seite
  pageMaxSize: number; //max.Seiten die angezeigt werden
  pageBoundaryLinks: boolean;
  pageSize: number; //Anzahl der Items per Seite

  loadedOffers: OfferShortListForTiles[] = [];

  pageQueryParam: string;
  filterListLoaded = false;
  filterMap = new Map();
  filterObj: OfferFilterToAPI;

  isAuthenticated = false;

  message: string;
  isError: boolean;
  isLoading: boolean;

  constructor(
    private offerDataService: OfferDataService,
    private metaDataService: MetaDataService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private staticService: StaticService
  ) {
    this.pageCollectionSize = 10; // Anzahl der Items
    this.page = 1; // aktuelle Seite
    this.pageMaxSize = 1; //max.Seiten die angezeigt werden
    this.pageBoundaryLinks = true;
    this.pageSize = this.staticService.getOfferDefaultCount();
  }

  ngOnInit() {
    this.onIsAuthenticated = this.authService.userAuthenticated$.subscribe((userData: UserData) => {
      this.isAuthenticated = userData.isAuth;
    });

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.pageQueryParam = params.get('page');
      const newPage: number = +this.pageQueryParam;
      if (!newPage || newPage == NaN || newPage <= 0) {
        this.page = 1;
      } else {
        this.page = newPage;
      }
    });

    this.filterObj = {};
    this.loadFilterMetaData();
    this.loadData(this.page, this.pageSize, this.filterObj);
  }

  loadData(page: number, pageSize: number, filterObj: OfferFilterToAPI) {
    this.message = '';
    this.isError = false;
    this.isLoading = true;

    this.offerSubscription = this.offerDataService
      .getPaginatedOfferList(page, pageSize, filterObj)
      .subscribe(
        (paginatedData: PaginatedOfferData) => {
          this.loadedOffers = paginatedData.data;
          this.pageCollectionSize = paginatedData.total;

          //this.page = paginatedData.current_page;
          //this.pageSize = paginatedData.per_page;

          this.isError = false;
          this.message = '';
        },
        (error) => {
          console.log('Error in OffersList:', error);
          this.isLoading = false;
          this.loadedOffers = [];
          this.isError = true;
          // Todo: Passende Fehlermeldung
          this.message = 'Ein Fehler ist aufgetreten. Es konnten keine Angebote geladen werden.';
        },
        () => {
          this.isLoading = false;
          console.log('Completed');
        }
      );
  }

  loadFilterMetaData() {
    this.metaDataService.getFilterTags().subscribe(
      (filterMap: Map<string, OfferPropertyList>) => {
        this.filterMap = filterMap;
        this.filterListLoaded = true;
      },
      (error) => {
        this.filterMap.delete;
        this.filterListLoaded = false;
        console.log('Error-Filterdaten: ', error);
      }
    );
  }

  onFilterChanged(filterArray: OfferFilterToAPI) {
    console.log('FilterChanged:', filterArray);
    //this.filterObj = filterArray;
    //this.loadData(this.page, this.pageSize, this.filterObj);
  }

  pageChange() {
    console.log('PageChange', this.page);
    this.loadData(this.page, this.pageSize, this.filterObj);
  }

  ngOnDestroy(): void {
    if (this.onIsAuthenticated) this.onIsAuthenticated.unsubscribe();
    if (this.offerSubscription) this.offerSubscription.unsubscribe();
  }
}
