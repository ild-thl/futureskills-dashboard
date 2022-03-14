import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StaticService } from 'src/app/config/static.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { SmallOfferDetailData } from 'src/app/core/models/offer';
import { NgbdModalAskOfferDeleteComponent } from '../../../components/modalWindows/modal-offer-delete/ngbd-modal-offerdelete';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.scss'],
})
export class ListOffersComponent implements OnInit, OnDestroy {
  private offerListSub: Subscription;
  shortOfferList: SmallOfferDetailData[];
  baseShortOfferList: SmallOfferDetailData[];
  offersAreLoaded: boolean;

  lnkManageOfferNew = this.staticConfig.getPathInfo().lnkManageOfferNew;

  constructor(
    private offerDataService: OfferDataService,
    private staticConfig: StaticService,
    private modalService: NgbModal
  ) {
    this.shortOfferList = [];
    this.baseShortOfferList = [];
    this.offerListSub = null;
    this.offersAreLoaded = false;
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
    this.offerListSub = this.offerDataService.getSmallOfferListForManagement().subscribe({
      next: (value) => {
        console.log(value);
        this.baseShortOfferList = value;
        this.shortOfferList = value;
        this.offersAreLoaded = true;
      },
      error: (error) => {
        console.log(error);
        this.baseShortOfferList = [];
        this.shortOfferList = [];
        this.offersAreLoaded = true;
      },
    });
  }

  showModalWindowDeleteOffer(event: SmallOfferDetailData) {

    const title = event.title;
    const modalRef = this.modalService.open(NgbdModalAskOfferDeleteComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = event !== undefined ? title : '';
    modalRef.result.then(
      (result) => {
        console.log("WILL DELETE SOON: ", event);
      },
      (reason) => {}
    );
  }
}
