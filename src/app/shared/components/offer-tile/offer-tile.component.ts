import { Component, OnInit, Input } from '@angular/core';
import { OfferUserData, Offer } from 'src/app/shared/models/offer';

@Component({
  selector: 'app-offer-tile',
  templateUrl: './offer-tile.component.html',
  styleUrls: ['./offer-tile.component.scss']
})
export class OfferTileComponent implements OnInit {
  @Input() offerForTile: Offer;
  @Input() isSubscribed: boolean;
  @Input() displayMode: string;

  constructor() {}

  selected = 0;
  hovered = 0;
  readonly = true;
  max = 5;
  subscribed = false;

  ngOnInit() {}
}
