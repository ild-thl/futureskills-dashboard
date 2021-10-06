import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { OfferPropertyCache } from 'src/app/core/http/api/offer-property-cache.service';

@Injectable({
  providedIn: 'root',
})
export class MetaDataService {
  constructor(private offerPropertyCache: OfferPropertyCache) {}

  public getOfferProperties(): Observable<Map<string, OfferPropertyList>> {
    return this.offerPropertyCache.loadOfferProperties();
  }

  public getFilterTags(): Observable<Map<string, OfferPropertyList>> {
    return this.offerPropertyCache.loadOfferProperties();
  }
}
