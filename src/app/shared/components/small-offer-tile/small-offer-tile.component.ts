import { Component, Input } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { SmallOfferDetailData } from 'src/app/core/models/offer';

@Component({
  selector: 'fs-small-offer-tile',
  templateUrl: './small-offer-tile.component.html',
  styleUrls: ['./small-offer-tile.component.scss'],
})
export class SmallOfferTileComponent {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  @Input() offerForTile: SmallOfferDetailData;
  constructor(private staticConfig: StaticService) {}
}
