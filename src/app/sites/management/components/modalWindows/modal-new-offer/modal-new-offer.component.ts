import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-new-offer',
  templateUrl: './modal-new-offer.component.html',
  styleUrls: ['./modal-new-offer.component.scss'],
})
export class NgbdModalAskAfterCreationComponent {
  @Input() title: string;
  constructor(public activeModal: NgbActiveModal) {}
}
