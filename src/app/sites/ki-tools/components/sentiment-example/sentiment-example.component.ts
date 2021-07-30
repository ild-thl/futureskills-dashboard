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
  wordIds: any[] = [];
  emojiArray = ['☹️', '🙁', '😐', '🙂', '😀'];
  sentimentArray = ['Negative', 'Rather negative', 'Neutral', 'Positive', 'Very Positive'];
  private model: any;

  modelLoaded = false;
  alertList: AlertList = new AlertList();
  constructor(private kiService: KiStatusService, private staticService: StaticService) {}

  ngOnInit(): void {
    this.textAreaText = 'the movie was aweful';
    console.log(String.fromCodePoint(0x1f641));
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

  checkSentiment() {
    console.log('FormValue: ', this.textAreaText);
    if (this.modelLoaded) {
      const value = this.getSentimentValue(this.textAreaText);
      console.log('Value:', value);
      const emojiIndex = Math.round(value * 4);
      const auswertung = "Sentiment: " + this.sentimentArray[emojiIndex] + " (" +  value  .toFixed(4) + ")";
      console.log(auswertung);
    }
  }

  getSentimentValue(text: string) {
    text = text.toLowerCase();
    text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    const sentenceIds = this.sentenceToIds(text);
    let PAD_MAX_LENGTH = 1000;
    const paddedSentence = this.padLeft(sentenceIds, PAD_MAX_LENGTH);
    const e = tf.tensor([paddedSentence]);
    return this.model.predict(e).dataSync()[0];
  }

  sentenceToIds(text: string) {
    const messageIds = [];
    text.split(' ').forEach((word) => {
      messageIds.push(this.wordIds[word] + 3); // Achtung hier +3 wegen INDEX FROM !!!
    });
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
    }).subscribe(values=>{
      this.model = values.model;
      this.wordIds = values.index;
      this.modelLoaded = true;
      //console.log(values);
      //console.log(this.model.summary());
    });
  }
}
