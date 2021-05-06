import { Offer } from 'src/app/shared/models/offer';
import { User } from 'src/app/shared/models/user';

export interface UserData {
  isAuth: boolean;
  user: User;
}

export interface UserOfferData {
  user: User | null;
  offerData: Offer;
  isSubscribed: boolean;
}
