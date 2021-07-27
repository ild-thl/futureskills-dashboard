import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { NgbdMnistModalComponent } from 'src/app/sites/ki-tools/pages/mnist/mnist-modal/mnist-modal.component';
import { KIToolsTypes } from 'src/app/sites/ki-tools/interfaces/types';
import { KIToolsHelper } from '../../services/helper/helper';

@Component({
  selector: 'app-ki-playground',
  templateUrl: './ki-playground.component.html',
  styleUrls: ['./ki-playground.component.scss'],
})
export class KIPlaygroundComponent implements OnInit {
  isLoadingScripts: boolean;
  // Framwork and Libs
  scriptsAreLoaded: boolean;
  errorWhileScriptLoading: boolean;
  // Models
  mnistModelIsLoading: boolean;
  sentimentModelIsLoading: boolean;
  // Online?
  kitoolsAreOnline: boolean;
  // Paths
  lnkKITools_mnist = this.staticService.getPathInfo().lnkKITools_mnist;
  lnkKITools_sentiment = this.staticService.getPathInfo().lnkKITools_sentiment;
  // Text while loading
  additionalText = '';
  // Preview Flag
  preview = '0';
  // Alerts
  alerts: KIToolsTypes.Alert[] = [];
  // Errtexts
  errTextFrameWorkLoading = "Die benötigten Daten konnten nicht geladen werden. Vielleicht bist du offline oder unsere Server sind nicht erreichbar."


  constructor(
    private renderer: Renderer2,
    private staticService: StaticService,
    private kiStatusService: KiStatusService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoadingScripts = false;
    this.scriptsAreLoaded = false;
    this.mnistModelIsLoading = false;
    this.sentimentModelIsLoading = false;
    this.errorWhileScriptLoading = false;

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.preview = params.get('preview');
    });
    this.kitoolsAreOnline = this.staticService.getKIConfig().online;

    if (this.kitoolsAreOnline && this.preview == '1') {
      this.loadKIPackages();
    }
  }

  loadKIPackages() {
    this.kiStatusService.loadKIScript(this.renderer).subscribe(
      (values) => {
        this.scriptsAreLoaded = KIToolsHelper.checkLoadedScripts(values);
        if (!this.scriptsAreLoaded) {
          this.addAlert(
            'danger',
            this.errTextFrameWorkLoading
          );
        } 
      },
      (error) => {
        // If server is not available
        console.log('Error: ', error);
        this.addAlert(
          'danger',
          this.errTextFrameWorkLoading
        );
        this.errorWhileScriptLoading = true;
        this.scriptsAreLoaded = false;
      },
      () => {
        this.additionalText = '';
        this.isLoadingScripts = false;
      }
    );
  }

  onLoadMnistExample(modal: boolean) {
    this.mnistModelIsLoading = true;

    this.kiStatusService.loadMNISTModel().subscribe(
      (model) => {
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
      },
      (error) => {
        console.log('Error: ', error);
        this.addAlert('danger', 'Fehler: Die Daten konnten nicht geladen werden (Modelldateien).');
      },
      () => {
        this.mnistModelIsLoading = false;
      }
    );
  }

  onLoadSentimentExample(modal: boolean) {
    this.sentimentModelIsLoading = true;

    this.kiStatusService.loadSentimentModel().subscribe(
      (model) => {
        if (modal) {
          // const modalRef = this.modalService.open(NgbdMnistModalComponent, {
          //   scrollable: true,
          //   backdrop: false,
          //   keyboard: true, // ESC
          //   windowClass: 'ki-tools-modal-class',
          //   size: 'xl',
          //});
          // modalRef.result.then(
          //   (result) => {},
          //   (reason) => {
          //     // Cancel by button or ModalDismissReasons
          //     //console.log('Cancel ', reason);
          //   }
          // );
        } else {
          this.router.navigate([this.lnkKITools_sentiment]);
        }
      },
      (error) => {
        console.log('Error: ', error);
        this.addAlert('danger', 'Fehler: Die Daten konnten nicht geladen werden (Modelldateien).');
      },
      () => {
        this.sentimentModelIsLoading = false;
      }
    );
  }

  // Alert Functions
  addAlert(type: string, message: string) {
    this.alerts.push({ type, message });
  }
  closeAlert(alert: KIToolsTypes.Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
  closeaAllAlerts() {
    this.alerts = [];
  }
}
