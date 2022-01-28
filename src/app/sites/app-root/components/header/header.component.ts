import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
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

  public isMenuCollapsed = true;

  lnkLogin = this.staticConfig.getPathInfo().lnkLogin;
  lnkLanding = this.staticConfig.getPathInfo().lnkLanding;
  lnkAfterLogout = this.staticConfig.getRoutingInfo().lnkAfterLogout;
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;
  lnkKITools = this.staticConfig.getPathInfo().lnkKITools;
  lnkInfoStudents = this.staticConfig.getPathInfo().lnkInfoStudents;
  lnkInfoTeaching = this.staticConfig.getPathInfo().lnkInfoTeaching;

  isAuthenticated = false;
  user: User;

  private userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private staticConfig: StaticService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.userAuthenticated$.subscribe({
      next: (userData: UserData) => {
        this.isAuthenticated = userData.isAuth;
        this.user = userData.user;
      },
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser().subscribe({
      next: (x) => {
        this.router.navigate([this.lnkAfterLogout]);
      },
    });
  }
}
