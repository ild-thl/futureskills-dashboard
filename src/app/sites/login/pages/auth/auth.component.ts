import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { StaticService } from 'src/app/config/static.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  lnkAfterLogin = this.staticConfig.getRoutingInfo().lnkAfterLogin;
  loginSubscription: Subscription;
  authSubsription: Subscription;

  isLoggedIn: boolean;
  isLoading = false;
  errorMessage: string = null;
  isError: boolean = false;

  @ViewChild('authForm') authForm: NgForm;

  constructor(
    private authService: AuthService,
    private router: Router,
    private staticConfig: StaticService
  ) {
    this.isLoggedIn = false;
  }
  ngOnInit() {
    this.authSubsription = this.authService.userAuthenticated$.subscribe((userData) => {
      this.isLoggedIn = userData.isAuth;
    });
  }

  onSubmit(form: NgForm) {
    //console.log(form.value);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    this.errorMessage = '';
    this.isError = false;

    this.loginSubscription = this.authService.login(email, password).subscribe({
      next: (resData: User) => {
        // console.log('resultFrom Server:', resData);
        this.isLoading = false;
        this.router.navigate([this.lnkAfterLogin]);
      },
      error: (errorMessage) => {
        console.log('AuthComponent Error:', errorMessage);
        this.errorMessage = 'Fehler beim Login';
        this.isError = true;
        this.isLoading = false;
      }
    });
    form.reset();
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
    if (this.authSubsription) this.authSubsription.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser().subscribe();
  }
}
