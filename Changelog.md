# Changelog

## [Not Released v0.11.0]

## 2022-04-26/ml
### added
- QuestionAid added to KI Tools
- 
## 2022-04-25/ml
### added
- Management: Header are sortable (asc/desc)

## 2022-04-07/ml
### added
- General AuthGuard checks if user is logged in, if yes management Pages can be loaded
- Management AuthGuard checks if route can be activated for specific rights on pages

## 2022-03-24/ml
### added
- New Management Pages
  - Dashboard, Courselist(table)
  - NewComponent, new form (shorter, without relatedoffers) -> redirect to Edit Component after saving
  - New Functions to create new offer
- New Entry in Header if Admin->link to ManagementPages
- New Messaging Service 
  - Toasts, that can be called from any class
  - Alert Class with AlertList
- Icons added, Background Image Added

### changed
- EditComponent (Properties in Comboboxes ok)

### deleted
- Admin Pages (old form is under alt/management)

## 2022-03-17/ml
- tsconfig->strictTemplates=true

## 2022-03-01/ml
### changed
- Interceptor/API/AuthService check if 401 error occurs to refresh token

## [Released v0.10.0]

## 2022-02-23/avz
### added
- Loading spinner on the Detail Page

## 2022-02-22/avz
### changed
- Detail Page into components

## 2022-02-21/avz
### changed
- Teacher Info Page into components

## 2022-02-17/ml
### added
- Function to update Token

## 2022-02-14/ml
### added
- Cookie Banner 

## 2022-02-10/ml
### added
- API, function for manual logou added
- new var app/config/static.config.ts -> general/authBehaviour/autologout
### changed
- handling accesstoken, refreshToken in Service
- no userData in localStorage, only Token


## 2022-02-10/avz
### changed
- changed the hardcoded loginname into a dynamic name

## 2022-02-08/ml
### changed
- strictRules
  - strictBindCallApply
  - strictFunctionTypes
  - noImplicitThis
  - noImplicitAny
- new extern Definitionfile
- OfferDetail/OfferPagination/FilterService - complete strictmode

## [Released v0.9]

## 2022-01-31/ml
- Pagination Bar is shorter 
- Login/Logout Button in ng-container to delete out of dom-structure
- visible var in static service

## 2022-01-27/avz
### added
- Textcomponent with video on the teacher info page

## 2022-01-27/avz
### changed
- added navigation bar to the header component

## 2022-01-26/ml
### changed
- kolkov/editor updated to 2.0.0 (Ivy Version)

## 2022-01-19/ml
### changed
- clean console.logs (eslint warning on)
- Implicit Returns are not allowed anymore
- several pages -> GUI shows different messages
### added
- ErrorService for ErrorMessages
- API Services handles Server-Status Codes

## 2022-01-17/ml
### changed
- rxjs completed path deleted in playground 
- new errorhandling in playground
- date for linklist in static var
- course-list: cleanup packages, deleted complete path

## 2022-01-14/ml
### changed
- login => if logged in , button to log out
- header, 
  - new subscription syntax
  - no i18 items

## 2022-01-14/ml
### added
- new module auth
- env Path for idp
- redirect path

## 2022-01-14/ml
### changed
- AuthService 
  - Token expired when login -> automatically logout
  - CleanUp (no timer anymore)
- Users Emailadress is no longer saved
### added
- token service


## 2022-01-10/ml
### changed
- Update to Angular13
- Update Packages
- Update Angular.json, tsconfig

## 2021-12-15/ml
### added
- User and Roles in auth.service
- UserData is not saved in localStorage any more, only token

## [Released v0.8]

## 2021-12-01/avz
### changed
- Reviewed and integrated all pages on accessibility:
  - Typography
  - Layout
  - Images
  - Colorcontrast
  - Viewport in combination with fontsize

## 2021-11-30/ml
### added
- Searchfield (new component) added (+tooltip)
- Searchdata is saved with filter-data

## 2021-11-29/avz
### changed
- ngif in OfferDetail (ngif > show metadata container)

## 2021-11-29/ml
### deleted
- OfferList deleted, filter-row directive deleted

## 2021-11-19/ml
### changed
- Searchstring can be saved
- Searchstring as Parameter in API-Fnct (Bug-filterObj is cloned now)
- Responsive row in filter-list

## 2021-10-26/ml
### changed
- Filterstatus is saved now / reloading courselist loads filter

## 2021-10-26/ml
### new/changed
- OfferList has server-based filter
- loading Offers: get->post
- new environment variable: offerItemPerPage

## 2021-10-07/ml
### new/changed/deleted
- Offers - new PaginationComponent
- Clean Up
  - no data store anymore for paginated courses (no caching)
  - Search-Data and Property-Data is cached
  - unused functions deleted
  - loadScript Service deleted (Tensorflow is packaged)

## [Released v0.7]

## 2021-11-05/avz
### changed
- Text color of the image captions

## 2021-10-28/ml
### added
- Navigation Service added
- NavBack Directive added (fs-nav-back)

## 2021-10-28/avz
### removed
- Components from startpage: grey top banner, speech balloon slider, trailer
### added
- To the startpage: introduction banner component with a header + advantages + background image + blob
### changed
- The imprint (impressum) regarding the background image

## 2021-10-04/ml
### added
- New Carousel in Playground is showing KeyWord (KIPlaygroundKurse)
- New Classes for Caching Data

## [Released v0.6]

## 2021-09-29/dk
### changed
- CSP allows a bootstrap cdn font and local data images

## 2021-09-29/avz
### changed
- changed the popup texts which are generated by the card chips

## 2021-09-28/dk
### added
- opencampus is part of CSP
### removed
- stars removed from offer-tile

## 2021-09-24/avz
### changed
- changed the detail page overal style
- added a card optic
- added recommended courses

## 2021-09-21/ml
### added
- Datatypes for SmallOfferTile

## 2021-09-16/ml
### added
- SmallOfferTile

## 2021-09-15/ml
### changed
- KI-Playground loads KeyWord-Offers from API
- Offer Type-Definitions 

## 2021-09-13/ml
### added
- EditComponent + KeywordList

## 2021-09-06/ml
### changed
- Linklist is json-File now (asset Folder)

## 2021-09-02/ml
### added
- New function for offer-data.service (Filter for Keywords)
- Adminsites are lazy-loaded

## 2021-08-31/ml
### changed
- IMDB-Word-Index is cached now
- Standalone Sentiment Bug fixed

## 2021-08-30/ml
### added
- In EditComponent PropertyLists added

## [Released v0.5]

## 2021-08-23/dk
### changed
- Replaced hardcoded link on teacher info page

## 2021-08-18/avz
### changed
- Tensorflow is npm-Bib now

## 2021-08-18/avz
### changed
- Imprint (images) -> added more sources 

## 2021-08-17/ml
### changed
- KI-Block moved to landingpage
- Imprint (images) and 2020->2021 

## 2021-08-11/ml
### changed
- UserData contains user_role now

## 2021-07-27/ml
### added
- new sentiment-example site
- new example-list site
- preview flag (no login necessary)

## 2021-06-09/ml
### added
- MNIST: Touch and MouseEvents are handled in new Directive

## 2021-06-08/ml
### Changed
- MNIST Text is not selectable anymore
- CANVAS Default Size is 250px (works always), Cursor is crosshair now

## 2021-06-07/ml
- MNIST-window has 98% size of parent
- components are responsive now

## 2021-06-06/ml
- MNIST: probabilities are shown and recognized
- different texts

## 2021-06-10/ml
### added
- new static vars for KI
- new environment var for model path
- Default Model-Files in assets
- new Drawable Canvas Component
- Prediction for number

## [Released] v0.4

## 2021-06-28/ml
### Changed
- "Lehrenden-Seite": Header, Section2 in future tense

## 2021-06-28/ml
### Changed
- Landing Page Button "Über uns" is commented out

## 2021-06-25/dn
### Added
- AI and video image for teacher page

### Changed
- typo
- tweaks to responsive image css

## 2021-06-23/ml
### Changed
- Pathnames in german
- auth-guard path bug fixed
- ki-playground with authGuard

## 2021-06-22/ml
# changed
- Login gets id and name from from access-token

## 2021-06-22/dn
### Added
- teacher info page #48
### Changed
- typos and text

## 2021-06-14/dk
# added
- Re-added the angular editor for offer edit

## 2021-06-14/avz
# added
- added student info page

## 2021-06-11/ml
# added
- shared info banner component
- consent-video moved to shared

## 2021-06-02/ml
- Offer-Object (short) is created out of Offer-Short + Properties
- generated competence-text

## 2021-05-27/ml
# Added
- getAllOfferShortList (Short OfferList)
- filter are offerProperties now
- properties are loaded once when needed
- padding fs-round button to 10px

## 2021-05-27/dn/dk
### Changed
- Padding fix in hero carousel

## 2021-05-20/ml
# Changed
- fs-round-button (Padding and font fix)

## 2021-05-20/dk
# Changes
- fixed production CSP

## 2021-05-20/avz
# Changes
- added shy to title when breaking on small screens
- changed mediaquery to hide the list-style-type dots in the footer 

## 2021-05-19/ml
### Added
- courseCarousel as a module
- added Hammerjs

## 2021-05-19/ml
- script-loader added (dynamically loading javascript-files)
- KI-Tools are lazy loaded

## 2021-05-18/ml
- Shared Module (fonts, bootstrap Modules and Shared Components)
- LandingPage has its own module now
- Shared Component LoadingSpinner

## 2021-05-06/ml    
New Project with Angular 11

## Changes
- Updated Packages (Angular, ng-boostrap, ngx-cookie-service)
- New Testframework Jest
- Folder Structure
- Icon Library only contains used Icons (not the complete library)
- All Links are now variables. See static.config.ts
