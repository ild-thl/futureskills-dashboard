import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { NgbdModalLmsContentComponent } from 'src/app/sites/offers/components/modalWindows/modal-offer-to-lms/ngbd-modal-lmscontent';
//import { NgbdModalOfferDeleteComponent } from 'src/app/sites/offers/components/modalWindows/modal-offer-delete/ngbd-modal-offerdelete';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Offer } from 'src/app/core/models/offer';
import { StaticService } from 'src/app/config/static.service';
import { Objects, Permissions } from 'src/app/core/models/permissions';
//import { LogService } from 'src/app/core/services/logger/log.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handling/error-handling';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss'],
})
export class OfferDetailComponent implements OnInit, OnDestroy {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  //lnkAdminOfferEdit = this.staticConfig.getPathInfo().lnkAdminOfferEdit;
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
    //private router: Router,
    //private modalService: NgbModal,
    private staticConfig: StaticService,
    //private logService: LogService,
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

  /*deleteOffer() {
    // TODO: Lädt-Anzeige an
    if (this.offer) {
      this.offerDataService.deleteOffer(this.offer).subscribe({
        next: (value) => {
          this.router.navigate([this.lnkOffers]);
        },
        error: (error: Error) => {
          // TODO: Rückmeldung?
        },
      });
    }
  }
*/
  /**
   * @deprecated
   * Aktuell kann nicht subscribed werden
   */
  subscribeToOffer() {}
/*
  forwardToLMS() {
    if (this.offer) {
      if (this.offer.url == null || this.offer.url == undefined) {
        this.logService.log('offer-detail:', 'PATH is not defined');
        return;
      }

      if (!this.isExternalURL(this.offer.url)) {
        this.logService.log('offer-detail: ', 'PATH is not valid: ', this.offer.url);
        return;
      } else {
      }

      if (window) {
        (window as any).location.href = this.offer.url;
        // Alternativ neues Fenster
        //(window as any).open(this.offer.url, "_blank");
      }
    }
  }

  showModalWindowToLMS() {
    const modalRef = this.modalService.open(NgbdModalLmsContentComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = this.offer !== undefined ? this.offer.title : '';
    modalRef.result.then(
      (result) => {
        // console.log('Weiter ', result);
        this.forwardToLMS();
      },
      (reason) => {
        // Cancel by button or ModalDismissReasons
        // console.log('Cancel ', reason);
      }
    );
  }

  showModalWindowDeleteOffer() {
    const modalRef = this.modalService.open(NgbdModalOfferDeleteComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = this.offer !== undefined ? this.offer.title : '';
    modalRef.result.then(
      (result) => {
        this.deleteOffer();
      },
      (reason) => {}
    );
  }*/

  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  /*private isExternalURL(str: string): boolean {
    // Muss mit http(s):// anfangen
    return /^http[s]?:\/\//.test(str);
  }*/

  private setError() {
    this.isError = true;
    this.errMessage = this.errorHandler.ERROR_MESSAGES.E404_OFFER_NOT_FOUND;
  }

  private resetError() {
    this.errMessage = '';
    this.isError = false;
  }
}
