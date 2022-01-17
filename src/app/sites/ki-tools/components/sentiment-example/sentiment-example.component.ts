import { forkJoin, Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { KIToolsTypes } from '../../interfaces/types';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { AlertList } from '../../services/helper/helper';

import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'fs-sentiment-example',
  templateUrl: './sentiment-example.component.html',
  styleUrls: ['./sentiment-example.component.scss'],
})
export class SentimentExampleComponent implements OnInit, OnChanges {
  @Input() scriptLoadingStatus: KIToolsTypes.ScriptLoadingStatus;
  @Input() public modus = 'window';
  @Output() modalClose = new EventEmitter<any>();

  textAreaText: string;
  WordToIndex: any[] = [];
  sentimentText: string;
  sentimentNumber: string;
  emojiIndex: number;
  isCalculating: boolean;
  nrSelect: any;
  sentimentArray = [
    'negativ',
    'eher negativ',
    'neutral',
    'eher positiv',
    'positiv',
    'nicht bewertbar',
  ];
  lnkCoursePath1 =
    this.staticService.getPathInfo().lnkOffers +
    this.staticService.getCourseNumbers().futureskillsKI;

  // Modellvariablen
  private model: any;
  private MAX_REVIEW_LENGTH = 400;
  private NUM_WORDS = 10000;
  private UNKNOWN_CHAR = 2;

  modelLoaded: boolean = false;
  modelLoadError: boolean = false;
  alertList: AlertList = new AlertList();
  constructor(private kiService: KiStatusService, private staticService: StaticService) {}

  ngOnInit(): void {
    this.textAreaText = '';
    this.emojiIndex = undefined;
    this.isCalculating = false;
    this.refreshText();
    // console.log(String.fromCodePoint(0x1f641));
  }

  ngOnChanges() {
    if (this.scriptLoadingStatus.isLoaded && !this.modelLoaded) {
      this.loadingModel();
    }

    if (this.scriptLoadingStatus.isError) {
      this.alertList.addAlert(
        'danger',
        'Die benötigten Daten konnten leider nicht geladen werden.'
      );
    }
  }

  onCloseModalWindow() {
    this.modalClose.emit();
  }

  deleteBox() {
    this.textAreaText = '';
    this.refreshText();
  }
  refreshText() {
    this.sentimentText = 'Noch kein Text zur Auswertung.';
    this.sentimentNumber = '';
    this.nrSelect = '';
  }

  onSelectChange(value: string) {
    this.textAreaText = value;
  }

  startPrediction() {
    if (this.textAreaText.length < 5) return;

    if (this.modelLoaded) {
      this.isCalculating = true;

      this.calculatePrediction().subscribe({
        next: (value) => {
          this.isCalculating = false;
          console.log('value: ' + value);
          this.showResults(value);
        },
        error: (error) => {
          this.isCalculating = false;
          console.log('Error:' + error);
        },
      });
    }
  }

  calculatePrediction(): Observable<any> {
    return new Observable((subscriber) => {
      const editedText = this.editText(this.textAreaText);
      console.log('Text bearbeitet: ', editedText);
      const wordToIndex = this.wordsToIndex(editedText);
      const value = this.getSentimentValue(wordToIndex);

      subscriber.next(value);
      subscriber.complete();
    });
  }

  showResults(value: number) {
    // Anzeigen der Ergebnisse
    this.emojiIndex = this.getEmojiIndex(value);
    this.sentimentText =
      'Der Text wird als ' + this.sentimentArray[this.emojiIndex] + ' eingestuft.';
    this.sentimentNumber = 'Wert: ' + value.toFixed(4);
  }

  editText(text: string): string {
    // Der Text wird in die Trainingszahlen umgewandelt
    // Kleinbuchstaben
    let edited = text.toLowerCase();
    // Leerzeichen
    edited = edited.trim();
    // ohne Sonderzeichen
    edited = edited.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    return edited;
  }

  wordsToIndex(edited: string): number[] {
    // In IDs umwandeln (ohne die Unbekannten)
    let wordIds = [];
    const words = edited.split(' ');
    for (var word of words) {
      let foundWordIndex = this.WordToIndex[word] + 3;

      if (foundWordIndex > this.NUM_WORDS || Number.isNaN(foundWordIndex)) {
        foundWordIndex = this.UNKNOWN_CHAR;
      }
      wordIds.push(foundWordIndex);
    }
    console.log('WordIndex: ', wordIds);
    const paddedSentence = this.padLeft(wordIds, this.MAX_REVIEW_LENGTH);
    return paddedSentence;
  }

  padLeft(sentenceIds: number[], sentenceLength: number) {
    const paddedSentence = [];
    const maxLength = sentenceLength - sentenceIds.length;
    return paddedSentence.concat(new Array(maxLength).fill(0), sentenceIds);
  }

  getSentimentValue(paddedSentence: number[]) {
    const tensor = tf.tensor([paddedSentence]);
    return this.model.predict(tensor).dataSync()[0];
  }

  getEmojiIndex(value: number): number {
    //return Math.round(value * 4);
    let index = 5;
    switch (true) {
      case value >= 0 && value < 0.2:
        index = 0;
        break;
      case value >= 0.2 && value <= 0.4:
        index = 1;
        break;
      case value > 0.4 && value < 0.6:
        index = 2;
        break;
      case value >= 0.6 && value < 0.8:
        index = 3;
        break;
      case value >= 0.8 && value <= 1:
        index = 4;
        break;
      default:
        index = 5;
        break;
    }
    return index;
  }

  private loadingModel() {
    forkJoin({
      model: this.kiService.loadSentimentModel(),
      index: this.kiService.loadWordIndex(),
    }).subscribe({
      next: (values) => {
        this.model = values.model;
        this.WordToIndex = values.index;
        this.modelLoaded = true;
        this.modelLoadError = false;
      },
      error: (error) => {
        this.modelLoadError = true;
        console.log('Modell kann nicht geladen werden.');
        this.alertList.addAlert(
          'danger',
          'Die benötigten Daten können leider nicht geladen werden.'
        );
      },
    });
  }
}
