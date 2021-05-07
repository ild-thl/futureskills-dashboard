import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription;
  authSubsription: Subscription;
  isLoading = false;
  error: string = null;
  @ViewChild('authForm') authForm: NgForm;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.authSubsription = this.authService.userAuthenticated$.subscribe(
      (userData) => {
        if (userData.isAuth) {
          console.log('AuthComponent: User is logged in.', userData.user);
        }
      }
    );
  }

  onSubmit(form: NgForm) {
    //console.log(form.value);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    this.error = '';

    this.loginSubscription = this.authService.login(email, password).subscribe(
      (resData) => {
        //console.log('AuthComponent:', resData);
        this.isLoading = false;
        this.router.navigate(['/offers']);
      },
      (errorMessage) => {
        console.log('AuthComponent Error:', errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
    if (this.authSubsription) this.authSubsription.unsubscribe();
  }
}
