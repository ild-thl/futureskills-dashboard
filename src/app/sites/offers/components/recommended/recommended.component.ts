import { Component, Input } from '@angular/core';
import { Offer } from 'src/app/core/models/offer';

@Component({
  selector: 'fs-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss']
})
export class RecommendedComponent {
  @Input() offer: Offer;
}
