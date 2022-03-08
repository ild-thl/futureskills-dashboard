import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-lms-content',
  templateUrl: './ngbd-modal-lmscontent.html',
  styleUrls: ['./ngbd-modal-lmscontent.scss'],
})
export class NgbdModalLmsContentComponent {
  @Input() title: string;

  constructor(public activeModal: NgbActiveModal) {}
}
