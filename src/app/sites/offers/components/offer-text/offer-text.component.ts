import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/core/models/offer';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { ErrorHandlerService } from 'src/app/core/services/error-handling/error-handling';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-offer-text',
  templateUrl: './offer-text.component.html',
  styleUrls: ['./offer-text.component.scss']
})
export class OfferTextComponent implements OnInit {
  private userSub: Subscription;
  private paramsSub: Subscription;

  public offer: Offer;
  public user: User;
  public isLoading = false;
  public subscribed = false;

  isError: boolean;
  errMessage: string;

  constructor(
    private offerDataService: OfferDataService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.paramsSub = this.route.paramMap.subscribe((params) => {
      const offerId = +params.get('id');

      this.isLoading = true;
      this.errMessage = '';
      this.isError = false;

      this.userSub = this.offerDataService.getOfferDataForDetail(offerId).subscribe({
        next: (data) => {
          //this.logService.log('offer-detail', 'Detaildata', data);
          this.user = data.user;
          this.offer = data.offerData;
          this.subscribed = false;
          this.isLoading = false;
          this.errMessage = '';
          this.isError = false;
        },
        error: (error: Error) => {
          this.isLoading = false;
          this.isError = true;
          //this.errMessage =this.errorHandler.getErrorMessage(error, 'offer');
          // Besser immer die not-found-Fehlermeldung anzeigen.
          this.errMessage = this.errorHandler.ERROR_MESSAGES.E404_OFFER_NOT_FOUND;
        },
      });
    });
  }

}
