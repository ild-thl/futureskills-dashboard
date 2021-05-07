import { OfferTimeStamp } from './timestamp';

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
  public institution_id: number;
  public language_id: number;
  public offertype_id: number;
  public subtitle: string;
  public language: string;
  public meta: any;
  public hashtag: string;
  public ects: number;
  public timestamps: OfferTimeStamp;
  public time_requirement: string;
  public author: string;
  public sponsor: string;
  public exam: string;
  public requirements: string;
  public niveau: string;
  public target_group: string;
  public url: string;
  public sort_flag: number;
  public competence_tech: boolean;
  public competence_digital: boolean;
  public competence_classic: boolean;
  public relatedOffers: number[];

  constructor(
    id: number,
  ) {
    this.id = id;
  }
}

export class OfferUserData {
  constructor(public offer: Offer, public isSubscribed: boolean = false) {}
}

export type PartialOffer = Partial <Offer>;

export type SmallOfferListForEditForm = {
  id: number;
  image: string;
  title: string;
}
