import { Component } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-not-allowed',
  templateUrl: './not-allowed.component.html',
  styleUrls: ['./not-allowed.component.scss']
})
export class NotAllowedComponent {

  constructor(private staticService: StaticService) { }
  lnkLanding = this.staticService.getPathInfo().lnkLanding;
  lnkLogin=this.staticService.getPathInfo().lnkLogin;

}
