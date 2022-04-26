import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Offer, OfferMeta } from 'src/app/core/models/offer';
import { NgbdModalAskOfferDeleteComponent } from '../../../components/modalWindows/modal-offer-delete/ngbd-modal-offerdelete';
import { StaticService } from 'src/app/config/static.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MetaDataService } from 'src/app/core/data/meta/meta-data.service';
import { OfferPropertyList, PropertyItem } from 'src/app/core/models/offer-properties';
import { KeyWordItem } from '../components/multiselect/multiselect.component';
import { ErrorHandlerService } from 'src/app/core/services/error-handling/error-handling';
import {
  TOASTCOLOR,
  MessageService,
  AlertList,
} from 'src/app/core/services/messages-toasts/message.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss'],
})
export class EditOfferComponent implements OnInit, OnDestroy {
  private paramSub: Subscription | undefined;

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  lnkManageOfferList = this.staticConfig.getPathInfo().lnkManageOfferList;

  // Offer
  public offer: Offer = new Offer(null);
  private onOfferChange: Subscription;

  // PropertyMetaData
  propertiesLoaded = false;
  // PropertyItem (id, identifier, description)
  propInstitutions: PropertyItem[];
  propLanguages: PropertyItem[];
  propCompetences: PropertyItem[];
  propFormats: PropertyItem[];
  // KeyWords {key, item}
  availableKeyWordList: KeyWordItem[];

  isLoading = true;
  isSaving = false;

  public createNewOffer = false;
  public isCollapsed = true;
  public isError = false;
  errMessage: string = '';
  alertList: AlertList = new AlertList();

  offerEditForm: FormGroup;

  get relatedOfferFormArray() {
    return this.offerEditForm.get('relatedOffers') as FormArray;
  }

  constructor(
    private offerDataService: OfferDataService,
    private metaDataService: MetaDataService,
    private route: ActivatedRoute,
    private staticConfig: StaticService,
    private errorHandler: ErrorHandlerService,
    private modalService: NgbModal,
    private messageService: MessageService,
    private router: Router
  ) {}

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    toolbarPosition: 'top',
    width: '100%',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'heading',
        'fontName',
        'cut',
        'copy',
        'delete',
        'removeFormat',
        'backgroundColorPicker',
      ],
    ],
  };

  ngOnInit() {
    this.isLoading = false;
    this.isError = false;
    this.errMessage = '';

    this.initializeFormData();

    //TODO Warten bis die da sind.
    this.loadPropertyMetaData();

    this.paramSub = this.route.paramMap.subscribe((params) => {
      const strParam = params.get('id');
      if (strParam && strParam.length > 0) {
        const offerId: number = +strParam;

        if (Number.isNaN(offerId)) {
          this.setError();
          this.isLoading = false;
        } else {
          this.resetError();
          this.isLoading = true;
          this.loadPropertyMetaData();
          this.loadOfferData(offerId);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.onOfferChange) this.onOfferChange.unsubscribe();
    if (this.paramSub) this.paramSub.unsubscribe();
  }

  updateRelatedOffers(event: any) {
    this.relatedOfferFormArray.reset(event);
  }

  /**
   * SubmitEvent
   * @param offerdata
   */
  onSaveData(offerdata: any) {
    this.saveOfferData(offerdata);
  }

  //////////////////////////////////////////////
  // FORM DATA
  //////////////////////////////////////////////
  private initializeFormData() {
    this.offerEditForm = new FormGroup({
      id: new FormControl(null),
      title: new FormControl(null, Validators.required),
      image_path: new FormControl(null),
      type: new FormControl(null, Validators.required),
      description: new FormControl(null),
      institution_id: new FormControl(null, Validators.required),
      subtitle: new FormControl(null),
      language: new FormControl(null, Validators.required),
      hashtag: new FormControl(null),
      //ects: new FormControl({ value: 0, disabled: true }),
      time_requirement: new FormControl(null),
      executed_from: new FormControl({ value: 0, disabled: true }),
      executed_until: new FormControl({ value: 0, disabled: true }),
      listed_from: new FormControl({ value: 0, disabled: true }),
      listed_until: new FormControl({ value: 0, disabled: true }),
      author: new FormControl(null),
      sponsor: new FormControl(null),
      exam: new FormControl(null),
      requirements: new FormControl(null),
      niveau: new FormControl(null),
      target_group: new FormControl(null),
      url: new FormControl(null),
      sort_flag: new FormControl(null),
      competence_tech: new FormControl(null),
      competence_classic: new FormControl(null),
      competence_digital: new FormControl(null),
      keywords: new FormControl(undefined),
      relatedOffers: new FormArray([new FormControl(), new FormControl(), new FormControl()]),
    });
  }

  private loadOfferData(offerId: number) {
    this.onOfferChange = this.offerDataService.getOfferDataForEdit(offerId).subscribe({
      next: (offer) => {
        this.offer = offer;
        this.offerEditForm.get('id').setValue(this.offer.id);
        this.offerEditForm.get('title').setValue(this.offer.title);
        this.offerEditForm.get('image_path').setValue(this.offer.image_path);
        this.offerEditForm.get('type').setValue(this.offer.type);
        this.offerEditForm.get('description').setValue(this.offer.description);
        this.offerEditForm.get('institution_id').setValue(this.offer.institution.id);
        this.offerEditForm.get('subtitle').setValue(this.offer.subtitle);
        this.offerEditForm.get('language').setValue(this.offer.language);
        this.offerEditForm.get('hashtag').setValue(this.offer.hashtag);
        //this.offerEditForm.get('ects').setValue(this.offer.meta.ects);
        this.offerEditForm.get('time_requirement').setValue(this.offer.meta.time_requirement);
        this.offerEditForm.get('executed_from').setValue(this.offer.timestamps.executed_from);
        this.offerEditForm.get('executed_until').setValue(this.offer.timestamps.executed_until);
        this.offerEditForm.get('listed_from').setValue(this.offer.timestamps.listed_from);
        this.offerEditForm.get('listed_until').setValue(this.offer.timestamps.listed_until);
        this.offerEditForm.get('author').setValue(this.offer.author);
        this.offerEditForm.get('sponsor').setValue(this.offer.meta.sponsor);
        this.offerEditForm.get('exam').setValue(this.offer.meta.exam);
        this.offerEditForm.get('requirements').setValue(this.offer.meta.requirements);
        this.offerEditForm.get('niveau').setValue(this.offer.meta.niveau);
        this.offerEditForm.get('exam').setValue(this.offer.meta.exam);
        this.offerEditForm.get('target_group').setValue(this.offer.target_group);
        this.offerEditForm.get('url').setValue(this.offer.url);
        this.offerEditForm.get('sort_flag').setValue(this.offer.sort_flag);
        this.offerEditForm.get('competence_tech').setValue(this.offer.competence_tech);
        this.offerEditForm.get('competence_classic').setValue(this.offer.competence_classic);
        this.offerEditForm.get('competence_digital').setValue(this.offer.competence_digital);
        this.offerEditForm.get('keywords').setValue(this.offer.keywords);
        this.relatedOfferFormArray.reset(this.offer.relatedOffers);

        this.isLoading = false;
        this.errMessage = '';
        this.isError = false;

        //console.log("OFFER FROM API", this.offer);
      },
      error: (error: Error) => {
        this.isError = true;
        this.errMessage = this.errorHandler.ERROR_MESSAGES.E404_OFFER_NOT_FOUND;
        this.isLoading = false;
      },
    });
  }

  /**
   * Saves OfferData
   * Abspeichern der Offer-Daten
   * Abspeichern der zugeordneten Kurse aus this.relatedOfferFormArray.value
   * @param offerdata
   */
  private saveOfferData(offerdata: any) {
    this.isLoading = true;
    this.isSaving = true;
    this.alertList.closeaAllAlerts();

    const id = this.createNewOffer ? null : this.offer.id;
    const relatedIntOffers: number[] = this.mapRelatedOfferListToNumberList(
      this.relatedOfferFormArray.value
    );
    offerdata.meta = this.mapMetaData(this.offerEditForm.value);

    //console.log("OFFERDATA", offerdata);

    this.offerDataService.saveOfferDataForEdit(id, offerdata, relatedIntOffers).subscribe(
      (offer: Offer) => {
        this.offer = offer;
        this.isLoading = false;
        this.isSaving = false;
        this.alertList.addAlert('success', 'Speichern war erfolgreich');
        this.messageService.showToast(
          { header: 'Kurs speichern', body: 'Speichern war erfolgreich' },
          TOASTCOLOR.SUCCESS
        );
      },
      (error: Error) => {
        this.alertList.addAlert('danger', this.errorHandler.getErrorMessage(error, 'offer'));
        this.messageService.showToast(
          { header: 'Kurs speichern', body: this.errorHandler.getErrorMessage(error, 'offer') },
          TOASTCOLOR.SUCCESS
        );
        this.isLoading = false;
        this.isSaving = false;
      }
    );
  }

  showModalWindowDeleteOffer(event: Event) {
    const title = this.offer.title;
    const id = this.offer.id;
    const modalRef = this.modalService.open(NgbdModalAskOfferDeleteComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = event !== undefined ? title : '';
    modalRef.result.then(
      (result) => {
        this.deleteOffer(id);
      },
      (reason) => {}
    );
  }

  private deleteOffer(offerID: number) {
    if (offerID && offerID > 0) {
      this.offerDataService.deleteOfferWithID(offerID).subscribe({
        next: (value) => {
          this.messageService.showToast(
            { header: 'Kurs löschen', body: 'Der Kurs wurde gelöscht.' },
            TOASTCOLOR.SUCCESS
          );
          this.router.navigate([this.lnkManageOfferList]);
        },
        error: (error: Error) => {
          const message = this.errorHandler.getErrorMessage(error, 'offer');
          this.messageService.showToast(
            { header: 'Kurs löschen', body: message },
            TOASTCOLOR.DANGER
          );
        },
      });
    }
  }

  goToDetailPage() {
    this.router.navigate([this.lnkOffers, this.offer.id]);
  }

  /**
   * Convert stringArray to intArray
   * deletes entries with 0 values
   * @param strList
   */
  private mapRelatedOfferListToNumberList(strList: string[]): number[] {
    if (strList == null || strList.length == 0) return [];
    return strList.map((item) => +item).filter((offer) => offer !== 0);
  }

  private mapMetaData(formData: any) {
    let tmpMetas = new OfferMeta();
    tmpMetas.ects = formData.ects;
    tmpMetas.exam = formData.exam;
    tmpMetas.niveau = formData.niveau;
    tmpMetas.requirements = formData.requirements;
    tmpMetas.sponsor = formData.sponsor;
    tmpMetas.time_requirement = formData.time_requirement;
    return tmpMetas;
  }

  //////////////////////////////////////////////
  // Properties
  //////////////////////////////////////////////

  private loadPropertyMetaData() {
    this.metaDataService.getOfferProperties().subscribe({
      next: (filterMap: Map<string, OfferPropertyList>) => {
        this.setPropertyOutput(filterMap);
        this.propertiesLoaded = true;
      },
      error: (error: Error) => {
        this.propCompetences = [];
        this.propInstitutions = [];
        this.propFormats = [];
        this.propLanguages = [];
        this.propertiesLoaded = false;
      },
    });
  }

  private setPropertyOutput(propertyMap: Map<string, OfferPropertyList>) {
    this.propCompetences = propertyMap.get('competences').list.map((item) => {
      // Spezialfall Kompetenzen: Den identifier statt der description nehmen und groß schreiben
      const newItem = this.cloneItem(item);
      newItem.description = this.capitalizeFirstLetter(newItem.identifier);
      return newItem;
    });
    this.propInstitutions = propertyMap.get('institutions').list.map((item) => {
      return this.cloneItem(item);
    });
    this.propFormats = propertyMap.get('formats').list.map((item) => {
      return this.cloneItem(item);
    });
    this.propLanguages = propertyMap.get('languages').list.map((item) => {
      return this.cloneItem(item);
    });

    //console.log('Institutions: ', this.propInstitutions);
    //console.log('Competences: ', this.propCompetences);
    //console.log('Formats: ', this.propFormats);
    //console.log('Languages: ', this.propLanguages);
  }

  private capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private cloneItem(item: PropertyItem) {
    return {
      id: item.id,
      identifier: item.identifier,
      description: item.description,
    };
  }

  private setError() {
    this.isError = true;
    this.errMessage = this.errorHandler.ERROR_MESSAGES.E404_OFFER_NOT_FOUND;
  }

  private resetError() {
    this.isError = false;
    this.errMessage = '';
  }
}
