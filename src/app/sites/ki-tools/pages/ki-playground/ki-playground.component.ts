import { Component, OnInit, Renderer2 } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';

@Component({
  selector: 'app-ki-playground',
  templateUrl: './ki-playground.component.html',
  styleUrls: ['./ki-playground.component.scss']
})
export class KIPlaygroundComponent implements OnInit {
  isLoadingScripts: boolean;
  isLoadingError: boolean;
  kitoolsAreOnline: boolean;
  lnkKITools_mnist = this.staticService.getPathInfo().lnkKITools_mnist;
  additionalText = '';

  constructor(
    private renderer: Renderer2,
    private staticService: StaticService,
    private kiStatusService: KiStatusService
  ) {}

  ngOnInit(): void {
    this.isLoadingScripts = false;
    this.isLoadingError = false;

    this.kitoolsAreOnline = this.staticService.getKIConfig().online;
    if (this.kitoolsAreOnline) {
      this.loadKIPackages();
    }
  }

  loadKIPackages(){
    this.kiStatusService.loadKIScript(this.renderer).subscribe(
      (value) => {
        console.log('init: ', value);
        this.isLoadingError = false;
      },
      (error) => {
        console.log('Error: ', error);
        this.isLoadingError = true;
      },
      () => {
        console.log('Completed: ');
        this.additionalText = '';
        this.isLoadingScripts = false;
      }
    );
  }
}
