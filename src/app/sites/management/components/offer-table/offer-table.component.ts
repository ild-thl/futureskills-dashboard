import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { MiniOffersData, SmallOfferDetailData } from 'src/app/core/models/offer';

export type SortColumn = keyof SmallOfferDetailData | '';
export type SortDirection = 'asc' | 'desc' | '';
export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Component({
  selector: 'fs-offer-table',
  templateUrl: './offer-table.component.html',
  styleUrls: ['./offer-table.component.scss'],
})
export class OfferTableComponent implements OnInit, OnChanges {
  @Input() offerList: MiniOffersData[] = [];
  @Output() deleteEvent = new EventEmitter<SmallOfferDetailData>();

  baseShortOfferList: MiniOffersData[];
  shortOfferList: MiniOffersData[];

  lnkManageOfferEdit = this.staticService.getPathInfo().lnkManageOfferEdit;

  page: number;
  pageSize: number;
  collectionSize: number;

  constructor(private staticService: StaticService) {
    this.page = 1;
    this.pageSize = 10;
    this.collectionSize = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initTableValues();
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  refreshOffers() {
    this.shortOfferList = this.baseShortOfferList
      .map((offer, i) => ({ id: i + 1, ...offer }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  onSort({ column, direction }: SortEvent) {}

  initTableValues() {
    this.baseShortOfferList = this.offerList;
    this.shortOfferList = this.offerList;
    this.collectionSize = this.shortOfferList.length;
    this.refreshOffers();
  }

  onOfferShouldBeDeleted(offer: SmallOfferDetailData) {
    this.deleteEvent.emit(offer);
  }
}
