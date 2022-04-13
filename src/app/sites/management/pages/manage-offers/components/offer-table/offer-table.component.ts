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
import { Observable } from 'rxjs';
import { StaticService } from 'src/app/config/static.service';
import { MiniOffersData, SmallOfferDetailData } from 'src/app/core/models/offer';
import { ManageCourseListService } from 'src/app/sites/management/services/manage-course-list.service';
import {
  SortableHeaderDirective,
  SortColumn,
  SortDirection,
  SortEvent,
} from './component/sortable-header.directive';

const altcompare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

interface State {
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

@Component({
  selector: 'fs-offer-table',
  templateUrl: './offer-table.component.html',
  styleUrls: ['./offer-table.component.scss'],
})
export class OfferTableComponent implements  OnChanges {
  @Input() offerList: MiniOffersData[] = [];
  @Output() deleteEvent = new EventEmitter<SmallOfferDetailData>();
  @Output() visibleEvent = new EventEmitter<{ offerID: number; visible: boolean }>();

  baseShortOfferList: MiniOffersData[];
  sortedOfferList: MiniOffersData[];

  lnkManageOfferEdit = this.staticService.getPathInfo().lnkManageOfferEdit;

  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  page: number;
  pageSize: number;
  collectionSize: number;
  sortColumn: SortColumn;
  sortDirection: SortDirection;

  constructor(private offerService: ManageCourseListService, private staticService: StaticService) {
    this.page = 1;
    this.pageSize = 10;
    this.collectionSize = 0;
    this.sortColumn = '';
    this.sortDirection = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.baseShortOfferList = this.offerList;
    this.collectionSize = this.baseShortOfferList.length;
    console.log('OriginalList:', this.offerList);
    this.refreshOfferList();
  }

  onRefreshOfferList() {
    this.refreshOfferList();
  }

  private refreshOfferList(){
    // Sort
    const sort = this.sortOfferList(this.baseShortOfferList, this.sortColumn, this.sortDirection);
    console.log('SortedLIst:', sort);
    // Paginate
    this.sortedOfferList = this.paginateOfferList(sort, this.pageSize, this.page);
  }

  onSort(event: SortEvent) {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    console.log('EVENT', event);

    this.headers.forEach((header) => {
      if (header.sortable !== this.sortColumn) {
        header.direction = '';
      }
    });

    this.onRefreshOfferList();
  }

  onOfferShouldBeDeleted(offer: SmallOfferDetailData) {
    this.deleteEvent.emit(offer);
  }

  private compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  private sortOfferList(
    offers: MiniOffersData[],
    column: SortColumn,
    direction: SortDirection
  ): MiniOffersData[] {
    if (direction === '' || column === '') {
      return offers;
    } else {
      const sortedList = [...offers].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
      return sortedList;
    }
  }

  private paginateOfferList(offers: MiniOffersData[], pageSize: number, page: number): MiniOffersData[] {
    const sortedList = offers
      .map((offer, i) => ({ id: i + 1, ...offer }))
      .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return sortedList;
  }

}
