import { PartialOffer, SmallOfferDetailData, SmallOfferListForEditForm } from 'src/app/core/models/offer';
import { APIToOfferShortList, OfferToAPI } from 'src/app/core/http/api/api.interfaces';

////////////////////////////////////////////////
// Neuer Klasse zum Umwandeln der Daten in die Strukturen
////////////////////////////////////////////////

export abstract class DataMapping {

  /**
   * Returns only id/title/image
   * @param offers
   */
  public static mapDataInSmallOfferDetailEditData(
    offers: APIToOfferShortList[]
  ): SmallOfferDetailData[] | SmallOfferListForEditForm[] {
    return offers.map((data) => {
      return {
        id: data.id,
        image: data.image_path,
        title: data.title,
      };
    });
  }

  /**
   * Creates structure for API-Data
   * @param id
   * @param offerdata
   * @param relatedCourses
   * @returns
   */
  public static mapOfferFormDataToAPIOffer(
    id: number | null,
    offerdata: PartialOffer,
    relatedCourses: number[]
  ): OfferToAPI {
    const tempOffer: OfferToAPI = {
      id: id,
      author: offerdata.author,
      institution_id: offerdata.institution_id,
      competence_classic: offerdata.competence_classic,
      competence_digital: offerdata.competence_digital,
      competence_tech: offerdata.competence_tech,
      description: offerdata.description,
      exam: offerdata.meta.exam,
      hashtag: offerdata.hashtag,
      image_path: offerdata.image_path,
      language: offerdata.language,
      niveau: offerdata.meta.niveau,
      requirements: offerdata.meta.requirements,
      sort_flag: offerdata.sort_flag,
      sponsor: offerdata.meta.sponsor,
      subtitle: offerdata.subtitle,
      target_group: offerdata.target_group,
      time_requirement: offerdata.meta.time_requirement,
      title: offerdata.title,
      type: offerdata.type,
      url: offerdata.url,
      keywords: offerdata.keywords,
      relatedOffers: relatedCourses,
    };
    return tempOffer;
  }
}
