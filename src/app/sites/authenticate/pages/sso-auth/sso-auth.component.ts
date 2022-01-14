import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/core/services/token-check/token.service';

@Component({
  selector: 'app-sso-auth',
  templateUrl: './sso-auth.component.html',
  styleUrls: ['./sso-auth.component.scss'],
})
export class SsoAuthComponent implements OnInit {
  constructor(private route: ActivatedRoute, private tokenService: TokenService) {}
  queryParams: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('Params', params);
      const token = params.token;
      if (token) {
        const decoded = this.tokenService.getDecodedToken(token);
        this.queryParams = JSON.stringify(decoded);
        console.log('Decoded Token: ', this.queryParams);
      }
    });
  }
}
