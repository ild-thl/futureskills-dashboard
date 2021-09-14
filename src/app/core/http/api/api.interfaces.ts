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
}














