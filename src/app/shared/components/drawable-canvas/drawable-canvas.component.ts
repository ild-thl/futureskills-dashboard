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
  @Input() public width = 200;
  @Input() public height = 200;
  @Input() public imageSize = 28;
  @Output() newImage = new EventEmitter();

  offScreenCanvas: any;
  ctx: CanvasRenderingContext2D;
  canvasHtmlElement: HTMLCanvasElement;
  mouseDrawingEventSubscription: Subscription;
  mouseLeavingEventSubscription: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.offScreenCanvas = this.renderer.createElement('canvas');
    this.offScreenCanvas.height = this.imageSize;
    this.offScreenCanvas.width = this.imageSize;
  }
  ngAfterViewInit(): void {
    this.canvasHtmlElement = this.canvas.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvasHtmlElement.getContext('2d');
    this.styleCanvas();

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
        const image = this.offScreenCanvas.getContext('2d').drawImage(this.canvasHtmlElement, 0, 0, 28, 28);

        //const image = this.ctx.drawImage(this.canvasHtmlElement, 0, 0, 28, 28);
        const imageData = this.ctx.getImageData(0, 0, 28, 28);
        this.newImage.emit(imageData);
      }
    );
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

  private styleCanvas() {
    this.canvasHtmlElement.width = this.width;
    this.canvasHtmlElement.height = this.height;
    //this.ctx.font = '50px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvasHtmlElement.width, this.canvasHtmlElement.height); //for white background
    //this.ctx.globalCompositeOperation = 'source-over';

    this.ctx.lineWidth = 11;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#111111';
    //this.ctx.strokeRect(0, 0, this.canvasHtmlElement.width, this.canvasHtmlElement.height);
  }
}
