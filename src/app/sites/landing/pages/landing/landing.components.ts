import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { UserData } from 'src/app/core/data/user/user-data.interface';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  isAuthenticated = false;
  userSubscription: Subscription;
  user: User;

  ngOnInit() {
    this.userSubscription = this.authService.userAuthenticated$.subscribe(
      (userData: UserData) => {
        this.isAuthenticated = userData.isAuth;
        this.user = userData.user;
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
