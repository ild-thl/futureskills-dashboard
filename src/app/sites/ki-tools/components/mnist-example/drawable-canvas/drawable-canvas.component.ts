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
  AfterViewInit,
} from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { CanvasPosition } from './event-canvas.directive';

@Component({
  selector: 'fs-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
  styleUrls: ['./drawable-canvas.component.scss'],
})
export class DrawableCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('drawCanvas', { static: true }) public canvas: ElementRef;
  @Input() public width = 250;
  @Input() public height = 250;
  @Input() public imageSize = 28;
  @Output() newImage = new EventEmitter();
  @Output() canvasResized = new EventEmitter();

  canvasHtmlElement: HTMLCanvasElement; //Zeichencanvas
  ctx: CanvasRenderingContext2D; // Zeichencanvas Context
  scalingCanvasHTMLElement: HTMLCanvasElement; // Scaling Canvas
  scaling_ctx: CanvasRenderingContext2D; //Scaling Canvas Context

  mouseDrawingEventSubscription: Subscription;
  mouseLeavingEventSubscription: Subscription;
  resizingEventSubscription: Subscription;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // CTX-Drawig Canvas
    this.canvasHtmlElement = this.canvas.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvasHtmlElement.getContext('2d');
    this.canvasHtmlElement.width = this.width;
    this.canvasHtmlElement.height = this.height;


    //CTX-Scaling Canvas
    this.scalingCanvasHTMLElement = this.renderer.createElement('canvas') as HTMLCanvasElement;
    this.scaling_ctx = this.scalingCanvasHTMLElement.getContext('2d');
    this.scalingCanvasHTMLElement.height = this.imageSize;
    this.scalingCanvasHTMLElement.width = this.imageSize;

    this.resizeCanvasToDisplaySize(true);
    this.clearCanvas();
    this.listenToEvents();
  }

  ngOnDestroy(): void {
    if (this.mouseDrawingEventSubscription) this.mouseDrawingEventSubscription.unsubscribe();
    if (this.mouseLeavingEventSubscription) this.mouseLeavingEventSubscription.unsubscribe();
    if (this.resizingEventSubscription) this.resizingEventSubscription.unsubscribe();
  }

  /** Can be called from Parent-Component to delete Canvas-Content*/
  public clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.scaling_ctx.clearRect(0, 0, this.imageSize, this.imageSize);
  }

  private listenToEvents() {
    // Mouse is Drawing on Canvas
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

    // Mouse is leaving canvas
    this.mouseLeavingEventSubscription = fromEvent(this.canvasHtmlElement, 'mouseup').subscribe(
      (leaveEvent: MouseEvent) => {
        this.newImage.emit(this.scaleImageData());
      }
    );

    // Window Resize
    this.resizingEventSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .subscribe((evt) => {
        this.resizeCanvasToDisplaySize();
      });
  }

  onDrawingEvent(positionData: CanvasPosition) {
   // TODO: Hier auf die Events aus der Directive reagieren
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

  private scaleImageData(): ImageData {
    this.scaling_ctx.drawImage(this.canvasHtmlElement, 0, 0, this.imageSize, this.imageSize);
    return this.scaling_ctx.getImageData(0, 0, this.imageSize, this.imageSize);
  }

  private resizeCanvasToDisplaySize(force: boolean = false) {
    let wasChanged = false;
    const canvas = this.canvasHtmlElement;
    const ctx =  this.ctx;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let quadr = false;

    // 1. Quadratisch!
    if (width !== height) {
      height = width;
      quadr = true;
    }

    // Calc canvas-size if css-size changed
    if (canvas.width !== width || canvas.height !== height || quadr || force) {
      canvas.width = width;
      canvas.height = height;
      wasChanged = true;

      ctx.lineCap = 'round';
      ctx.strokeStyle = '#111111';

      if (width <= 200) {
        ctx.lineWidth = 10;
      } else if (width <= 300) {
        ctx.lineWidth = 12;
      } else if (width <= 400) {
        ctx.lineWidth = 14;
      }

      ctx.fillStyle = '#FFFFFF';
      this.canvasResized.emit({ width: canvas.width, height: canvas.height });
      console.log('Canvas Size changed: ', canvas.width, ' ', canvas.height);
    }
    return wasChanged;
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


}
