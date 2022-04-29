import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
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
export class OfferTableComponent implements OnChanges, AfterViewInit, OnInit, OnDestroy {
  @Input() offerList: MiniOffersData[] = [];
  @Output() deleteEvent = new EventEmitter<SmallOfferDetailData>();
  @Output() visibleEvent = new EventEmitter<{ offerID: number; visible: boolean }>();

  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  lnkManageOfferEdit = this.staticService.getPathInfo().lnkManageOfferEdit;
  maxSize = 4;

  keyUp$ = new Subject<string>();
  keyUpSubsciption: Subscription;
  defaultText: string;

  baseShortOfferList: MiniOffersData[];
  sortedOfferList: MiniOffersData[];

  state: State;
  collectionSize: number;

  constructor(
    private manageCourseListService: ManageCourseListService,
    private staticService: StaticService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.defaultText = '';
    this.collectionSize = 0;
    this.state = this.manageCourseListService.getClearState();
  }

  ngOnInit(): void {
    // Auto-Suchfeld
    this.keyUpSubsciption = this.keyUp$
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((searchTerm) => this.onAutoSearch(searchTerm))
      )
      .subscribe((value) => {
        //console.log('Searchstring:', value);
        this.searchTextChanged(value);
      });
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

  ngOnDestroy(): void {
    if (this.keyUpSubsciption) this.keyUpSubsciption.unsubscribe();
  }

  onPaginationChanged() {
    this.refreshOfferList();
  }

  onAutoSearch(searchString: string): Observable<any> {
    return of(searchString);
  }

  searchTextChanged(searchTerm: any) {
    this.state.searchTerm = searchTerm;
    this.refreshOfferList();
  }

  onSort(event: SortEvent) {
    this.state.sortColumn = event.column;
    this.state.sortDirection = event.direction;

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

  private matches(course: MiniOffersData, term: string) {
    return course.title.toLowerCase().includes(term);
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

    // Filter
    const filteredList = this.baseShortOfferList.filter((course) =>
      this.matches(course, searchTerm)
    );
    this.collectionSize = filteredList.length;

    // Sort
    const sortedList = this.sortOfferList(filteredList, sortColumn, sortDirection);

    // Paginate
    this.sortedOfferList = this.paginateOfferList(sortedList, pageSize, page);

    // Save State
    this.manageCourseListService.state = this.state;
    //console.log('SAVED STATE', this.manageCourseListService.state);
  }

  private initTableValues() {
    this.baseShortOfferList = this.offerList;
    this.collectionSize = this.baseShortOfferList.length;
    this.defaultText = this.state.searchTerm;
    //console.log('OriginalList:', this.offerList);

    this.refreshOfferList();
  }

  private initializeHeaderValues() {
    this.headers.forEach((header) => {
      if (header.sortable === this.state.sortColumn) {
        header.direction = this.state.sortDirection;
      }
    });
  }
}
