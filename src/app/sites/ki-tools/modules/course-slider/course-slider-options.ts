export class CourseSliderOptions {
  isLoading: boolean;
  cbackdrops: number[];
  showCustomArrows!: boolean;
  showArrows!: boolean;
  showBullets!: boolean;
  arrowLeftLabel!: string;
  arrowRightLabel!: string;
  type!: string;
  startAt!: number;
  perView!: number;
  focusAt!: number | string;
  gap!: number;
  autoplay!: number | boolean;
  hoverpause!: boolean;
  keyboard!: boolean;
  bound!: boolean;
  swipeThreshold!: number | boolean;
  dragThreshold!: number | boolean;
  perTouch!: number | boolean;
  touchRatio!: number;
  touchAngle!: number;
  animationDuration!: number;
  rewind!: boolean;
  rewindDuration!: number;
  animationTimingFunc!: string;
  direction!: string;
  classes!: object;
  isCenter!: boolean;
  isAutoplay!: boolean;
  isSwipeThreshold!: boolean;
  isDragThreshold!: boolean;
  isPerTouch!: boolean;
  breakpoints: Object;
  peek: number | Object;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.showCustomArrows = true;
    this.showArrows = true;
    this.showBullets = true;
    this.arrowLeftLabel = 'left';
    this.arrowRightLabel = 'right';
    this.type = 'carousel';
    this.startAt = 0;
    this.perView = 5;
    this.isCenter = false;
    this.focusAt = 0;
    this.gap = 10;
    this.peek = { before: 50, after: 50 };

    this.autoplay = 1000;
    this.hoverpause = true;
    this.keyboard = true;
    this.bound = false;

    this.swipeThreshold = 80;

    this.dragThreshold = 120;

    this.perTouch = 3;
    this.touchRatio = 0.5;
    this.touchAngle = 45;
    this.animationDuration = 400;
    this.rewind = true;
    this.rewindDuration = 800;
    this.animationTimingFunc = 'cubic-bezier(0.165, 0.840, 0.440, 1.000)';
    this.direction = 'ltr';

    this.breakpoints = {
      '440': { perView: 1 },
      '576': { perView: 2 },
      '768': { perView: 2 },
      '992': { perView: 3 },
      '1200': { perView: 4 },
    };
  }
}


/* Parameters vor Component

        (mountedBefore)="onMountedBefore()"
        (mountedAfter)="onMountedAfter()"
        (updated)="onUpdated()"
        (played)="onPlayed()"
        (paused)="onPaused()"
        (buildedBefore)="onBuildedBefore()"
        (buildedAfter)="onBuildedAfter()"
        (ranBefore)="onRanBefore($event)"
        (ran)="onRan($event)"
        (ranAfter)="onRanAfter($event)"
        (ranOffset)="onRanOffset($event)"
        (runStarted)="onRunStarted($event)"
        (runEnded)="onRunEnded($event)"
        (moved)="onMoved($event)"
        (movedAfter)="onMovedAfter($event)"
        (resized)="onResized()"
        (swipeStarted)="onSwipeStarted()"
        (swipeMoved)="onSwipeMoved()"
        (swipeEnded)="onSwipeEnded()"
        (translateJumped)="onTranslateJumped($event)"

*/

export interface CourseSliderEvents {
  recreate(): void; //Only in version12

  onMountedBefore(): void;

  onMountedAfter(): void;

  onUpdated(): void;

  onPlayed(): void;

  onPaused(): void;

  onBuildedBefore(): void;

  onBuildedAfter(): void;

  onRanBefore(move: object): void;

  onRan(move: object): void;

  onRanAfter(move: object): void;

  onRanOffset(move: object): void;

  onRunStarted(move: object): void;

  onRunEnded(move: object): void;

  onMoved(movement: object): void;

  onMovedAfter(movement: object): void;

  onResized(): void;

  onSwipeStarted(): void;

  onSwipeMoved(): void;

  onSwipeEnded(): void;

  onTranslateJumped(movement: object): void;
}
