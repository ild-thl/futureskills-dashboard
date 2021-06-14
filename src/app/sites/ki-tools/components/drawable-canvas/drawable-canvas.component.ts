import { KiStatusService } from 'src/app/sites/ki-tools/services/ki-status.service';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fs-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
  styles: [],
})
export class DrawableCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) public canvas: ElementRef;
  //@ViewChild('scaleCanvas', { static: true }) public scaleCanvas: ElementRef;
  @Input() public width = 200;
  @Input() public height = 200;
  @Input() public imageSize = 28;
  @Input() events: Observable<string>;
  @Output() newImage = new EventEmitter();

  canvasHtmlElement: HTMLCanvasElement; //Zeichencanvas
  ctx: CanvasRenderingContext2D; // Zeichencanvas Context
  scalingCanvasHTMLElement: HTMLCanvasElement; // Scaling Canvas
  scaling_ctx: CanvasRenderingContext2D;

  mouseDrawingEventSubscription: Subscription;
  mouseLeavingEventSubscription: Subscription;
  eventSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private kiService: KiStatusService
  ) {}

  ngOnInit(): void {
    this.eventSubscription = this.events.subscribe(event =>{
      if (event==='action:clear'){
        this.clear();
      }
    })
  }

  ngAfterViewInit(): void {
    this.canvasHtmlElement = this.canvas.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvasHtmlElement.getContext('2d');
    this.canvasHtmlElement.width = this.width;
    this.canvasHtmlElement.height = this.height;
    this.styleCanvas();

    //this.scalingCanvasHTMLElement = this.scaleCanvas.nativeElement as HTMLCanvasElement;
    this.scalingCanvasHTMLElement = this.renderer.createElement('canvas') as HTMLCanvasElement;
    this.scaling_ctx = this.scalingCanvasHTMLElement.getContext('2d');
    this.scalingCanvasHTMLElement.height = this.imageSize;
    this.scalingCanvasHTMLElement.width = this.imageSize;

    this.mouseDrawingEventSubscription = this.captureDrawingCanvasEvents().subscribe(
      (mouseEvnt: [MouseEvent, MouseEvent]) => {
        const rect = this.canvasHtmlElement.getBoundingClientRect();
        const previousPosition = {
          x: mouseEvnt[0].clientX - rect.left,
          y: mouseEvnt[0].clientY - rect.top,
        };
        const currentPosition = {
          x: mouseEvnt[1].clientX - rect.left,
          y: mouseEvnt[1].clientY - rect.top,
        };
        this.draw(previousPosition, currentPosition);
      }
    );

    this.mouseLeavingEventSubscription = fromEvent(this.canvasHtmlElement, 'mouseup').subscribe(
      (leaveEvent: MouseEvent) => {
        this.newImage.emit(this.scaleImageData());
      }
    );
  }

  scaleImageData(): ImageData {
    this.scaling_ctx.drawImage(this.canvasHtmlElement, 0, 0, this.imageSize, this.imageSize);
    return this.scaling_ctx.getImageData(0, 0, this.imageSize, this.imageSize);
  }

  ngOnDestroy(): void {
    if (this.mouseDrawingEventSubscription) this.mouseDrawingEventSubscription.unsubscribe();
    if (this.mouseLeavingEventSubscription) this.mouseLeavingEventSubscription.unsubscribe();
  }

  private captureDrawingCanvasEvents(): Observable<[Event, Event]> {
    return fromEvent(this.canvasHtmlElement, 'mousedown').pipe(
      switchMap((event) => {
        return fromEvent(this.canvasHtmlElement, 'mousemove').pipe(
          takeUntil(fromEvent(this.canvasHtmlElement, 'mouseup')),
          takeUntil(fromEvent(this.canvasHtmlElement, 'mouseleave')),
          pairwise()
        );
      })
    );
  }

  private draw(
    previousPosition: { x: number; y: number },
    currentPosition: { x: number; y: number }
  ) {
    if (!this.ctx) return;

    this.ctx.beginPath();
    if (previousPosition) {
      this.ctx.moveTo(previousPosition.x, previousPosition.y);
      this.ctx.lineTo(currentPosition.x, currentPosition.y);
      this.ctx.stroke();
    }
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.scaling_ctx.clearRect(0, 0, this.imageSize, this.imageSize);
  }

  private styleCanvas() {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvasHtmlElement.width, this.canvasHtmlElement.height); //for white background
    //this.ctx.globalCompositeOperation = 'source-over';

    this.ctx.lineWidth = 11;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#111111';
    //this.ctx.strokeRect(0, 0, this.canvasHtmlElement.width, this.canvasHtmlElement.height);
  }
}
