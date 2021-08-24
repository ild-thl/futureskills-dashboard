import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-ki-playground-block',
  templateUrl: './ki-playground-block.component.html',
  styleUrls: ['./ki-playground-block.component.scss'],
})
export class KiPlaygroundBlockComponent implements OnInit {
  constructor(public staticService: StaticService, private router: Router) {}
  lnkKITools = this.staticService.getPathInfo().lnkKITools;
  isNavigating: boolean = false;

  ngOnInit(): void {
    this.isNavigating = false;
  }

  goToKIPage() {
    this.isNavigating = true;
    this.router.navigate([this.lnkKITools]);
  }
}
