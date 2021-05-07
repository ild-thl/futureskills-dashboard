import { Component, ViewEncapsulation } from '@angular/core';
import { DataHandlerService } from 'src/app/core/http/data-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'futureskills-client';

  constructor(
    private dataInitService: DataHandlerService
  ) {}

  ngOnInit(): void {
    // AutoLogin and initialize data-caching
    this.dataInitService.initialize();
  }
}
