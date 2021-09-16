import { Component, Input, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { Offer } from 'src/app/core/models/offer';

@Component({
  selector: 'fs-small-offer-tile',
  templateUrl: './small-offer-tile.component.html',
  styleUrls: ['./small-offer-tile.component.scss']
})
export class SmallOfferTileComponent implements OnInit {

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  @Input() offerForTile: Offer;
  constructor(private staticConfig: StaticService) {}

  ngOnInit(): void {
  }

}
