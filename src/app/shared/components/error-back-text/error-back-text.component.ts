import { Component, Input, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'fs-error-back-text',
  templateUrl: './error-back-text.component.html'
})
export class ErrorBackTextComponent implements OnInit {
  @Input() errorText: string;

  lnkLanding = this.staticConfig.getPathInfo().lnkLanding;
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  constructor(private staticConfig: StaticService) {}

  ngOnInit(): void {
  }

}
