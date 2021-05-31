import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { MetaDataService } from 'src/app/core/data/meta/meta-data.service';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { StaticService } from 'src/app/config/static.service';

import { Offer } from 'src/app/core/models/offer';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit, OnDestroy {
  private onDataChange: Subscription;
  private onIsAuthenticated: Subscription;

  lnkAdminOfferNew = this.staticConfig.getPathInfo().lnkAdminOfferNew;

  allOffers: Offer[] = [];
  loadedOffers: Offer[] = [];

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
    private staticConfig: StaticService
  ) {}

  ngOnInit() {
    this.message = '';
    this.isError = false;
    this.isLoading = true;

    this.loadFilterMetaData();

    this.onDataChange = this.offerDataService.getAllOffersForList().subscribe(
      (offers) => {
        this.loadedOffers = offers;
        this.allOffers = offers;
        this.isError = false;
        this.isLoading = false;
        this.message = '';
       // console.log(this.allOffers);
      },
      (error) => {
        console.log('Error in OffersList:', error);
        this.isLoading = false;
        this.loadedOffers = [];
        this.allOffers = [];
        this.isError = true;
        // Todo: Passende Fehlermeldung
        this.message = 'Ein Fehler ist aufgetreten. Es konnten keine Angebote geladen werden.';
      }
    );

    this.onIsAuthenticated = this.authService.userAuthenticated$.subscribe((userData: UserData) => {
      this.isAuthenticated = userData.isAuth;
    });
  }

  loadFilterMetaData() {
    this.metaDataService.getFilterTags().subscribe(
      (data: OfferPropertyList[]) => {
        for (var filterItem of data) {
          this.filterMap.set(filterItem.type, filterItem);
        }
        this.filterListLoaded = true;
      },
      (error) => {
        this.filterMap.delete;
        this.filterListLoaded = false;
        console.log('Error-Filterdaten: ', error);
      }
    );
  }

  onFilterChanged(filterFunctions) {
    //console.log('FilterChanged:', filterFunctions);

    let filteredOffers = this.allOffers;
    for (var filterFunct of filterFunctions) {
      // und-verkettung der filter
      filteredOffers = filteredOffers.filter(filterFunct);
    }
    this.loadedOffers = filteredOffers;
  }

  ngOnDestroy(): void {
    this.onDataChange.unsubscribe();
    this.onIsAuthenticated.unsubscribe();
  }
}
