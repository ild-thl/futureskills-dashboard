import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-consent-video',
  templateUrl: './consent-video.component.html',
  styleUrls: ['./consent-video.component.scss']
})

/* Sets a cookie if given video consent */
/* Ex: <app-consent-video src="https://www.youtube-nocookie.com/embed/Wl2sDEpjqQI?start=4"></app-consent-video> */
export class ConsentVideoComponent implements OnInit {
  private src: string;
  public sansrc: SafeUrl;
  public consent: boolean = false;

  constructor(
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private cookieService: CookieService
  ) {
    this.src = el.nativeElement.getAttribute('src');
    this.sansrc = sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  ngOnInit(): void {
    if(this.cookieService.get('fs-videoconsent')) {
      this.consent = true;
    }
  }

  setConsent(): void {
    this.consent = true;

    this.cookieService.set('fs-videoconsent', 'true', 365);
  }
}
