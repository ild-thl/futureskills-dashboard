import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { NgbdMnistModalComponent } from 'src/app/sites/ki-tools/pages/mnist/mnist-modal/mnist-modal.component';

@Component({
  selector: 'app-ki-playground',
  templateUrl: './ki-playground.component.html',
  styleUrls: ['./ki-playground.component.scss'],
})
export class KIPlaygroundComponent implements OnInit {
  isLoadingScripts: boolean;
  isLoadingError: boolean;
  scriptsAreLoaded: boolean;
  modelIsLoading: boolean;
  kitoolsAreOnline: boolean;
  lnkKITools_mnist = this.staticService.getPathInfo().lnkKITools_mnist;
  additionalText = '';

  constructor(
    private renderer: Renderer2,
    private staticService: StaticService,
    private kiStatusService: KiStatusService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoadingScripts = false;
    this.isLoadingError = false;
    this.scriptsAreLoaded = false;
    this.modelIsLoading = false;

    this.kitoolsAreOnline = this.staticService.getKIConfig().online;
    if (this.kitoolsAreOnline) {
      this.loadKIPackages();
    }
  }

  loadKIPackages() {
    this.kiStatusService.loadKIScript(this.renderer).subscribe(
      (value) => {
        this.isLoadingError = false;
        this.scriptsAreLoaded = true;
      },
      (error) => {
        console.log('Error: ', error);
        this.isLoadingError = true;
        this.scriptsAreLoaded = false;
      },
      () => {
        this.additionalText = '';
        this.isLoadingScripts = false;
      }
    );
  }

  onLoadMnistExample(modal: boolean) {
    this.modelIsLoading = true;

    this.kiStatusService.loadMNISTModel().subscribe(model => {
     this.modelIsLoading = false;
      if (modal) {
        const modalRef = this.modalService.open(NgbdMnistModalComponent, {
          scrollable: true,
          backdrop: false,
          keyboard: true, // ESC
          windowClass: 'ki-tools-modal-class',
          size: 'xl',
        });
        modalRef.result.then(
          (result) => {},
          (reason) => {
            // Cancel by button or ModalDismissReasons
            //console.log('Cancel ', reason);
          }
        );
      } else {
        this.router.navigate([this.lnkKITools_mnist]);
      }
    }, (error) => console.log('Error: ', error))
  }
}
