import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Offer } from 'src/app/core/models/offer';
import { StaticService } from 'src/app/config/static.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MetaDataService } from 'src/app/core/data/meta/meta-data.service';
import { OfferPropertyList, PropertyItem } from 'src/app/core/models/offer-properties';
import { KeyWordItem } from '../components/multiselect/multiselect.component';
import { ErrorHandlerService } from 'src/app/core/services/error-handling/error-handling';
import { TOASTCOLOR, MessageService } from 'src/app/core/services/messages-toasts/message.service';
import { OfferToAPICreate } from 'src/app/core/http/api/api.interfaces';
import { NgbdModalAskAfterCreationComponent } from '../../../components/modalWindows/modal-new-offer/modal-new-offer.component';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss'],
})
export class CreateOfferComponent implements OnInit, OnDestroy {
  private paramSub: Subscription | undefined;
  private onOfferSave: Subscription | undefined;

  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  lnkManageOfferList = this.staticConfig.getPathInfo().lnkManageOfferList;
  lnkManageOfferEdit = this.staticConfig.getPathInfo().lnkManageOfferEdit;

  // Offer
  offer: Offer = new Offer(null);

  // Imgae
  imagePath: string = this.staticConfig.getAssetPaths().images.default;

  // PropertyItem (id, identifier, description)
  propInstitutions: PropertyItem[];
  propLanguages: PropertyItem[];
  propCompetences: PropertyItem[];
  propFormats: PropertyItem[];
  // KeyWords {key, item}
  availableKeyWordList: KeyWordItem[];

  isSaving: boolean;
  isError: boolean;
  propertiesLoaded: boolean;
  errMessage: string = '';

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
  ) {
    this.propertiesLoaded = false;
    this.isError = false;
    this.isSaving = false;
    this.errMessage = '';
  }

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
    this.resetStatusVars();
    this.loadPropertyMetaData();
    this.initFormData();
  }

  ngOnDestroy(): void {
    if (this.onOfferSave) this.onOfferSave.unsubscribe();
    if (this.paramSub) this.paramSub.unsubscribe();
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
      competence_classic: [false],
      competence_digital: [false],
      competence_tech: [false],
      author: [null],
    });
  }

  onSaveOffer(offer: any) {
    //console.log('FORMDATA', offer);

    const classic = !!offer.competence_classic == true ? 1 : 0;
    const digital = !!offer.competence_digital == true ? 1 : 0;
    const tech = !!offer.competence_tech == true ? 1 : 0;

    this.isSaving = true;
    const offerdata: OfferToAPICreate = {
      title: offer.title,
      institution_id: offer.institution_id,
      offertype_id: offer.offertype_id,
      language_id: offer.language_id,
      url: offer.url,
      image_path: offer.image_path,
      description: offer.description,
      competence_classic: classic,
      competence_digital: digital,
      competence_tech: tech,
      author: offer.author,
    };

    this.onOfferSave = this.offerDataService.createNewOfferData(offerdata).subscribe({
      next: (data) => {
        this.isSaving = false;

        // Eine ID sollte auf jeden Fall im Datensatz sein
        if (!data.id) {
          this.messageService.showToast(
            { header: 'Kurs speichern', body: 'Es wurde keine Kurs-ID gefunden.' },
            TOASTCOLOR.WARNING
          );
          this.router.navigate([this.lnkManageOfferList]);
        }

        this.showModalWindowAfterSaving(data);
      },
      error: (error: Error) => {
        this.isSaving = false;
        this.messageService.showToast(
          { header: 'Kurs speichern', body: 'Der Kurs konnte nicht gespeichert werden.' },
          TOASTCOLOR.DANGER
        );
      },
    });
  }

  showModalWindowAfterSaving(data: Offer) {
    const modalRef = this.modalService.open(NgbdModalAskAfterCreationComponent, {
      centered: true,
      backdrop: false,
      keyboard: false,
    });
    modalRef.componentInstance.title = 'Speichern erfolgreich';
    modalRef.result.then(
      (result) => {
        console.log('RESULT', result);

        if (result === 'goNew') {
          this.onResetForm();
        } else if (result === 'goEdit') {
          this.router.navigate([this.lnkManageOfferEdit, data.id]);
        }
      },
      (reason) => {
        console.log('REASON', reason);
      }
    );
  }

  onResetForm() {
    this.offerEditForm.reset();
    this.initFormData();
  }

  //////////////////////////////////////////////
  // Properties
  //////////////////////////////////////////////

  private loadPropertyMetaData() {
    this.metaDataService.getOfferProperties().subscribe({
      next: (filterMap: Map<string, OfferPropertyList>) => {
        this.setPropertyOutput(filterMap);
        this.propertiesLoaded = true;
        this.isError = false;
        this.errMessage = '';
      },
      error: (error: Error) => {
        this.propCompetences = [];
        this.propInstitutions = [];
        this.propFormats = [];
        this.propLanguages = [];
        this.propertiesLoaded = false;

        this.isError = true;
        this.errMessage = 'Es konnten keine Servervorgaben geladen werden.';
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

  private resetStatusVars() {
    this.propertiesLoaded = false;
    this.isError = false;
    this.isSaving = false;
    this.errMessage = '';
  }
}
