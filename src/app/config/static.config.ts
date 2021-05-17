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
    lnkInfoTeaching: '/info-teaching',
    lnkInfoStudents: '/info-students',
    lnkImprint: '/impressum',
    lnkPrivacy: '/datenschutz',
    lnkLogin: '/login',
    lnkAdminOfferEdit: '/admin/kurs/edit',
    lnkAdminOfferNew: '/admin/kurs/neu',
    lnkKITools: '/ki-tools',
  },
  routingInfo: {
    lnkAfterLogin: '/kurse',
    lnkAfterLogout: '/',
    lnkTrailerAboutUs: '/info-teaching'
  },
};


/**
 * Liste der externen Scripts, die nachgeladen werden können
 */
export interface Scripts {
  name: string;
  src: string;
}
export const ExternScripts: Scripts[] = [
  { name: 'tensorflow', src: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js' },
  { name: 'ml5:', src: 'https://unpkg.com/ml5@latest/dist/ml5.min.js'},
];
