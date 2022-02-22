import { Component, Input } from '@angular/core';
import { Offer } from 'src/app/core/models/offer';

@Component({
  selector: 'fs-card-chips',
  templateUrl: './card-chips.component.html',
  styleUrls: ['./card-chips.component.scss']
})
export class CardChipsComponent {
  @Input() offer: Offer;
}
