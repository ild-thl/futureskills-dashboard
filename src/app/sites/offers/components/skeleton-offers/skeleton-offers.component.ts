import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-offers',
  templateUrl: './skeleton-offers.component.html',
  styleUrls: ['./skeleton-offers.component.scss']
})
export class SkeletonOffersComponent implements OnInit {

  counter(i: number) {
    return new Array(i);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
