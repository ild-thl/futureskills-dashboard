import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Offer, OfferMeta } from 'src/app/core/models/offer';
import { StaticService } from 'src/app/config/static.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MetaDataService } from 'src/app/core/data/meta/meta-data.service';
import { OfferPropertyList, PropertyItem } from 'src/app/core/models/offer-properties';
import { KeyWordItem } from '../components/multiselect/multiselect.component';
import { ErrorHandlerService } from 'src/app/core/services/error-handling/error-handling';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss'],
})
export class EditOfferComponent implements OnInit, OnDestroy {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

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

  public isLoading = true;
  public createNewOffer = false;
  public isCollapsed = true;
  public isError = false;
  errMessage: string = '';
  alerts: Alert[] = [];

  offerEditForm: FormGroup;

  get relatedOfferFormArray() {
    return this.offerEditForm.get('relatedOffers') as FormArray;
  }

  constructor(
    private offerDataService: OfferDataService,
    private metaDataService: MetaDataService,
    private route: ActivatedRoute,
    private staticConfig: StaticService,
    private errorHandler: ErrorHandlerService
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
    const offerId = +this.route.snapshot.params.id;

    this.loadPropertyMetaData();

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

    if (offerId) {
      this.createNewOffer = false;
      this.loadOfferData(offerId);
    } else {
      this.createNewOffer = true;
    }
  }

  ngOnDestroy(): void {
    if (this.onOfferChange) this.onOfferChange.unsubscribe();
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

  //////////// DATA ////////////////

  /**
   * Loads Offer Data and fills form fields
   * @param offerId
   */
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
    this.closeaAllAlerts();

    const id = this.createNewOffer ? null : this.offer.id;
    const relatedIntOffers: number[] = this.mapRelatedOfferListToNumberList(
      this.relatedOfferFormArray.value
    );
    offerdata.meta = this.mapMetaData(this.offerEditForm.value);

    this.offerDataService.saveOfferDataForEdit(id, offerdata, relatedIntOffers).subscribe(
      (offer: Offer) => {
        this.offer = offer;
        this.isLoading = false;
        this.addAlert('success', 'Speichern war erfolgreich');
      },
      (error: Error) => {
        this.addAlert('danger', this.errorHandler.getErrorMessage(error, 'offer'));
        this.isLoading = false;
      }
    );
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

  // Alert Functions

  addAlert(type: string, message: string) {
    this.alerts.push({ type, message });
  }
  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
  closeaAllAlerts() {
    this.alerts = [];
  }


}
