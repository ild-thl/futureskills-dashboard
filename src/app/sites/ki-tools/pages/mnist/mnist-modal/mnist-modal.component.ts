import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KIToolsTypes } from '../../../interfaces/types';

@Component({
  selector: 'app-mnist-modal',
  templateUrl: './mnist-modal.component.html'
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
