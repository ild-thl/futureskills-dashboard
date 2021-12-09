import {
  OfferShortListForTiles,
  PaginatedOfferData,
  PartialOffer,
  SmallOfferDetailData,
  SmallOfferListForEditForm,
} from 'src/app/core/models/offer';
import {
  APIToOfferShortList,
  OfferFilterToAPI,
  OfferToAPI,
  PaginatedOfferDataFromAPI,
} from 'src/app/core/http/api/api.interfaces';
import { PropertyIDMap, PropertyIDMapItem } from 'src/app/core/models/offer-properties';

//////////////////////////////////////////////////////////
// MAPS DATA INTO STRUCTURES
// WORKAROUNDS AND STRING-MAPPING
//////////////////////////////////////////////////////////

export abstract class DataMapping {
  //////////////////////////////////////////////////////////
  // FROM API -> CLIENT
  //////////////////////////////////////////////////////////

  /**
   * Data for Paginated OfferList/Tiles
   * @param paginatedData
   * @param propertyIds
   * @returns
   */
  public static mapMetaPaginationStructure(
    paginatedData: PaginatedOfferDataFromAPI,
    propertyIds: PropertyIDMap
  ): PaginatedOfferData {
    return {
      data: this.mapDataInOfferStructure(paginatedData.data, propertyIds),
      current_page: paginatedData.current_page,
      first_page_url: paginatedData.first_page_url,
      from: paginatedData.from,
      last_page: paginatedData.last_page,
      last_page_url: paginatedData.last_page_url,
      next_page_url: paginatedData.next_page_url,
      path: paginatedData.path,
      per_page: paginatedData.per_page,
      prev_page_url: paginatedData.prev_page_url,
      to: paginatedData.to,
      total: paginatedData.total,
    };
  }

  /**
   * Small DataStructures for RelatedOffers
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
   * Small DataStructures for RelatedOffers
   * Returns only id/title/image
   * @param offers
   * @returns
   */
  public static mapDataInSmallOfferDetailData(
    offers: APIToOfferShortList[]
  ): SmallOfferDetailData[] {
    return this.mapDataInSmallOfferDetailEditData(offers);
  }

  /**
   * Data in OfferTiles
   * @param offers
   * @param propertyIds
   * @returns
   */
  public static mapDataInOfferStructure(
    offers: APIToOfferShortList[],
    propertyIds: PropertyIDMap
  ): OfferShortListForTiles[] {
    //console.log('PropertyIds:', propertyIds);
    let newOffer: OfferShortListForTiles[] = [];
    const institutionMap = propertyIds.get('institutions');
    const languageMap = propertyIds.get('languages');
    const formatMap = propertyIds.get('formats');
    const competencesMap = propertyIds.get('competences');

    for (const offerItem of offers) {
      newOffer.push({
        id: offerItem.id,
        title: offerItem.title,
        image_path: offerItem.image_path,
        institution_id: offerItem.institution_id,
        institution: {
          id: offerItem.institution_id,
          title: institutionMap.get(offerItem.institution_id),
          url: undefined,
        },
        offertype_id: offerItem.offertype_id,
        type: formatMap.get(offerItem.offertype_id),
        language_id: offerItem.language_id,
        language: languageMap.get(offerItem.language_id),
        competences: offerItem.competences,
        competence_text: this.createCompetenceString(offerItem.competences, competencesMap),
        keywords: offerItem.keywords,
      });
    }
    return newOffer;
  }

  //////////////////////////////////////////////////////////
  // FROM CLIENT -> API
  //////////////////////////////////////////////////////////

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

  /**
   * Creates FilterArrays
   * @param filterMap
   * @returns
   */
  public static mapFilterToAPIFilter(filterMap: Map<string,number>): OfferFilterToAPI {
    //console.log("FilterItems:",  filterMap);

    let filterObj: OfferFilterToAPI = {};

    // Institutionen
    if (filterMap.has('institutions')) {
      const institutionid = filterMap.get('institutions');
      if (institutionid !== -1) {
        filterObj.institution_id = [filterMap.get('institutions')];
      }
    }

    // Languages
    if (filterMap.has('languages')) {
      const languageid = filterMap.get('languages');
      if (languageid !== -1) {
        filterObj.language_id = [filterMap.get('languages')];
      }
    }

    // Competeneces
    if (filterMap.has('competences')) {
      const competenceid = filterMap.get('competences');
      if (competenceid!== -1) {
        filterObj.competences = [filterMap.get('competences')];
      }
    }

    // Formats
    if (filterMap.has('formats')) {
      const formatid = filterMap.get('formats');
      if (formatid !== -1) {
        filterObj.offertype_id = [filterMap.get('formats')];
      }
    }
    return filterObj;
  }




  //////////////////////////////////////////////////////////
  // WORKAROUNDS AND STRINGS
  //////////////////////////////////////////////////////////

  /**
   * Text for Competence-String
   * @param competences
   * @param competencesMap
   * @returns
   */
  private static createCompetenceString(
    competences: number[],
    competencesMap: PropertyIDMapItem
  ): string {
    let competenceArr = [];
    let competenceStr = '';

    if (competences.length == 0) {
      competenceStr = 'keine Angabe';
    } else {
      for (const competence of competences) {
        const competenceText = competencesMap.get(competence);
        competenceArr.push(this.compworkaroundForText(competenceText));
      }
      competenceStr = competenceArr.join(', ');
    }
    return competenceStr;
  }

  /**
   * Die Funktion sorgt dafür dass die Kompetenztexte in den Offer-Tiles
   * in einer kommagetrennten Liste angezeigt werden.
   *
   * Todo: Besser die einheitliche Description benutzen.
   * Aber die ist im Moment recht lang (siehe Texte in den Filtern)
   * @param text
   * @returns
   */
  private static compworkaroundForText(text: string): string {
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
