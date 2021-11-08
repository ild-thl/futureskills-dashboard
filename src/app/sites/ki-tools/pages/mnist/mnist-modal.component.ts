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
          (modalClose)="onModalClose()"
        ></fs-mnist-example>
      </div>
    </div> `,
})
export class NgbdMnistModalComponent implements OnInit {
  loadingStatus: KIToolsTypes.ScriptLoadingStatus;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.loadingStatus = {
      isLoaded: true,
      isError: false,
    };
  }

  onModalClose() {
    this.activeModal.dismiss('lnkClick');
  }
}
