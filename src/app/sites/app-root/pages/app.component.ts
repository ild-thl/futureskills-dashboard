import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NavigationService } from 'src/app/core/services/navigation/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService, private navService: NavigationService) {}
  ngOnInit(): void {
    this.authService.autoLogin();
    this.navService.initialize();
  }
}
