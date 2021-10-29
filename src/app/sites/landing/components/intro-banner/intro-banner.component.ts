import { Component, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-intro-banner',
  templateUrl: './intro-banner.component.html',
  styleUrls: ['./intro-banner.component.scss']
})
export class IntroBannerComponent implements OnInit {
  lnkOffers = this.staticConfig.getPathInfo().lnkOffers;

  constructor(private staticConfig: StaticService) { }

  ngOnInit(): void {
  }

}
