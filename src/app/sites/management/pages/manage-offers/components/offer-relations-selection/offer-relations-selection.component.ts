import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Offer, SmallOfferListForEditForm } from 'src/app/core/models/offer';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'fs-offer-relations-selection',
  templateUrl: './offer-relations-selection.component.html',
  styleUrls: ['./offer-relations-selection.component.scss'],
})
export class OfferRelationsSelectionComponent implements OnInit, OnDestroy {
  @Input() offer: Offer;
  @Output() relatedOffersOutput = new EventEmitter<number[]>();

  relatedOffersArray: any = [];
  maxRelatedOfferTitleLength: number = 30;
  maxRelatedOffers: number = 3;
  createNewOffer = false;
  selectedOfferModel: Offer;
  buttonMessage: string;
  inputState: boolean = false;
  offerListIsLoaded = false;
  completeOfferList: SmallOfferListForEditForm[] = [];
  alerts: Alert[] = [];
  private onOffersListChange: Subscription;

  constructor(private offerDataService: OfferDataService, private route: ActivatedRoute) {}

  relatedOfferFormatter = (x: { title: string }) => x.title;
  relatedOfferSearch: OperatorFunction<string, readonly { title: any }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term === ''
          ? []
          : this.completeOfferList
              .filter((v) => v.title.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  deleteOffer(i: any) {
    this.relatedOffersArray.splice(i, 1);
    this.offer.relatedOffers.splice(i, 1);
    this.relatedOffersOutput.emit(this.offer.relatedOffers);
    //console.table('delete related ' + i);
  }

  approveOffer() {
    if (this.selectedOfferModel != null) {
      let offerIsInRelations = this.relatedOffersArray.findIndex(
        (offer: any) => offer.id == this.selectedOfferModel.id
      );
      if (offerIsInRelations < 0) {
        let offer = this.selectedOfferModel;
        this.relatedOffersArray.push(offer);
        this.offer.relatedOffers.push(offer.id);
        this.relatedOffersOutput.emit(this.offer.relatedOffers);
        // reset data
        this.selectedOfferModel = null;
        this.setTooltipMessage(false);
        this.toggleInputState();
        this.closeaAllAlerts();
      } else {
        this.addAlert('danger', 'Dieser Kurs befindet sich bereits in den Empfehlungen.');
      }
    }
  }

  toggleInputState() {
    this.inputState = !this.inputState;
  }

  onItemSelection(event: any) {
    this.closeaAllAlerts();
    this.setTooltipMessage(true);
  }

  setTooltipMessage(itemSelected: boolean) {
    this.buttonMessage = itemSelected
      ? 'Empfehlung bestätigen'
      : 'Wählen Sie ein Angebot zur Empfehlung aus';
  }

  ngOnInit(): void {
    const offerId = +this.route.snapshot.params.id;

    if (offerId) {
      this.loadOfferList(offerId);
      this.createNewOffer = false;
    } else {
      this.loadOfferList(null);
      this.createNewOffer = true;
    }
    this.setTooltipMessage(false);
  }

  /**
   * LoadOfferList
   */
  loadOfferList(offerid: number | null) {
    this.onOffersListChange = this.offerDataService
      .getSmallOfferListForEditForm(offerid)
      .subscribe({
        next: (offers: SmallOfferListForEditForm[]) => {
          this.completeOfferList = offers;
          this.showLoadedRelatedOffers();
          this.offerListIsLoaded = true;
        },
        error: (error: Error) => {
          this.offerListIsLoaded = false;
          this.completeOfferList = [];
        },
      });
  }

  showLoadedRelatedOffers() {
    if (this.offer && this.offer.relatedOffers) {
      for (var i = 0; i < this.offer.relatedOffers.length; i++) {
        let offerIndex = this.completeOfferList.findIndex(
          (offer) => offer.id == this.offer.relatedOffers[i]
        );
        let tmpOffer = this.completeOfferList[offerIndex];
        this.relatedOffersArray.push(tmpOffer);
      }
    }
  }
  ngOnDestroy(): void {
    if (this.onOffersListChange) this.onOffersListChange.unsubscribe();
  }

  // Alert Functions

  addAlert(type: string, message: string) {
    this.alerts.push({ type, message });
  }
  closeaAllAlerts() {
    this.alerts = [];
  }
}
