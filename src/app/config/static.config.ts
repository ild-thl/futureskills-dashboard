/**
 * Allgemeine Konfigurationen, die nicht fest-codiert werden und unabhängig vom Environment sind.
 * Kann über den static.service per Dependency Injection eingebunden werden.
 */
export const CustomConfig = {
  cookies: {
    preferenceCookieName: 'FS_USER_COOKIEPREFS',
    technical: {
      expiresIn: 0, // wie lange wird das notwendige Cookie gespeichert (in Tagen, oder 0 für die Session)
    },
  },
  paths: {
    lnkLanding: '/',
    lnkOffers: '/kurse',
    lnkInfoTeaching: '/info-lehrende',
    lnkInfoStudents: '/info-studierende',
    lnkImprint: '/impressum',
    lnkPrivacy: '/datenschutz',
    lnkLogin: '/login',
    lnkAdminOfferEdit: '/admin/kurs/edit',
    lnkAdminOfferNew: '/admin/kurs/neu',
    lnkKITools: '/ki-playground',
  },
  routingInfo: {
    lnkAfterLogin: '/kurse',
    lnkAfterLogout: '/',
    lnkTrailerAboutUs: '/info-lehrende'
  },
};
