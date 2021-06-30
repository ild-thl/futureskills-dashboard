import { Offer } from 'src/app/core/models/offer';
import { User } from 'src/app/core/models/user';

export interface UserData {
  isAuth: boolean;
  user: User;
}

export interface UserOfferData {
  user: User | null;
  offerData: Offer;
  isSubscribed: boolean;
}
