import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { OfferPropertyList } from 'src/app/core/models/offer-properties';
import { PropertyService } from 'src/app/core/http/properties/property.service';

@Injectable({
  providedIn: 'root',
})
export class MetaDataService {
  constructor(private propertyService: PropertyService) {}

  public getOfferProperties(): Observable<OfferPropertyList[]> {
    return this.propertyService.getOfferProperties();
  }

  public getFilterTags(): Observable<OfferPropertyList[]> {
    return this.propertyService.getOfferProperties();
  }
}
