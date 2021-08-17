import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KIToolsTypes } from '../../interfaces/types';

@Component({
  selector: 'app-sentiment-modal',
  template: `<div class="modal-header">
      <h4 class="modal-title">Sentimentanalyse</h4>
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
        <fs-sentiment-example
          [scriptLoadingStatus]="loadingStatus"
          [modus]="'modal'"
        ></fs-sentiment-example>
      </div>
    </div>`,
})
export class NgbdSentimentModalComponent implements OnInit {
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
