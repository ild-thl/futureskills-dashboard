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
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { StaticService } from 'src/app/config/static.service';
import { MiniOffersData, SmallOfferDetailData } from 'src/app/core/models/offer';
import {
  ManageCourseListService,
  State,
} from 'src/app/sites/management/services/manage-course-list.service';
import {
  SortableHeaderDirective,
  SortColumn,
  SortDirection,
  SortEvent,
} from './component/sortable-header.directive';

@Component({
  selector: 'fs-offer-table',
  templateUrl: './offer-table.component.html',
  styleUrls: ['./offer-table.component.scss'],
})
export class OfferTableComponent implements OnChanges, AfterViewInit {
  @Input() offerList: MiniOffersData[] = [];
  @Output() deleteEvent = new EventEmitter<SmallOfferDetailData>();
  @Output() visibleEvent = new EventEmitter<{ offerID: number; visible: boolean }>();

  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  lnkManageOfferEdit = this.staticService.getPathInfo().lnkManageOfferEdit;
  maxSize = 4;

  baseShortOfferList: MiniOffersData[];
  sortedOfferList: MiniOffersData[];

  state: State;
  collectionSize: number;

  constructor(
    private offerService: ManageCourseListService,
    private manageCourseListService: ManageCourseListService,
    private staticService: StaticService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.collectionSize = 0;
    this.state = this.manageCourseListService.getClearState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('SAVED STATE', this.manageCourseListService.state);
    this.state = this.manageCourseListService.state;
    // Auf die erste Seite?
    this.initTableValues();
  }

  ngAfterViewInit(): void {
    this.initializeHeaderValues();
    this.changeDetectorRef.detectChanges();

  }

  onPaginationChanged() {
    this.refreshOfferList();
  }

  onSort(event: SortEvent) {
    this.state.sortColumn = event.column;
    this.state.sortDirection = event.direction;
    //console.log('EVENT', event);

    this.headers.forEach((header) => {
      if (header.sortable !== this.state.sortColumn) {
        header.direction = '';
      }
    });

    this.refreshOfferList();
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
      return [...offers].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  private paginateOfferList(
    offers: MiniOffersData[],
    pageSize: number,
    page: number
  ): MiniOffersData[] {
    const sortedList = offers
      .map((offer, i) => ({ id: i + 1, ...offer }))
      .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return sortedList;
  }

  private refreshOfferList() {
    const { page, pageSize, searchTerm, sortColumn, sortDirection } = this.state;

    // Sort
    const sortedList = this.sortOfferList(this.baseShortOfferList, sortColumn, sortDirection);

    // Paginate
    this.sortedOfferList = this.paginateOfferList(sortedList, pageSize, page);

    // Save State
    this.manageCourseListService.state = this.state;
    //console.log('SAVED STATE', this.manageCourseListService.state);
  }

  private initTableValues() {
    this.baseShortOfferList = this.offerList;
    this.collectionSize = this.baseShortOfferList.length;
    //console.log('OriginalList:', this.offerList);

    this.refreshOfferList();
  }

  private initializeHeaderValues() {
    this.headers.forEach((header) => {
      //console.log('HEADER', header);
      if (header.sortable === this.state.sortColumn) {
        header.direction = this.state.sortDirection;
      }
    });
  }
}
