import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';
import { Injectable, Renderer2 } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { environment } from 'src/environments/environment';
import { AsyncSubject, Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { KIToolsTypes } from '../interfaces/types';

import * as tf from '@tensorflow/tfjs';
import { map } from 'rxjs/operators';
import { DemonstratorExamples } from '../components/demonstrator-example/data/example-data';

@Injectable()
export class KiStatusService {
  private scriptLoading$: AsyncSubject<any>;
  private MNISTModel$: AsyncSubject<any>;
  private SentimentModel$: AsyncSubject<any>;
  private LinkList$: AsyncSubject<any>;
  private WordIndex$: AsyncSubject<any>;

  constructor(
    private staticService: StaticService,
    private httpClient: HttpClient,
    private offerDataService: OfferDataService
  ) {}

  public loadMNISTModel() {
    const kiToolsMnistModelPath =
      environment.modelURL + this.staticService.getKIModelPathMNIST() + '/model.json';

    return new Observable((observer$) => {
      if (!this.MNISTModel$) {
        console.log('Load MNIST-Model:', kiToolsMnistModelPath);
        this.MNISTModel$ = new AsyncSubject();
        from(tf.loadLayersModel(kiToolsMnistModelPath)).subscribe(this.MNISTModel$);
      }
      return this.MNISTModel$.subscribe(observer$);
    });
  }

  public loadSentimentModel(lang: string = 'en'): Observable<any> {
    const kiToolsSentimentModelPath_en =
      environment.modelURL + this.staticService.getKIModelPathSentiment(lang) + '/model/model.json';

    return new Observable((observer$) => {
      if (!this.SentimentModel$) {
        console.log('Load Sentiment-Model');
        this.SentimentModel$ = new AsyncSubject();
        from(tf.loadLayersModel(kiToolsSentimentModelPath_en)).subscribe(this.SentimentModel$);
      }
      return this.SentimentModel$.subscribe(observer$);
    });
  }

  public loadWordIndex(lang: string = 'en'): Observable<any> {
    const kiToolsSentimentIndexPath_en =
      environment.modelURL +
      this.staticService.getKIModelPathSentiment(lang) +
      '/imdb_word_index.json';

    return new Observable((observers$) => {
      if (!this.WordIndex$) {
        console.log('Load Word-Index');
        this.WordIndex$ = new AsyncSubject();
        this.httpClient.get(kiToolsSentimentIndexPath_en).subscribe(this.WordIndex$);
      }
      return this.WordIndex$.subscribe(observers$);
    });
  }

  public loadLinkList(
    server: boolean = true
  ): Observable<{
    demoCards: KIToolsTypes.LinkCardData[];
    projectCards: KIToolsTypes.LinkCardData[];
  }> {
    if (server) {
      return this.loadJSONLinkList();
    } else {
      return this.loadLinkListFromFile();
    }
  }

  public loadJSONLinkList(): Observable<{
    demoCards: KIToolsTypes.LinkCardData[];
    projectCards: KIToolsTypes.LinkCardData[];
  }> {
    return new Observable((observer$) => {
      if (!this.LinkList$) {
        console.log('Load Link List');
        this.LinkList$ = new AsyncSubject();
        const list = this.getLinkListJSONFile().pipe(
          map((items) => {
            const demoCards = this.mapJSONLinkListCardToLinkList(items.demoCards);
            const projectCards = this.mapJSONLinkListCardToLinkList(items.projectCards);
            return { demoCards, projectCards };
          })
        );
        list.subscribe(this.LinkList$);
      }
      return this.LinkList$.subscribe(observer$);
    });
  }

  private loadLinkListFromFile(): Observable<{
    demoCards: KIToolsTypes.LinkCardData[];
    projectCards: KIToolsTypes.LinkCardData[];
  }> {
    const demoCards = DemonstratorExamples.exampleText;
    const projectCards = DemonstratorExamples.projectText;
    const retValue = { demoCards, projectCards };
    return of(retValue);
  }

  private getLinkListJSONFile(): Observable<KIToolsTypes.LinkListJSONData> {
    const kiToolsDemoPath =
      environment.dataURL + this.staticService.getKIDemoLinkPath() + '/linklist.json';
    return this.httpClient.get<KIToolsTypes.LinkListJSONData>(kiToolsDemoPath);
  }

  private mapJSONLinkListCardToLinkList(linkList: any[]): KIToolsTypes.LinkCardData[] {
    const list = linkList.map((item) => {
      return {
        title: item.title,
        subtitle: item.subtitle,
        text: item.text,
        url: item.url,
        urlText: item.urlText,
        style: this.getLinkCardStyle(item.style),
        type: this.getLinkCardtype(item.type),
      };
    });
    return list;
  }

  private getLinkCardStyle(style: string): KIToolsTypes.LinkCardStyle {
    switch (style) {
      case 'cardText':
        return KIToolsTypes.LinkCardStyle.text;
        break;
      case 'cardProject':
        return KIToolsTypes.LinkCardStyle.project;
        break;
      case 'cardImages':
        return KIToolsTypes.LinkCardStyle.images;
        break;
      case 'cardDefault':
      default:
        return KIToolsTypes.LinkCardStyle.default;
    }
  }

  private getLinkCardtype(type: string): KIToolsTypes.LinkCardType | undefined {
    if (!type) return undefined;

    switch (type) {
      case 'com':
        return KIToolsTypes.LinkCardType.commercial;
        break;
      case 'free_demo':
        return KIToolsTypes.LinkCardType.free_demo;
        break;
      default:
        return undefined;
    }
  }

  /**
   * @deprecated Tensorflow wird per npm geladen
   * @param renderer
   * @returns
   */
  public loadKIScript(renderer: Renderer2): Observable<any> {
    return new Observable((observer$) => {
      if (!this.scriptLoading$) {
        console.log('Dont Load Tensorflow');
        this.scriptLoading$ = new AsyncSubject();
        //  this.scriptLoader.load(renderer, ['tensorflow']).subscribe(this.scriptLoading$);
      }
      return this.scriptLoading$.subscribe(observer$);
    });
  }

  public getKIModules(): Observable<any> {
    return this.offerDataService.getOffersForPlaygroundKIList(this.staticService.getKeyForSuperKICourse());
  }
}
