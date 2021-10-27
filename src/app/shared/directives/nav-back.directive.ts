import { Directive, HostListener } from '@angular/core';
import { NavigationService } from 'src/app/core/services/navigation/navigation.service';

@Directive({ selector: 'fs-nav-back, [fs-nav-back]' })
export class NavBackDirective {

  constructor(private navService: NavigationService) { }
  @HostListener('click')
  onClick(): void {
    this.navService.navigateBack();
  }
}
