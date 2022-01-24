import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { NgbdMnistModalComponent } from 'src/app/sites/ki-tools/pages/mnist/mnist-modal.component';
import { NgbdSentimentModalComponent } from 'src/app/sites/ki-tools/pages/sentiment/sentiment-modal.component';
import { NgbdDemonstratorsModalComponent } from 'src/app/sites/ki-tools/pages/demonstrators/demonstrators-modal.component';
import { AlertList, KIToolsHelper } from 'src/app/sites/ki-tools/services/helper/helper';
import { SmallOfferDetailData } from 'src/app/core/models/offer';

@Component({
  selector: 'app-ki-playground',
  templateUrl: './ki-playground.component.html',
  styleUrls: ['./ki-playground.component.scss'],
})
export class KIPlaygroundComponent implements OnInit, OnDestroy {
  isLoadingScripts: boolean;
  // Framwork and Libs
  // scriptsAreLoaded: boolean;
  errorWhileScriptLoading: boolean;
  // Models
  mnistModelIsLoading: boolean;
  sentimentModelIsLoading: boolean;
  // Online?
  kitoolsAreOnline: boolean;
  // Paths
  lnkKITools_mnist = this.staticService.getPathInfo().lnkKITools_mnist;
  lnkKITools_sentiment = this.staticService.getPathInfo().lnkKITools_sentiment;
  linkKITools_demonstrators = this.staticService.getPathInfo().linkKITools_demonstrators;
  linkListDate = this.staticService.getKIConfig().linkListDate;
  // Text while loading
  additionalText = '';
  // Alerts
  alertList: AlertList = new AlertList();
  // Errtexts
  errTextFrameWorkLoading =
    'Die benötigten Daten konnten nicht geladen werden. Vielleicht bist du offline oder unsere Server sind nicht erreichbar.';

  kiModuleSub: Subscription;
  kiOffers: SmallOfferDetailData[];
  minKIOffers: number = 3;

  constructor(
    private staticService: StaticService,
    private kiStatusService: KiStatusService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoadingScripts = false;
    this.mnistModelIsLoading = false;
    this.sentimentModelIsLoading = false;
    this.errorWhileScriptLoading = false;

    this.kitoolsAreOnline = this.staticService.getKIConfig().online;

    if (this.kitoolsAreOnline) {
      // Es werden kein Tensorflow mehr nachgeladen
      this.additionalText = '';
      this.isLoadingScripts = false;
      this.getKICourses();
    }
  }

  ngOnDestroy(): void {
    if (this.kiModuleSub) this.kiModuleSub.unsubscribe();
  }

  onLoadMnistExample(modal: boolean = true) {
    this.mnistModelIsLoading = true;
    this.alertList.closeaAllAlerts();

    this.kiStatusService.loadMNISTModel().subscribe({
      next: (model: any) => {
        this.mnistModelIsLoading = false;
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
              //console.log('Cancel ', reason);
            }
          );
        } else {
          this.router.navigate([this.lnkKITools_mnist]);
        }
      },
      error: (error) => {
        this.mnistModelIsLoading = false;

        this.alertList.addAlert(
          'danger',
          'Fehler: Das MNIST-Beispiel konnte nicht geladen werden.'
        );
      },
    });
  }

  onLoadSentimentExample(modal: boolean = true) {
    this.sentimentModelIsLoading = true;
    this.alertList.closeaAllAlerts();

    this.kiStatusService.loadSentimentModel().subscribe({
      next: (model) => {
        this.sentimentModelIsLoading = false;
        if (modal) {
          const modalRef = this.modalService.open(NgbdSentimentModalComponent, {
            scrollable: true,
            backdrop: false,
            keyboard: true, // ESC
            windowClass: 'ki-tools-modal-class',
            size: 'xl',
          });
          modalRef.result.then(
            (result) => {},
            (reason) => {
              //console.log('Cancel ', reason);
            }
          );
        } else {
          this.router.navigate([this.lnkKITools_sentiment]);
        }
      },
      error: (error) => {
        this.sentimentModelIsLoading = false;
        this.alertList.addAlert(
          'danger',
          'Fehler: Die Sentimentanalyse konnte nicht geladen werden.'
        );
      },
    });
  }

  onLoadLinkExamples(modal: boolean = true) {
    this.alertList.closeaAllAlerts();
    if (modal) {
      const modalRef = this.modalService.open(NgbdDemonstratorsModalComponent, {
        scrollable: true,
        backdrop: false,
        keyboard: true, // ESC
        windowClass: 'ki-tools-modal-class',
        size: 'xl',
      });
      modalRef.result.then(
        (result) => {},
        (reason) => {
          //console.log('Cancel ', reason);
        }
      );
    } else {
      this.router.navigate([this.linkKITools_demonstrators]);
    }
  }

  private getKICourses() {
    this.kiModuleSub = this.kiStatusService.getKICourses().subscribe({
      next: (offers: SmallOfferDetailData[]) => {
        this.kiOffers = offers;
      },
      error: (error) => {
        this.kiOffers = [];
      },
    });
  }
}
