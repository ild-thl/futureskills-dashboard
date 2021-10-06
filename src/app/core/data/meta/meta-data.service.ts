import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { PropertyCompleteMap } from 'src/app/core/models/offer-properties';
import { DataCacheService } from 'src/app/core/http/api/data-cache.service';

@Injectable({
  providedIn: 'root',
})
export class MetaDataService {
  constructor(private dataCacheService: DataCacheService) {}

  public getOfferProperties(): Observable<PropertyCompleteMap> {
    return this.dataCacheService.getPropertyMap();
  }

  public getFilterTags(): Observable<PropertyCompleteMap> {
    return this.dataCacheService.getPropertyMap();
  }
}
