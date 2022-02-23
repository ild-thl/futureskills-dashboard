import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Offer } from 'src/app/core/models/offer';
import { StaticService } from 'src/app/config/static.service';
import { Objects, Permissions } from 'src/app/core/models/permissions';
import { ErrorHandlerService } from 'src/app/core/services/error-handling/error-handling';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss'],
})
export class OfferDetailComponent implements OnInit, OnDestroy {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  private userSub: Subscription | undefined;
  private paramsSub: Subscription | undefined;

  offer: Offer | undefined;
  object = Objects;
  permission = Permissions;

  isLoading: boolean;
  isError: boolean;
  errMessage: string;

  constructor(
    private offerDataService: OfferDataService,
    private route: ActivatedRoute,
    private staticConfig: StaticService,
    private errorHandler: ErrorHandlerService
  ) {
    this.isError = false;
    this.isLoading = false;
    this.errMessage = '';
  }

  ngOnInit() {
    this.resetError();
    this.isLoading = false;

    // Daten laden, wenn sich der Übergabeparameter ändert
    this.paramsSub = this.route.paramMap.subscribe((params) => {
      const strParam = params.get('id');

      if (strParam && strParam.length > 0) {
        const offerId: number = +strParam;

        if (Number.isNaN(offerId)) {
          this.setError();
          this.isLoading = false;

        } else {
          this.resetError();
          this.isLoading = true;

          this.userSub = this.offerDataService.getOfferDataForDetail(offerId).subscribe({
            next: (data) => {
              //this.logService.log('offer-detail', 'Detaildata', data);
              this.offer = data.offerData;
              this.resetError();
              this.isLoading = false;
            },
            error: (error: Error) => {
              this.setError();
              this.isLoading = false;
            },
          });
        }
      } else {
        this.setError();
        this.isLoading = false;
      }
    });
  }

  /**
   * @deprecated
   * Aktuell kann nicht subscribed werden
   */
  subscribeToOffer() {}

  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private setError() {
    this.isError = true;
    this.errMessage = this.errorHandler.ERROR_MESSAGES.E404_OFFER_NOT_FOUND;
  }

  private resetError() {
    this.errMessage = '';
    this.isError = false;
  }
}
