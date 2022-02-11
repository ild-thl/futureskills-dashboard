// Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Externe Module
import { CookieService } from 'ngx-cookie-service';

// Interne Module
import { LandingPageModule } from 'src/app/sites/landing/landing.module';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';

// Interceptor
import { httpInterceptors } from './core/auth/http-interceptors';

// Components
import { AppComponent } from 'src/app/sites/app-root/pages/app.component';

// Offers (Todo: eigenes Modul)
import { OfferDetailComponent } from 'src/app/sites/offers/pages/offer-detail/offer-detail.component';
import { SkeletonOffersComponent } from 'src/app/sites/offers/components/skeleton-offers/skeleton-offers.component';

import { FilterComboGroupComponent } from 'src/app/sites/offers/components/filter-row/filter-combo-group.component';
import { FilterComboBoxComponent } from 'src/app/sites/offers/components/filter-row/filter-combo-box/filter-combo-box.component';
import { FilterRowServerDirective } from './sites/offers/components/filter-row/filter-row-server.directive';

// Admin -> Lazy-Loaded-Modul
// KI-Playground -> Lazy-Loaded-Modul

// Sonst
import { AuthComponent } from 'src/app/sites/login/pages/auth/auth.component';
import { ImprintComponent } from 'src/app/sites/imprint/pages/imprint/imprint.component';
import { PrivacyComponent } from 'src/app/sites/privacy/pages/privacy/privacy.component';
import { NotfoundComponent } from 'src/app/sites/not-found/pages/notfound/notfound.component';
import { InfoStudentsComponent } from 'src/app/sites/info-students/pages/info-students/info-students.component';
import { InfoTeachingComponent } from 'src/app/sites/info-teaching/pages/info-teaching/info-teaching.component';

import { FooterComponent } from 'src/app/sites/app-root/components/footer/footer.component';
import { HeaderComponent } from 'src/app/sites/app-root/components/header/header.component';
import { OfferListPaginatedComponent } from './sites/offers/pages/offer-list-paginated/offer-list-paginated.component';
import { SearchFieldComponent } from './sites/offers/components/search-field/search-field.component';
import { NotAllowedComponent } from './sites/not-allowed/pages/not-allowed.component';
import { AboutFutureskillsComponent } from './sites/info-teaching/components/about-futureskills/about-futureskills.component';
import { VideoPresentationComponent } from './sites/info-teaching/components/video-presentation/video-presentation.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FilterComboGroupComponent,
    FilterComboBoxComponent,
    SkeletonOffersComponent,
    OfferDetailComponent,
    AuthComponent,
    ImprintComponent,
    PrivacyComponent,
    NotfoundComponent,
    InfoStudentsComponent,
    InfoTeachingComponent,
    OfferListPaginatedComponent,
    FilterRowServerDirective,
    SearchFieldComponent,
    NotAllowedComponent,
    AboutFutureskillsComponent,
    VideoPresentationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LandingPageModule,
    SharedModule
  ],
  providers: [
    CookieService,
    [...httpInterceptors]
  ],
  bootstrap: [AppComponent],
})

export class AppModule {}
