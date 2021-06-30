import { Component, OnInit, OnDestroy, LOCALE_ID, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserData } from 'src/app/core/data/user/user-data.interface';
import { AuthService } from 'src/app/core/auth/auth.service';
import { User } from 'src/app/core/models/user';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  lnkLogin = this.staticConfig.getPathInfo().lnkLogin;
  lnkLanding = this.staticConfig.getPathInfo().lnkLanding;
  private userSubscription: Subscription;
  isAuthenticated = false;
  public user: User;

  languages = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
  ];

  constructor(
    private authService: AuthService,
    private staticConfig: StaticService,
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
