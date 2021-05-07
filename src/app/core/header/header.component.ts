import { Component, OnInit, OnDestroy, LOCALE_ID, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserData } from 'src/app/core/http/data/user/user-data.interface';
import { AuthService } from 'src/app/core/auth/auth.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  isAuthenticated = false;
  public user: User;

  languages = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
  ];

  constructor(
    private authService: AuthService,
    @Inject(LOCALE_ID) public localeId: string
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.userAuthenticated$.subscribe(
      (userData: UserData) => {
        this.isAuthenticated = userData.isAuth;
        this.user = userData.user;
      }
    );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
