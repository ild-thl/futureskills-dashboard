import { Institution } from './institution';
/**
 * Typen und Klassen, die das Kurs(Offer) Objekt beschreiben
 */

/**
 * all possible OfferData
 */
export class Offer {
  public id: number;
  public title: string;
  public type: string;
  public description: string;
  public image_path: string;
  public institution: {
    id: number;
    title: string;
    url: string;
  };
  public competences: number[];
  public competence_text: string;
  public institution_id: number;
  public language_id: number;
  public offertype_id: number;
  public subtitle: string;
  public language: string;
  public meta: OfferMeta;
  public hashtag: string;
  public timestamps: OfferTimeStamp;
  public author: string;
  public target_group: string;
  public url: string;
  public sort_flag: number;
  public keywords: string;
  public competence_tech: boolean | number;
  public competence_digital: boolean | number;
  public competence_classic: boolean | number;
  public relatedOffers: number[];
  public relatedOfferData: SmallOfferDetailData[];

  constructor(id: number) {
    this.id = id;
  }
}

// For related offers in EditForm
export type SmallOfferListForEditForm = {
  id: number;
  image: string;
  title: string;
};
// For related offers in DetailPage
export type SmallOfferDetailData = {
  id: number;
  image: string;
  title: string;
};

// From API to a short Offer
export type OfferShortListForTiles = {
  id: number;
  title: string;
  image_path: string;
  institution_id: number;
  institution: Institution;
  offertype_id: number;
  type: string;
  language_id: number;
  language: string;
  competences: number[];
  competence_text: string;
  keywords: string;
};

// Parts of an Offer (besser die beiden oben verwenden)
export type PartialOffer = Partial<Offer>;

// Meta Data for Offer
export class OfferMeta {
  public ects: number;
  public sponsor: string;
  public exam: string;
  public requirements: string;
  public niveau: string;
  public time_requirement: string;
}

// TimeStampData for Offer
export class OfferTimeStamp {
  public executed_from: Date;
  public executed_until: Date;
  public listed_from: Date;
  public listed_until: Date;

  public getConvertedTimeStamp(): void {
    // TODO
  }
}

// Combines User and Offerdata
export class OfferUserData {
  constructor(public offer: Offer, public isSubscribed: boolean = false) {}
}

// unused, für später
// export class ShortOfferTileData {
//   public id: number;
//   public title: string;
//   public image_path: string;
//   public offertype: {id: number, text: string};
//   public language: {id: number, text: string};
//   public institution: {id: number, text: string};
//   public competence: {ids: number[], text: string};
// }
