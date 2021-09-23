import { Component, Input, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { SmallOfferDetailData } from 'src/app/core/models/offer';

@Component({
  selector: 'fs-small-kioffer-tile',
  templateUrl: './small-kioffer-tile.component.html',
  styleUrls: ['./small-kioffer-tile.component.scss']
})
export class SmallKIOfferTileComponent implements OnInit {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  @Input() offerForTile: SmallOfferDetailData;
  constructor(private staticConfig: StaticService) {}

  ngOnInit(): void {}

}
