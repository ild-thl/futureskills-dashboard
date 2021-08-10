import { KIToolsHelper } from './../../services/helper/helper';
import { Component, Input, OnInit } from '@angular/core';
import { KIToolsTypes } from '../../interfaces/types';

@Component({
  selector: 'fs-ki-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
})
export class ExamplesComponent implements OnInit {
  @Input() public modus = 'window';

  constructor() {}
  textArr: KIToolsTypes.LinkCardData[] = [];

  ngOnInit(): void {
    this.initText();
    //KIToolsHelper.shuffleArray(this.textArr);
  }

  initText() {
    // Das könnte man vielleicht zukünftig aus der DB laden, wenn man die Links bearbeiten möchte
    this.textArr = [
      {
        title: 'DeepL',
        text: 'Textübersetzung',
        url: 'https://www.deepl.com/de/translator',
        urlText: 'deepl.com/de/translator',
        type: KIToolsTypes.LinkCardType.text,
      },
      {
        title: 'Inferkit',
        text: 'Textgenerierung (gpt-2)',
        url: 'https://app.inferkit.com/demo',
        urlText: 'app.inferkit.com/demo',
        type: KIToolsTypes.LinkCardType.text,
      },
      {
        title: 'Quillbot',
        subtitle: 'Paraphrasierungstool',
        text: 'Quillbot formuliert Textabsätze neu, prüft die Grammatik und schreibt Zusammenfassungen.',
        url: 'https://quillbot.com',
        urlText: 'quillbot.com',
        type: KIToolsTypes.LinkCardType.text,
      },
      {
        title: 'DeepAI',
        text: 'Beschreibung',
        url: 'https://deepai.org',
        urlText: 'deepai.org',
        type: KIToolsTypes.LinkCardType.project,
      },
      {
        title: 'Replika',
        text: 'Replika',
        url: 'https://replika.ai',
        urlText: 'replika.ai',
        type: KIToolsTypes.LinkCardType.default,
      },
      {
        title: 'Quizlet',
        text: 'Beschreibung',
        url: 'https://quizlet.com/de',
        urlText: 'quizlet.com/de',
        type: KIToolsTypes.LinkCardType.default,
      },
      {
        title: 'AI Dungeon',
        text: 'Beschreibung',
        url: 'https://play.aidungeon.io/',
        urlText: 'play.aidungeon.io',
        type: KIToolsTypes.LinkCardType.default,
      },
      {
        title: 'OpenAI',
        text: 'Beschreibung',
        url: 'https://www.openai.com',
        urlText: 'openai.com',
        type: KIToolsTypes.LinkCardType.project,
      },
    ];
  }


}
