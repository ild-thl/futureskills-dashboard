import { FormControl, ValidationErrors } from '@angular/forms';

// Checks if URL to Images follow pattern (used in new offer creration)
export class OfferFormValidators {
  static imgPath(control: FormControl): ValidationErrors | null {
    const imgPath = /(\/assets\/images\/|http(s?):)([/|.|\w|\s|-])*\.(?:jpe?g|gif|png)$/g;
    return imgPath.test(control.value)
      ? null
      : {
          imgPath: { valid: false },
        };
  }
}
