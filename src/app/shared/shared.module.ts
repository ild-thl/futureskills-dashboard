import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { RoundButton } from 'src/app/shared/components/round-button/fs-round-button.component';
import { OfferTileComponent } from 'src/app/shared/components/offer-tile/offer-tile.component';
import { ErrorBackTextComponent} from 'src/app/shared/components/error-back-text/error-back-text.component';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { InfoBannerComponent } from 'src/app/shared/components/info-banner/info-banner.component';
import { ConsentVideoComponent } from 'src/app/shared/components/consent-video/consent-video.component';
import { SmallOfferTileComponent } from 'src/app/shared/components/small-offer-tile/small-offer-tile.component';
import { NavBackDirective } from './directives/nav-back.directive';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import {
  faStar as fasStar,
  faChevronRight,
  faChevronLeft,
  faCheck,
  faDoorOpen,
  faChalkboardTeacher,
  faGlobeEurope,
  faCommentAlt,
  faUser,
  faPen,
  faTrash,
  faTrashAlt,
  faCog,
  faArrowLeft,
  faChevronDown,
  faAngleDown,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';




@NgModule({
declarations: [
  RoundButton,
  OfferTileComponent,
  ErrorBackTextComponent,
  LoadingSpinnerComponent,
  InfoBannerComponent,
  ConsentVideoComponent,
  SmallOfferTileComponent,
  NavBackDirective
],
imports: [
  CommonModule,
  NgbModule,
  RouterModule,
  FontAwesomeModule,
],
exports: [
  CommonModule,
  NgbModule,
  FontAwesomeModule,
  RoundButton,
  OfferTileComponent,
  ErrorBackTextComponent,
  LoadingSpinnerComponent,
  InfoBannerComponent,
  ConsentVideoComponent,
  SmallOfferTileComponent,
  NavBackDirective
]
})

export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      fasStar,
      farStar,
      faCheck,
      faChevronRight,
      faChevronLeft,
      faDoorOpen,
      faCommentAlt,
      faChalkboardTeacher,
      faGlobeEurope,
      faUser,
      faPen,
      faTrashAlt,
      faTrash,
      faCog,
      faArrowLeft,
      faChevronDown,
      faAngleDown,
      faExternalLinkAlt
    );
  }
}
