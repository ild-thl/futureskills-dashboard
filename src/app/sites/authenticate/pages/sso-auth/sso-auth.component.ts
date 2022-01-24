import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/core/services/token-check/token.service';
import { LogService } from 'src/app/core/services/logger/log.service';

@Component({
  selector: 'app-sso-auth',
  templateUrl: './sso-auth.component.html',
  styleUrls: ['./sso-auth.component.scss'],
})
export class SsoAuthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private logService: LogService
  ) {}
  queryParams: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.logService.log('SsoAuth', 'Params', params);
      const token = params.token;
      if (token) {
        const decoded = this.tokenService.getDecodedToken(token);
        this.queryParams = JSON.stringify(decoded);
        this.logService.log('SsoAuth', 'Decoded Token', this.queryParams);
      }
    });
  }
}
