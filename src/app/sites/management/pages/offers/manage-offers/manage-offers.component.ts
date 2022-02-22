/* eslint-disable @angular-eslint/no-host-metadata-property */
import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { SmallOfferDetailData } from 'src/app/core/models/offer';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss'],
})
export class ManageOffersComponent implements OnInit {
  private offerListSub: Subscription;
  shortOfferList: SmallOfferDetailData[];
  baseShortOfferList: SmallOfferDetailData[];

  constructor(private offerDataService: OfferDataService) {
    this.shortOfferList = [];
    this.baseShortOfferList = [];
    this.offerListSub = null;
  }

  ngOnInit(): void {
    this.loadOfferList();
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
