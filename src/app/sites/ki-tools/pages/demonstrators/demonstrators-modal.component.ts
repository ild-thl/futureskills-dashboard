import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KIToolsTypes } from '../../interfaces/types';

@Component({
  selector: 'app-demonstrators-modal',
  template: ` <div class="modal-header">
      <h4 class="modal-title">Link-Sammlung</h4>
      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="modal-body">
      <div class="container">
        <fs-demonstrator-example [modus]="'modal'"></fs-demonstrator-example>
      </div>
    </div>`,
})
export class NgbdDemonstratorsModalComponent implements OnInit {
  ngOnInit() {}
  constructor(public activeModal: NgbActiveModal) {}
}
