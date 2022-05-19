import { Component, Input } from '@angular/core';
import { OfferShortListForTiles } from 'src/app/core/models/offer';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'fs-offer-tile',
  templateUrl: './offer-tile.component.html',
  styleUrls: ['./offer-tile.component.scss']
})
export class OfferTileComponent {
  @Input() offerForTile: OfferShortListForTiles;
  @Input() isSubscribed: boolean;
  @Input() displayMode: string;

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  constructor(private staticConfig: StaticService) {}

  selected = 0;
  hovered = 0;
  readonly = true;
  max = 5;
  subscribed = false;

}
