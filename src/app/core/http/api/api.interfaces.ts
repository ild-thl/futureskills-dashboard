export interface AuthResponseData {
  id: number;
  token_type: string;
  expires_in: string;
  access_token: string;
  refresh_token: string;
}

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

export interface FilterTagResponse {
  filter: FilterItemResponse[];
}

export interface FilterItemResponse {
  tag: string;
  title: {
    de: string;
    en?: string;
  };
  list: {
    id: number;
    identifier: string;
    description: {
      de: string;
      en?: string;
    };
  }[];
}

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
  competence_tech: boolean;
  competence_digital: boolean;
  competence_classic: boolean;
  relatedOffers: number[];
}














