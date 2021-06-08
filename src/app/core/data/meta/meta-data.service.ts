import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { OfferService } from 'src/app/core/http/offer/offer.service';

@Injectable({
  providedIn: 'root',
})
export class MetaDataService {
  constructor(private offerService: OfferService) {}

  public getOfferProperties(): Observable<Map<string, OfferPropertyList>> {
    return this.offerService.getOfferProperties();
  }

  public getFilterTags(): Observable<Map<string, OfferPropertyList>> {
    return this.offerService.getOfferProperties();
  }
}
