/**
 * Typen und Klassen, die das Kurs(Offer) Objekt beschreiben
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
  public competence_tech: boolean | number;
  public competence_digital: boolean | number;
  public competence_classic: boolean | number;
  public relatedOffers: number[];

  constructor(
    id: number,
  ) {
    this.id = id;
  }
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

// Parts of an Offer
export type PartialOffer = Partial <Offer>;

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

  public getConvertedTimeStamp(): void{
    // TODO
  }
}

// Combines User and Offerdata
export class OfferUserData {
  constructor(public offer: Offer, public isSubscribed: boolean = false) {}
}

// For related offers in EditForm
export type SmallOfferListForEditForm = {
  id: number;
  image: string;
  title: string;
}
