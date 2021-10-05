import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  private authInitialized: boolean = false;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // if (this.authInitialized) return;
    // this.authInitialized = true;
    this.authService.autoLogin();
  }
}
