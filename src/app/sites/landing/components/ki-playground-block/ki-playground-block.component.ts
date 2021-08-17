import { Component, OnInit } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-ki-playground-block',
  templateUrl: './ki-playground-block.component.html',
  styleUrls: ['./ki-playground-block.component.scss'],
})
export class KiPlaygroundBlockComponent implements OnInit {
  constructor(public staticService: StaticService) {}
  lnkKITools = this.staticService.getPathInfo().lnkKITools;

  ngOnInit(): void {}
}
