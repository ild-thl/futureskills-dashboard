import { Injectable } from '@angular/core';
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private browserHistory: string[] = []

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.browserHistory.push(event.urlAfterRedirects)
      }
    })
  }

  navigateBack(): void {
    this.browserHistory.pop();

    // Damit man mitbekommt wann keine History vorhanden ist
    if (this.browserHistory.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
