import { SmallOfferDetailData } from 'src/app/core/models/offer';
import { APIToOfferShortList } from 'src/app/core/http/api/api.interfaces';

////////////////////////////////////////////////
// Neuer Klasse zum Umwandeln der Daten in die Strukturen
////////////////////////////////////////////////

export abstract class DataMapping {
  /**
   * Returns only id/title/image
   * @param offers
   */
  public static mapDataInSmallOfferDetailData(
    offers: APIToOfferShortList[]
  ): SmallOfferDetailData[] {
    return offers.map((data) => {
      return {
        id: data.id,
        image: data.image_path,
        title: data.title,
      };
    });
  }
}
