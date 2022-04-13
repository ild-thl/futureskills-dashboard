import { Injectable } from '@angular/core';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import {
  SortDirection,
} from '../pages/manage-offers/components/offer-table/component/sortable-header.directive';

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

@Injectable()
export class ManageCourseListService {
  private state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };
  constructor(private offerDataService: OfferDataService) {}
}
