import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalLmsContent } from 'src/app/sites/offers/components/modalWindows/modal-offer-to-lms/ngbd-modal-lmscontent';
import { NgbdModalOfferDelete } from 'src/app/sites/offers/components/modalWindows/modal-offer-delete/ngbd-modal-offerdelete';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Offer } from 'src/app/core/models/offer';
import { User } from 'src/app/core/models/user';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss'],
})
export class OfferDetailComponent implements OnInit, OnDestroy {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  lnkAdminOfferEdit = this.staticConfig.getPathInfo().lnkAdminOfferEdit;
  private userSub: Subscription;
  private paramsSub: Subscription;

  public offer: Offer;
  public user: User;
  public isLoading = false;
  public subscribed = false;
  public isAuthenticated = false;

  isError: boolean;
  errMessage: string;

  constructor(
    private offerDataService: OfferDataService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private staticConfig: StaticService
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.paramMap.subscribe((params) => {
      const offerId = +params.get('id');
      console.log('Aktuelle Id:', offerId);
      this.isLoading = true;
      this.errMessage = '';
      this.isError = false;

      this.userSub = this.offerDataService.getOfferDataForDetail(offerId).subscribe(
        (data) => {
          console.log('Detaildata:', data);
          this.user = data.user;
          this.offer = data.offerData;
          this.subscribed = false;
          this.isLoading = false;
          this.errMessage = '';
          this.isError = false;
          // TODO: Proper Auth check when user roles are available
          if (this.user !== undefined) {
            this.isAuthenticated = true;
          }
        },
        (error) => {
          console.log('ErrorMessage:', error);
          this.isLoading = false;
          this.isError = true;
          this.errMessage = 'Der Kurs wurde nicht gefunden.';
        }
      );
    });
  }

  deleteOffer() {
    console.log('delete:' + this.offer.id);
    // Kurse, die gebucht sind lassen sich nicht löschen
    // Todo: Vorher prüfen oder Fehlermeldung abfangen

    // TODO: Lädt-Anzeige an
    this.offerDataService.deleteOffer(this.offer).subscribe((value) => {
      // TODO: Lädt-Anzeige aus
      this.router.navigate([this.lnkOffers]);
    }),
      (error) => {
        // TODO: Lädt-Anzeige aus + Fehlermeldung
        console.log('Error Delete: ', error);
      };
  }

  /**
   * @deprecated
   * Aktuell kann nicht subscribed werden
   */
  subscribeToOffer() {}

  forwardToLMS() {
    if (this.offer.url == null || this.offer.url == undefined) {
      console.log('PATH is not defined');
      return;
    }

    if (!this.isExternalURL(this.offer.url)) {
      console.log('PATH is not valid: ', this.offer.url);
      return;
    } else {
      console.log('Redirect to: ', this.offer.url);
    }

    if (window) {
      (window as any).location.href = this.offer.url;
      // Alternativ neues Fenster
      //(window as any).open(this.offer.url, "_blank");
    }
  }

  showModalWindowToLMS() {
    const modalRef = this.modalService.open(NgbdModalLmsContent, {
      centered: true,
    });
    modalRef.componentInstance.title = this.offer.title;
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
    const modalRef = this.modalService.open(NgbdModalOfferDelete, {
      centered: true,
    });
    modalRef.componentInstance.title = this.offer.title;
    modalRef.result.then(
      (result) => {
        // console.log('Weiter ', result);
        this.deleteOffer();
      },
      (reason) => {
        // Cancel by button or ModalDismissReasons
        // console.log('Cancel ', reason);
      }
    );
  }

  isExternalURL(str: string): boolean {
    // Muss mit http(s):// anfangen
    return /^http[s]?:\/\//.test(str);
  }

  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }
}
