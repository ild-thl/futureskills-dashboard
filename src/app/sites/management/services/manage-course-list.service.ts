import { Injectable } from '@angular/core';
import { ManagementConfig } from '../config/config';
import {
  SortColumn,
  SortDirection,
} from '../pages/manage-offers/components/offer-table/component/sortable-header.directive';

export interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

@Injectable()
export class ManageCourseListService {
  private _state: State;
  public get state(): State {
    return this._state;
  }
  public set state(value: State) {
    this._state = value;
  }

  constructor() {
    this.resetState();
  }

  public set(patch: Partial<State>): State {
    Object.assign(this.state, patch);
    return this.state;
  }

  public getClearState(): State {
    return {
      page: 1,
      pageSize: ManagementConfig.courses.table.length,
      searchTerm: '',
      sortColumn: '',
      sortDirection: '',
    };
  }

  private resetState(): State {
    this.state = this.getClearState();
    return this.state;
  }
}
