import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { MiniOffersData, SmallOfferDetailData } from 'src/app/core/models/offer';
import { SortableHeaderDirective, SortEvent } from './component/sortable-header.directive';

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

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

  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

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

  onSort(event: SortEvent) {
    const column = event.column;
    const direction = event.direction;
    console.log('EVENT', event);

    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.shortOfferList = this.baseShortOfferList;
    } else {
      this.shortOfferList = [...this.baseShortOfferList].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

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
