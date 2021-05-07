// Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Externe Module
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';

// Interne Module

// Services
import { AuthInterceptorService } from 'src/app/core/interceptors/auth-interceptor.service';

// Components
import { AppComponent } from 'src/app/sites/app-root/pages/app.component';

// Landing (Todo: eigenes Modul)
import { LandingComponent } from 'src/app/sites/landing/pages/landing/landing.components';
import { AdvantagesComponent } from 'src/app/sites/landing/components/advantages/advantages.component';
import { PreviewInfoBannerComponent } from 'src/app/sites/landing/components/banner-top/banner-top.component';
import { CoursecarouselComponent } from 'src/app/sites/landing/components/coursecarousel/coursecarousel.component';
import { HerocontainerComponent } from 'src/app/sites/landing/components/herocontainer/herocontainer.component';
import { PartnershipComponent } from 'src/app/sites/landing/components/partnership/partnership.component';
import { TrailerComponent } from 'src/app/sites/landing/components/trailer/trailer.component';
import { ConsentVideoComponent } from 'src/app/sites/landing/components/trailer//consent-video/consent-video.component';

// Offers (Todo: eigenes Modul)
import { OfferListComponent } from 'src/app/sites/offers/pages/offer-list/offer-list.component';
import { OfferDetailComponent } from 'src/app/sites/offers/pages/offer-detail/offer-detail.component';
import { SkeletonOffersComponent } from 'src/app/sites/offers/components/skeleton-offers/skeleton-offers.component';

import { FilterComboGroupComponent } from 'src/app/sites/offers/components/filter-row/filter-combo-group.component';
import { FilterRowDirective } from 'src/app/sites/offers/components/filter-row/filter-row.directive';
import { FilterComboBoxComponent } from 'src/app/sites/offers/components/filter-row/filter-combo-box/filter-combo-box.component';

// Admin
import { OfferEditComponent } from './sites/admin/pages/offer-edit/offer-edit.component';

// Sonst
import { AuthComponent } from 'src/app/sites/login/pages/auth/auth.component';
import { ImprintComponent } from 'src/app/sites/imprint/pages/imprint/imprint.component';
import { PrivacyComponent } from 'src/app/sites/privacy/pages/privacy/privacy.component';
import { NotfoundComponent } from 'src/app/sites/not-found/pages/notfound/notfound.component';
import { InfoStudentsComponent } from './sites/info-students/pages/info-students/info-students.component';
import { InfoTeachingComponent } from './sites/info-teaching/pages/info-teaching/info-teaching.component';

// Shared
import { FooterComponent } from 'src/app/sites/app-root/components/footer/footer.component';
import { HeaderComponent } from 'src/app/sites/app-root/components/header/header.component';
import { RoundButton } from 'src/app/shared/components/round-button/fs-round-button.component';
import { OfferTileComponent } from 'src/app/shared/components/offer-tile/offer-tile.component';
import { ErrorBackTextComponent} from 'src/app/shared/components/error-back-text/error-back-text.component';

//IconList
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import {
  faStar as fasStar,
  faCheck,
  faDoorOpen,
  faChalkboardTeacher,
  faGlobeEurope,
  faCommentAlt,
  faUser,
  faPen,
  faTrashAlt,
  faCog
} from '@fortawesome/free-solid-svg-icons';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
    AdvantagesComponent,
    PreviewInfoBannerComponent,
    CoursecarouselComponent,
    HerocontainerComponent,
    PartnershipComponent,
    TrailerComponent,
    ConsentVideoComponent,
    RoundButton,
    OfferListComponent,
    FilterComboGroupComponent,
    FilterRowDirective,
    FilterComboBoxComponent,
    SkeletonOffersComponent,
    OfferTileComponent,
    OfferDetailComponent,
    AuthComponent,
    ImprintComponent,
    PrivacyComponent,
    NotfoundComponent,
    ErrorBackTextComponent,
    InfoStudentsComponent,
    InfoTeachingComponent,
    OfferEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }

  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      fasStar,
      farStar,
      faCheck,
      faDoorOpen,
      faCommentAlt,
      faChalkboardTeacher,
      faGlobeEurope,
      faUser,
      faPen,
      faTrashAlt,
      faCog
    );
  }
}
