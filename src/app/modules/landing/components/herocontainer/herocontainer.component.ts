import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: 'app-herocontainer',
  templateUrl: './herocontainer.component.html',
  styleUrls: ['./herocontainer.component.scss'],
  providers: [NgbCarouselConfig]
})

export class HerocontainerComponent implements OnInit {

  chevronIcon = faChevronRight;

  constructor(config: NgbCarouselConfig) {
    config.interval = 4000;
    config.pauseOnHover = true;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
  }
  ngOnInit(): void {
  }

}
