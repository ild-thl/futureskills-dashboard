import { forkJoin } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { KIToolsTypes } from '../../interfaces/types';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { AlertList } from '../../services/helper/helper';

declare var tf: any;

@Component({
  selector: 'fs-sentiment-example',
  templateUrl: './sentiment-example.component.html',
  styleUrls: ['./sentiment-example.component.scss'],
})
export class SentimentExampleComponent implements OnInit {
  @Input() scriptLoadingStatus: KIToolsTypes.ScriptLoadingStatus;
  @Input() public modus = 'window';

  textAreaText: string;
  WordToIndex: any[] = [];
  sentimentText: string;
  sentimentNumber: string;
  emojiIndex: number;
  sentimentArray = ['negativ', 'eher negativ', 'neutral', 'eher positiv', 'positiv'];
  private model: any;
  private PAD_MAX_LENGTH = 400;

  modelLoaded = false;
  alertList: AlertList = new AlertList();
  constructor(private kiService: KiStatusService, private staticService: StaticService) {}

  ngOnInit(): void {
    this.textAreaText = '';
    this.sentimentText = '';
    this.sentimentNumber = '';
    this.emojiIndex = undefined;
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

  deleteBox() {
    this.textAreaText = '';
  }

  onSelectChange(value: string) {
    this.textAreaText = value;
  }

  checkSentiment() {
    if (this.textAreaText.length < 5) return;
    if (this.modelLoaded) {
      const value = this.getSentimentValue(this.textAreaText);
      console.log('Value:', value);
      this.emojiIndex = Math.round(value * 4);
      this.sentimentText = this.sentimentArray[this.emojiIndex];
      this.sentimentNumber = value.toFixed(4);
    }
  }

  getSentimentValue(text: string) {
    console.log("Text: ", text);

    let edited = text.toLowerCase();
    // ohne Sonderzeichen
    edited = edited.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    edited = edited.trim();
    console.log("Bearbeitet: ", edited)


    const sentenceIds = this.sentenceToIds(edited);
    console.log("SentenceIds: ", sentenceIds);
    const paddedSentence = this.padLeft(sentenceIds, this.PAD_MAX_LENGTH);
    const tensor = tf.tensor([paddedSentence]);
    return this.model.predict(tensor).dataSync()[0];
  }

  sentenceToIds(text: string) {
    let messageIds = [];
    text.split(' ').forEach((word) => {
      messageIds.push(this.WordToIndex[word] + 3);
    });
    messageIds  = messageIds.filter(value => {
      return (!Number.isNaN(value))
    })
    return messageIds;
  }

  padLeft(sentenceIds, sentenceLength) {
    const paddedSentence = [];
    const maxLength = sentenceLength - sentenceIds.length;
    return paddedSentence.concat(new Array(maxLength).fill(0), sentenceIds);
  }

  private loadingModel() {
    forkJoin({
      model: this.kiService.loadSentimentModel(),
      index: this.kiService.loadWordIndex(),
    }).subscribe((values) => {
      this.model = values.model;
      this.WordToIndex = values.index;
      this.modelLoaded = true;
      //console.log(values);
      //console.log(this.model.summary());
    });
  }
}
