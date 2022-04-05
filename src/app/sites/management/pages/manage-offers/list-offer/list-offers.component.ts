import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StaticService } from 'src/app/config/static.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { MiniOffersData, SmallOfferDetailData } from 'src/app/core/models/offer';
import { NgbdModalAskOfferDeleteComponent } from '../../../components/modalWindows/modal-offer-delete/ngbd-modal-offerdelete';
import { ErrorHandlerService } from 'src/app/core/services/error-handling/error-handling';
import { MessageService, TOASTCOLOR } from 'src/app/core/services/messages-toasts/message.service';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.scss'],
})
export class ListOffersComponent implements OnInit, OnDestroy {
  private offerListSub: Subscription;
  shortOfferList: MiniOffersData[];
  baseShortOfferList: MiniOffersData[];
  offersAreLoaded: boolean;
  errorOccured: boolean;
  errorMessage: string;

  lnkManageOfferNew = this.staticConfig.getPathInfo().lnkManageOfferNew;

  constructor(
    private offerDataService: OfferDataService,
    private staticConfig: StaticService,
    private modalService: NgbModal,
    private errorHandler: ErrorHandlerService,
    private toastService: MessageService
  ) {
    this.shortOfferList = [];
    this.baseShortOfferList = [];
    this.offerListSub = null;
    this.offersAreLoaded = false;
    this.errorOccured = false;
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.loadOfferList();
  }

  ngOnDestroy(): void {
    if (this.offerListSub) this.offerListSub.unsubscribe();
  }

  /**
   * LoadOfferList
   */
  loadOfferList() {
    this.offersAreLoaded = false;
    this.errorOccured = false;
    this.errorMessage = '';

    this.offerListSub = this.offerDataService.getSmallOfferListForManagement().subscribe({
      next: (value: MiniOffersData[]) => {
        // console.log("OfferList:", value);
        this.baseShortOfferList = value;
        this.shortOfferList = value;
        this.offersAreLoaded = true;
        this.errorOccured = false;
        this.errorMessage = '';
      },
      error: (error) => {
        this.baseShortOfferList = [];
        this.shortOfferList = [];
        this.offersAreLoaded = true;
        this.errorOccured = true;
        this.errorMessage = this.errorHandler.getErrorMessage(error, 'offers');
      },
    });
  }

  showModalWindowDeleteOffer(event: SmallOfferDetailData) {
    const title = event.title;
    const id = event.id;
    const modalRef = this.modalService.open(NgbdModalAskOfferDeleteComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = event !== undefined ? title : '';
    modalRef.result.then(
      (result) => {
        this.deleteOffer(id);
      },
      (reason) => {}
    );
  }

  private deleteOffer(offerID: number) {
    // TODO: Lädt-Anzeige an
    if (offerID && offerID > 0) {
      this.offerDataService.deleteOfferWithID(offerID).subscribe({
        next: (value) => {
          this.toastService.showToast(
            { header: 'Kurs löschen', body: 'Der Kurs wurde gelöscht.' },
            TOASTCOLOR.SUCCESS
          );
          this.loadOfferList();
        },
        error: (error: Error) => {
          const message = this.errorHandler.getErrorMessage(error, 'offer');
          this.toastService.showToast({ header: 'Kurs löschen', body: message }, TOASTCOLOR.DANGER);
        },
      });
    }
  }
}
