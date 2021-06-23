import { Component, OnInit, ViewChildren, QueryList, Renderer2, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mnist-additional-info',
  templateUrl: './mnist-additional-info.component.html',
  styleUrls: ['./mnist-additional-info.component.scss'],
})
export class MnistAdditionalInfoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren('tableCanvas') public tablerow: QueryList<ElementRef>;
  @Input() predictions = false;

  private MODEL_SIZE = 28;
  private viewIsInitialized = false;
  private miniCanvasHTMLElement: HTMLCanvasElement;
  private miniCanvasHTMLContext: CanvasRenderingContext2D;
  private tableRowSubscription: Subscription;

  constructor(private renderer: Renderer2) {}

  prediction_available: boolean = false;
  predictionIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  ngOnInit(): void {
    this.miniCanvasHTMLElement = this.renderer.createElement('canvas') as HTMLCanvasElement;
    this.miniCanvasHTMLContext = this.miniCanvasHTMLElement.getContext('2d');
    this.miniCanvasHTMLElement.width = this.MODEL_SIZE;
    this.miniCanvasHTMLElement.height = this.MODEL_SIZE;
    this.clearMiniCanvas();

  }
  ngAfterViewInit(): void {
    if (this.tablerow.first && !this.viewIsInitialized) {
      const td = this.tablerow.first.nativeElement;
      this.renderer.appendChild(td, this.miniCanvasHTMLElement);
    }

    this.tableRowSubscription = this.tablerow.changes.subscribe((value) => {
      const tableRow = this.tablerow.first;
      console.log('Panel ', tableRow);
      if (tableRow) {
        const td = this.tablerow.first.nativeElement;
        this.renderer.appendChild(td, this.miniCanvasHTMLElement);
      }
    });
    this.viewIsInitialized = true;
  }

  ngOnDestroy(): void {
    if (this.tableRowSubscription) this.tableRowSubscription.unsubscribe();
  }

  public setMiniCanvasImage(imageData: ImageData){
    this.miniCanvasHTMLContext.putImageData(imageData, 0, 0);
  }

  private clearMiniCanvas() {
    this.miniCanvasHTMLContext.clearRect(
      0,
      0,
      this.miniCanvasHTMLContext.canvas.width,
      this.miniCanvasHTMLContext.canvas.height
    );
  }
}
