import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KIToolsTypes } from '../../interfaces/types';

@Component({
  selector: 'app-mnist-modal',
  template: `<div class="modal-header">
      <h4 class="modal-title">Handschrifterkennung mit dem MNIST-Datensatz</h4>
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
        <fs-mnist-example
          [scriptLoadingStatus]="loadingStatus"
          [modus]="'modal'"
        ></fs-mnist-example>
      </div>
      <hr />
      <div class="container mb-2 mt-3">
        <app-mnist-link-footer></app-mnist-link-footer>
      </div>
    </div> `,
})
export class NgbdMnistModalComponent implements OnInit {
  loadingStatus: KIToolsTypes.ScriptLoadingStatus;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    // Im modalen Fenster sollte alles geladen sein.
    this.loadingStatus = {
      isLoaded: true,
      isError: false,
    };
  }
}
