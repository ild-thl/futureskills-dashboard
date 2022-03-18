import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Offer, OfferMeta, SmallOfferDetailData } from 'src/app/core/models/offer';
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
import { DataHelper } from 'src/app/core/services/helper/data-helper';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss'],
})
export class CreateOfferComponent implements OnInit, OnDestroy {
  private paramSub: Subscription | undefined;

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  lnkManageOfferList = this.staticConfig.getPathInfo().lnkManageOfferList;

  // Offer
  public offer: Offer = new Offer(null);
  private onOfferChange: Subscription;

  // Imgae
  imagePath: string = '/assets/images/FutureSkills_default.png';

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
    private router: Router,
    private fb: FormBuilder
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

    //this.initializeFormData();
    this.initFormData();

    //TODO Warten bis die da sind.
    this.loadPropertyMetaData();

    this.setOfferDefaults();
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
      title: new FormControl(),
      image_path: new FormControl(this.imagePath),
      offertype_id: new FormControl(-1, Validators.required),
      language_id: new FormControl(-1, Validators.required),
      institution_id: new FormControl(-1, Validators.required),
      description: new FormControl(null),
      subtitle: new FormControl(null),
      hashtag: new FormControl(null),
      author: new FormControl(null),
      target_group: new FormControl(null),
      sort_flag: new FormControl(null),
      url: new FormControl(null),
      competence_tech: new FormControl(null),
      competence_classic: new FormControl(null),
      competence_digital: new FormControl(null),
      keywords: new FormControl(undefined),
    });
  }

  private initFormData() {
    this.offerEditForm = this.fb.group({
      title: [null, Validators.required],
      institution_id: [null, Validators.required],
      offertype_id: [null, Validators.required],
      language_id: [null, Validators.required],
      url: [null],
      image_path: [this.imagePath],
      description: [null],
    });
  }

  private setOfferDefaults() {}

  onSaveOffer(formValue: any){
    console.log("FORM", formValue);
    this.messageService.showToast(
      { header: 'Kurs speichern', body: 'Speichern kommt noch...' },
      TOASTCOLOR.STANDARD
    );

  }

  onResetForm(){
    this.offerEditForm.reset();
    this.initFormData();
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
