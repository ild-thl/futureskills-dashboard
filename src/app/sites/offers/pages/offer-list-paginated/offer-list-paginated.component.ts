import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { MetaDataService } from 'src/app/core/data/meta/meta-data.service';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { StaticService } from 'src/app/config/static.service';

import { OfferShortListForTiles, PaginatedOfferData } from 'src/app/core/models/offer';
import { ActivatedRoute, ParamMap } from '@angular/router';

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

  isAuthenticated = false;

  message: string;
  isError: boolean;
  isLoading: boolean;

  constructor(
    private offerDataService: OfferDataService,
    private authService: AuthService,
    private metaDataService: MetaDataService,
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
    this.message = '';
    this.isError = false;
    this.isLoading = true;

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.pageQueryParam = params.get('page');
      const newPage: number = +this.pageQueryParam;
      if (!newPage || newPage == NaN || newPage <= 0){
        this.page = 1
      } else {
        this.page = newPage;
      }
    });

    this.loadData(this.page, this.pageSize);

    this.onIsAuthenticated = this.authService.userAuthenticated$.subscribe((userData: UserData) => {
      this.isAuthenticated = userData.isAuth;
    });
  }

  loadData(page: number, pageSize: number) {
    this.offerSubscription = this.offerDataService.getPaginatedOfferList(page, pageSize).subscribe(
      (paginatedData: PaginatedOfferData) => {
        this.loadedOffers = paginatedData.data;
        this.pageCollectionSize = paginatedData.total;

        //this.page = paginatedData.current_page;
        //this.pageSize = paginatedData.per_page;

        this.isError = false;
        this.isLoading = false;
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
        //console.log('Completed');
      }
    );
  }

  pageChange() {
    console.log('PageChange', this.page);
    this.loadData(this.page, this.pageSize);
  }

  ngOnDestroy(): void {
    if (this.onIsAuthenticated) this.onIsAuthenticated.unsubscribe();
    if (this.offerSubscription) this.offerSubscription.unsubscribe();
  }
}
