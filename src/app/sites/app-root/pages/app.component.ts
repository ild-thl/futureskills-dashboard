import { Component, ViewEncapsulation } from '@angular/core';
import { DataHandlerService } from 'src/app/core/http/data-handler.service';
import { NavigationService } from 'src/app/core/services/navigation/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'futureskills-client';

  constructor(
    private dataInitService: DataHandlerService,
    private navService: NavigationService
  ) {}

  ngOnInit(): void {
    // AutoLogin and initialize data-caching
    this.dataInitService.initialize();
    this.navService.initialize();
  }
}
