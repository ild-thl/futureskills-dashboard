import { Injectable } from '@angular/core';
import { OfferPropertyCache } from 'src/app/core/http/api/offer-property-cache.service';
import { OfferShortListForTiles, SmallOfferDetailData } from 'src/app/core/models/offer';
import { APIToOfferShortList } from 'src/app/core/http/api/api.interfaces';

/**
 * Mapping Data
 * WorkArounds in DataStructure
 */

@Injectable({
  providedIn: 'root',
})
export class DataMappingService {
  constructor(
    private offerPropertyCache: OfferPropertyCache
  ) {}

  ////////////////////////////////////////////////
  // MAPPING API<->DATA
  ////////////////////////////////////////////////

  /**
   *
   * @param offers Returns complete OfferData
   * @returns
   */
  mapDataInOfferStructure(offers: APIToOfferShortList[]): OfferShortListForTiles[] {
    // TODO: den PropertyCache übergeben oder extra laden, nicht einbinden!
    // (-> hier wird vorausgesetzt, dass er schon geladen wurde)
    //console.log('API OFFER:', offers);
    let newOffer: OfferShortListForTiles[] = [];
    for (const offerItem of offers) {
      newOffer.push({
        id: offerItem.id,
        title: offerItem.title,
        image_path: offerItem.image_path,
        institution_id: offerItem.institution_id,
        institution: {
          id: offerItem.institution_id,
          title: this.offerPropertyCache.institutionMap.get(offerItem.institution_id),
          url: undefined,
        },
        offertype_id: offerItem.offertype_id,
        type: this.offerPropertyCache.formatMap.get(offerItem.offertype_id),
        language_id: offerItem.language_id,
        language: this.offerPropertyCache.languageMap.get(offerItem.language_id),
        competences: offerItem.competences,
        competence_text: this.createCompetenceString(offerItem.competences),
        keywords: offerItem.keywords,
      });
    }
    //console.log('Short OFFER:', newOffer);
    return newOffer;
  }

  /**
   * Returns only id/title/image
   * @param offers
   */
   public mapDataInSmallOfferDetailData(offers: APIToOfferShortList[]): SmallOfferDetailData[] {
    return offers.map((data) => {
      return {
        id: data.id,
        image: data.image_path,
        title: data.title,
      };
    });
  }

  ////////////////////////////////////////////////
  // WORKAROUNDS
  ////////////////////////////////////////////////

  /**
   *
   * @param competences Workaround
   * @returns
   */
  public createCompetenceString(competences: number[]): string {
    let competenceArr = [];
    let competenceStr = '';

    if (competences.length == 0) {
      competenceStr = 'keine Angabe';
    } else {
      for (const competence of competences) {
        const competenceText = this.offerPropertyCache.competencesMap.get(competence);
        competenceArr.push(this.compworkaroundForText(competenceText));
      }
      competenceStr = competenceArr.join(', ');
    }
    return competenceStr;
  }

  /**
   * Die Funktion sorgt dafür dass die Kompetenztexte so angezeigt werden wie vorher
   * Todo: Besser die einheitliche Description benutzen (siehe offer-property-cache.service)
   * Die ist im Moment recht lang (siehe Texte in den Filtern)
   * @param text
   * @returns
   */
  private compworkaroundForText(text: string): string {
    switch (text) {
      case 'tech':
        return 'Tech';
      case 'digital':
        return 'Digital Basic';
      case 'classic':
        return 'Classic';
      default:
        return 'NA';
    }
  }
}
