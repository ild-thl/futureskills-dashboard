import { Component, Input } from '@angular/core';
import { Offer } from 'src/app/core/models/offer';

@Component({
  selector: 'fs-offer-text',
  templateUrl: './offer-text.component.html',
  styleUrls: ['./offer-text.component.scss']
})
export class OfferTextComponent {
  @Input() offer: Offer;
}
