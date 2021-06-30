import { Component } from '@angular/core';
//import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-trailer',
  templateUrl: './trailer.component.html',
  styleUrls: ['./trailer.component.scss']
})
export class TrailerComponent {

 // chevronIcon = faChevronRight;
  lnkTrailerAboutUs = this.staticConfig.getRoutingInfo().lnkTrailerAboutUs;

  constructor(private staticConfig: StaticService) {}

}
