export interface SubscriptionData {
  user_id: number;
  offer_id: number;
  status: boolean;
}

export interface UserDataErrorResponse {
  isLoaded: boolean;
  isError: boolean;
  message: string;
}

export interface OfferPropertyTagResponse {
  filter: OfferPropertyItemResponse[];
}

export interface OfferPropertyItemResponse {
  tag: string;
  list: {
    id: number;
    identifier: string;
    description: {
      de: string;
      en?: string;
    };
  }[];
}

// From API to Short Offer
export type APIToOfferShortList = {
  id: number;
  title: string;
  image_path: string;
  institution_id: number;
  offertype_id: number;
  language_id: number;
  competences: number[];
  keywords: string;
};

// From API to Short Offer
export type APIToOfferMiniList = {
  id: number;
  title: string;
  image_path: string;
  visible: number;
  sortflag: number;
};

// Data from Pagination API
export type PaginatedOfferDataFromAPI = {
  data: APIToOfferShortList[];
} & PaginatedMetaData;

export type PaginatedMetaData = {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

// Data to API
export type OfferToAPI = {
  id: number | null;
  title: string;
  type: string;
  description: string;
  image_path: string;
  institution_id: number;
  subtitle: string;
  language: string;
  hashtag: string;
  time_requirement: string;
  author: string;
  sponsor: string;
  exam: string;
  requirements: string;
  niveau: string;
  target_group: string;
  url: string;
  sort_flag: number;
  keywords: string;
  competence_tech: boolean | number;
  competence_digital: boolean | number;
  competence_classic: boolean | number;
  relatedOffers: number[];
};

export type OfferFilterToAPI = {
  institution_id?: number[];
  language_id?: number[];
  offertype_id?: number[];
  competences?: number[];
};

export type OfferSearchFilterToAPI = OfferFilterToAPI & { textsearch?: string } ;
