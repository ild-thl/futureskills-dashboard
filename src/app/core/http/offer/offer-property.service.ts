import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { CachedDataService } from 'src/app/core/http/api/cache-data.service';
@Injectable({
  providedIn: 'root',
})
export class OfferPropertyService {
  constructor(private cachedDataService: CachedDataService) {}
  public getOfferProperties(): Observable<OfferPropertyList[]> {
    return this.cachedDataService.loadOfferProperties();
  }
}
