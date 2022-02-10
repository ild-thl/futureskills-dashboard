import { Component, Input } from '@angular/core';
import { Offer } from 'src/app/core/models/offer';
import { Objects, Permissions } from 'src/app/core/models/permissions';


@Component({
  selector: 'fs-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent {
  @Input() offer: Offer;
  @Input() object = Objects;
  @Input() permission = Permissions;

}
