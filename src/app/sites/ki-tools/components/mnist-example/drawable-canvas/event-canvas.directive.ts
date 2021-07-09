import { HostListener, Directive, ElementRef, Output, EventEmitter } from '@angular/core';

export type CanvasPosition = {
  type: string;
  target: string;
  previousPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
};

@Directive({
  selector: 'event-canvas, [event-canvas]',
})
export class EventCanvasDirective {
  @Output() changed = new EventEmitter<CanvasPosition>();

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pos: { x: number; y: number };
  lastPos: { x: number; y: number };
  drawing: boolean;

  // START
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (event.target == this.canvas) {
      event.preventDefault();
    }
    this.send('start', 'touch', this.getTouchPosition(event));
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.send('start', 'mouse', this.getMousePosition(event));
  }

  // END
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (event.target == this.canvas) {
      event.preventDefault();
    }
    this.send('stop', 'touch', null);
  }

  // Vielleicht das mouseleave noch anders behandeln
  @HostListener('mouseleave', ['$event'])
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.send('stop', 'mouse', null);
  }

  // MOVE
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (event.target == this.canvas) {
      event.preventDefault();
    }
    this.send('move', 'touch', this.getTouchPosition(event));
  }
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.send('move', 'mouse', this.getMousePosition(event));
  }

  constructor(private el: ElementRef) {
    this.canvas = this.el.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.pos = { x: 0, y: 0 };
    this.lastPos = { x: 0, y: 0 };
    this.drawing = false;
  }

  private send(type: string, target: string, newPosition: { x: number; y: number }) {
    this.lastPos = this.pos;
    this.pos = newPosition;

    if (!this.drawing && type == 'move') return;

    this.changed.emit({
      type,
      target,
      previousPosition: this.lastPos,
      currentPosition: this.pos,
    });

    if (type == 'start') this.drawing = true;
    if (type == 'stop') this.drawing = false;
  }

  // Calc Position Touch
  private getTouchPosition(event: TouchEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;
    return {
      x,
      y,
    };
  }
  // Calc Position Mouse
  private getMousePosition(event: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {
      x,
      y,
    };
  }
}
