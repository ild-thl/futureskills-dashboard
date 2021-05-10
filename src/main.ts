import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();

  // No console.log in production
  // This is the hacky way (-> LogService)
  if (environment.logFiles == false && window) {
    window.console.log = window.console.warn = window.console.info = function () {
      // Don't log anything.
    };
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
