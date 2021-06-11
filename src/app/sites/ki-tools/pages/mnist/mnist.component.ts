import { Component, OnInit, Renderer2 } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';
import { environment } from 'src/environments/environment';
import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import { from } from 'rxjs';
import { tap, concatMap } from 'rxjs/operators';
declare var tf: any;

@Component({
  selector: 'app-mnist',
  templateUrl: './mnist.component.html',
  styleUrls: ['./mnist.component.scss'],
})
export class MnistComponent implements OnInit {
  isLoading: boolean;
  isError: boolean;
  kitoolsAreOnline: boolean;
  model: any;
  lnkKITools = this.staticService.getPathInfo().lnkKITools;
  kiToolsModelPath = environment.modelURL + this.staticService.getKIConfig().mnistPath;

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
    this.kiStatusService
      .loadKIScript(this.renderer).subscribe(
        (model) => {
          this.loadModel();
        },
        (error) => {
          console.log('Error: ', error);
          this.isError = true;
        }
      );
  }

  loadMnistModel() {
    this.model = from(tf.loadLayersModel(this.kiToolsModelPath));
    return this.model;
  }

  async loadModel() {
    this.model = await tf.loadLayersModel(this.kiToolsModelPath);
   // console.log(this.model.summary());
    this.isLoading = false;
  }
}
