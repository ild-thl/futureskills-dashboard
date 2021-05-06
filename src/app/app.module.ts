// Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Extern
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';

// Components
import { AppComponent } from 'src/app/app.component';

// Landing -> Eigenes Modul
import { LandingComponent } from 'src/app/modules/landing/pages/landing.components';
import { AdvantagesComponent } from 'src/app/modules/landing/components/advantages/advantages.component';
import { PreviewInfoBannerComponent } from 'src/app/modules/landing/components/banner-top/banner-top.component';
import { CoursecarouselComponent } from 'src/app/modules/landing/components/coursecarousel/coursecarousel.component';
import { HerocontainerComponent } from 'src/app/modules/landing/components/herocontainer/herocontainer.component';
import { PartnershipComponent } from 'src/app/modules/landing/components/partnership/partnership.component';
import { TrailerComponent } from 'src/app/modules/landing/components/trailer/trailer.component';
import { ConsentVideoComponent } from 'src/app/modules/landing/components/trailer//consent-video/consent-video.component';

// Offers -> Eigenes Modul
import { OfferListComponent } from 'src/app//modules/offers/offer-list/offer-list.component';

// Shared
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { FsbuttonComponent } from 'src/app/shared/components/fsbutton/fsbutton.component';
import { OfferTileComponent } from 'src/app/shared/components/offer-tile/offer-tile.component';

//IconList
import { faStar as farStar} from '@fortawesome/free-regular-svg-icons';
import {
  faStar as fasStar,
  faCheck,
  faDoorOpen,
  faChalkboardTeacher,
  faGlobeEurope,
  faCommentAlt,
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
    FsbuttonComponent,
    OfferListComponent,
    OfferTileComponent,
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
  providers: [CookieService],
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
      faGlobeEurope
    );
  }
}
