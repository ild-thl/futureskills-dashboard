import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from 'src/app/core/http/api/api.service';
import { FilterTagResponse, FilterItemResponse } from 'src/app/core/http/api/api.interfaces';

import { FilterList } from 'src/app/core/models/meta';

@Injectable({
  providedIn: 'root',
})
export class MetaDataService {
  filterList: FilterList[] = undefined;
  constructor(private apiService: ApiService) {}

  // //////////////////////////////////
  // get FilterTags
  // //////////////////////////////////

  public getFilterTags(): Observable<FilterList[]> {
    if (this.filterList == undefined) {
      return this.apiService.getFilterTags().pipe(
        map((data: FilterTagResponse) => {
          const filterArray: FilterItemResponse[] = data.filter;
          this.filterList = this.mapMetaDataToFilterLists_de(filterArray);
          //console.log('Filterlist: ', this.filterList);
          return this.filterList;
        })
      );
    } else {
      //console.log('Filterlist already loaded.');
      return of(this.filterList);
    }
  }

  private mapMetaDataToFilterLists_de(dataArray): FilterList[] {
    return dataArray.map((item: FilterItemResponse) => {
      const tempList = item.list.map((listItem) => {
        return {
          id: listItem.id,
          identifier: listItem.identifier,
          description: listItem.description.de,
        };
      });
      return new FilterList(item.tag, tempList);
    });
  }
}
