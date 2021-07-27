import { Component, OnInit, Renderer2 } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';

@Component({
  selector: 'app-sentiment',
  templateUrl: './sentiment.component.html',
  styleUrls: ['./sentiment.component.scss'],
})
export class SentimentComponent implements OnInit {
  isLoading: boolean;
  isError: boolean;
  kitoolsAreOnline: boolean;

  lnkKITools = this.staticService.getPathInfo().lnkKITools;
  scriptIsLoaded = false;

  constructor(
    private renderer: Renderer2,
    private staticService: StaticService,
    private kiStatusService: KiStatusService
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.isError = false;

    this.kitoolsAreOnline = this.staticService.getKIConfig().online;
    if (this.kitoolsAreOnline) {
      this.loadKIPackages();
    }
  }


  loadKIPackages() {
    this.kiStatusService.loadKIScript(this.renderer).subscribe(
      (script) => {
        this.scriptIsLoaded = true;
        this.isError = false;
      },
      (error) => {
        console.log('Error: ', error);
        this.scriptIsLoaded = false;
        this.isError = true;
      }
    );
  }
}
