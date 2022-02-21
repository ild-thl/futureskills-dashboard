import { Component, Input } from '@angular/core';

@Component({
  selector: 'fs-card-button-external-link',
  templateUrl: './card-button-external-link.component.html',
  styleUrls: ['./card-button-external-link.component.scss']
})
export class CardButtonExternalLinkComponent {

  @Input() hrefString: string;


}
