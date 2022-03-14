import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { StaticService } from 'src/app/config/static.service';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { SmallOfferDetailData } from 'src/app/core/models/offer';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss'],
})
export class ManageOffersComponent implements OnInit, OnDestroy {
  private offerListSub: Subscription;
  shortOfferList: SmallOfferDetailData[];
  baseShortOfferList: SmallOfferDetailData[];

  lnkManageOfferNew = this.staticConfig.getPathInfo().lnkManageOfferNew;

  constructor(private offerDataService: OfferDataService, private staticConfig: StaticService) {
    this.shortOfferList = [];
    this.baseShortOfferList = [];
    this.offerListSub = null;
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
    this.offerListSub = this.offerDataService.getSmallOfferListForManagement().subscribe({
      next: (value) => {
        console.log(value);
        this.baseShortOfferList = value;
        this.shortOfferList = value;
      },
      error: (error) => {
        console.log(error);
        this.baseShortOfferList = [];
        this.shortOfferList = [];
      },
    });
  }
}
