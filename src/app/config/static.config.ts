/**
 * JSON-Dateien als Modul-Importe
 */
import * as keywords from './modul-data/keywordlist.json';

/**
 * Allgemeine Konfigurationen, die nicht fest-codiert werden und unabhängig vom Environment sind.
 * Kann über den static.service per Dependency Injection eingebunden werden.
 */
export const CustomConfig = {
  cookies: {
    preferenceCookieName: 'FS_COOKIEPREFS',
    technical: {
      expiresIn: 0, // wie lange wird das notwendige Cookie gespeichert (in Tagen, oder 0 für die Session)
    },
  },
  general: {
    isVisible: {
      loginButton: false,
      logoutButton: true,
    },
    authBehaviour: {
      autoLogout: true, // wird man ausgeloggt wenn bei Start der App das Token ungültig ist?
      logoutWithServer: false, // wird der Server benachrichtigt, wenn man sich ausloggt?
    },
  },
  kiConfig: {
    online: true,
    linkListDate: '13.10.2022',
    mnistPath: 'mnistnumber',
    sentimentPath: {
      en: 'sentiment/en',
      de: 'sentiment/de',
    },
    linkListPath: 'kiplayground/lnklist',
  },
  filterParams: {
    institutions: 'institutions',
    languages: 'languages',
    competences: 'competences',
    formats: 'formats',
  },
  paths: {
    lnkLanding: '/',
    lnkOffers: '/kurse',
    lnkInfoTeaching: '/info-lehrende',
    lnkInfoStudents: '/info-studierende',
    lnkImprint: '/impressum',
    lnkPrivacy: '/datenschutz',
    lnkLogin: '/login',
    lnkNotAllowed: '/kein-zugriff',
    lnkManage: '/verwaltung',
    lnkManageOfferList: '/verwaltung/kurse',
    lnkManageOfferEdit: '/verwaltung/kurs/edit',
    lnkManageOfferNew: '/verwaltung/kurs/neu',
    lnkAdminOfferEdit: '/verwaltung/kurs/alt/edit',
    lnkAdminOfferNew: '/verwaltung/kurs/alt/neu',
    lnkKITools: '/ki-playground',
    lnkKITools_mnist: '/ki-playground/mnist',
    lnkKITools_sentiment: '/ki-playground/sentiment',
    linkKITools_demonstrators: '/ki-playground/examples',
  },
  assets: {
    images: {
      default: '/assets/images/FutureSkills_default.png'
    }
  },
  routingInfo: {
    lnkAfterLogin: '/kurse',
    lnkAfterLogout: '/',
    lnkTrailerAboutUs: '/info-lehrende',
  },
  courseNumbers: {
    FS_SuperKI: '/615',
    FS_NeuronaleNetze: '/602',
  },
  courseKeyWords: (keywords as any).default,
  courseKeyWordKeys: {
    keyForSuperKIKurs: 'fssuperkikurs',
    keyForPlaygroundKIKurs: 'fskiplayground',
  },
};
