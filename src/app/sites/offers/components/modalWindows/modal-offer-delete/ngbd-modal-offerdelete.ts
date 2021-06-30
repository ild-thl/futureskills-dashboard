import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-offer-delete',
  templateUrl: './ngbd-modal-offerdelete.html',
  styleUrls: ['./ngbd-modal-offerdelete.scss'],
})
export class NgbdModalOfferDelete {
  @Input() title;

  constructor(public activeModal: NgbActiveModal) {}
}
