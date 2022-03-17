import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalLmsContentComponent } from 'src/app/sites/offers/components/modalWindows/modal-offer-to-lms/ngbd-modal-lmscontent';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Offer } from 'src/app/core/models/offer';
import { StaticService } from 'src/app/config/static.service';
import { Objects, Permissions } from 'src/app/core/models/permissions';
import { LogService } from 'src/app/core/services/logger/log.service';


@Component({
  selector: 'fs-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  lnkAdminOfferEdit = this.staticConfig.getPathInfo().lnkAdminOfferEdit;
  lnkManageOfferEdit = this.staticConfig.getPathInfo().lnkManageOfferEdit;

  @Input() offer: Offer;

  // Permission-Set
  object = Objects;
  permission = Permissions;

  constructor(
    private offerDataService: OfferDataService,
    private router: Router,
    private modalService: NgbModal,
    private staticConfig: StaticService,
    private logService: LogService
  ) {}


  /**
   * @deprecated
   * Aktuell kann nicht subscribed werden
   */
  subscribeToOffer() {}

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

  private isExternalURL(str: string): boolean {
    // Muss mit http(s):// anfangen
    return /^http[s]?:\/\//.test(str);
  }

}
