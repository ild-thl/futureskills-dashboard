import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mnist-modal',
  templateUrl: './mnist-modal.component.html'
})
export class NgbdMnistModalComponent{

  constructor(public activeModal: NgbActiveModal) {

  }
}
