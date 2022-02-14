import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CookieData, ICookieData } from 'src/app/core/models/cookie-data';
import { CookieDataService } from 'src/app/core/services/cookie/cookie-data.service';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit, OnDestroy {
  type = 'info';
  visible = false;
  private onCookieDataChanged: Subscription;

  constructor(private cookieDataService: CookieDataService) {}
  formData = {
    technicalCheck: true,
    functionalCheck: false,
  };

  ngOnInit(): void {
    this.onCookieDataChanged = this.cookieDataService.cookieInfos$.subscribe(
      (data: CookieData) => {
        // Wenn es Cookieeinstellungen gibt dann unsichtbar.
        this.visible = !data.cookieSet;
      }
    );
    const cookieTest = this.cookieDataService.checkCookies();
  }

  // Send Data to Cookie Service
  // ////////////////////////////

  saveFormCookieInfo() {
    let cookieValues: ICookieData = {
      functional: this.formData.functionalCheck,
    };
    this.saveCookieInfo(cookieValues);
  }

  saveAllCookieInfo() {
    let cookieValues: ICookieData = {
      functional: true,
    };
    this.saveCookieInfo(cookieValues);
  }

  private saveCookieInfo(cookieData: ICookieData) {
    this.cookieDataService.saveCookieInfo(cookieData);
  }

  ngOnDestroy(): void {
    if (this.onCookieDataChanged) this.onCookieDataChanged.unsubscribe();
  }
}
