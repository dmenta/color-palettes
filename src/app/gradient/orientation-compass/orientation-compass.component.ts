import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
  signal,
  ViewChild,
} from "@angular/core";
import { pointFromCanvas } from "../bezier-panel/bezier-panel-drawing";
import { Point } from "../models/bezier-curve";
import { GradientStateService } from "../services/gradient-state.service";
import { drawCompass } from "./compass-drawing";
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, Subscription } from "rxjs";

@Component({
  selector: "zz-orientation-compass",
  imports: [],
  templateUrl: "./orientation-compass.component.html",
})
export class OrientationCompassComponent {
  private readonly maxMovement = 12; // Maximum movement in degrees when not holding control
  private mouseMoveSubscription: Subscription | null = null;

  private removeDocumentClickListenerFn: (() => void) | null = null;
  private removeMouseLeaveListenerFn: (() => void) | null = null;
  private removeMouseEnterListenerFn: (() => void) | null = null;

  private lastTimeoutId: number | null = null;

  private state = inject(GradientStateService);

  handler = signal(false);
  size = input(100);
  darkMode = input(false);
  shiftPressed = signal(false);

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;
  canvasContext: ImageBitmapRenderingContext | null = null;

  @HostListener("window:keydown.shift", ["$event"])
  onControlKeyDown(event: KeyboardEvent) {
    if (!this.shiftPressed()) {
      this.shiftPressed.set(true);
      event.preventDefault();
    }
  }

  @HostListener("window:keyup.shift", ["$event"])
  onControlKeyUp(event: KeyboardEvent) {
    if (this.shiftPressed()) {
      this.shiftPressed.set(false);
      event.preventDefault();
    }
  }

  constructor(private renderer: Renderer2) {
    effect(() => {
      this.dibujar(this.state.angleDegrees(), this.handler(), this.size(), this.darkMode());
    });
  }

  ngAfterViewInit() {
    this.mouseMoveSubscription = fromEvent(this.canvas!.nativeElement, "mousemove")
      .pipe(
        filter(() => this.handler()),
        debounceTime(1),
        map((event) => this.angleDegreesFromPoint(this.pointFromEvent(event as MouseEvent))),
        map((angle) => (this.shiftPressed() ? Math.round(angle / 45) * 45 : angle)),
        distinctUntilChanged()
      )
      .subscribe((angle) => {
        this.state.onAngleDegreesChange(angle);
      });

    this.dibujar(this.state.angleDegrees());
  }

  onDoubleClick(_event: MouseEvent) {
    this.state.onAngleDegreesChange(0);
  }

  onMouseDown(_event: MouseEvent): void {
    this.setHandlerSelected();
  }

  private setStopTimeout() {
    this.clearStopTimeout();
    this.lastTimeoutId = window.setTimeout(() => this.stopTracking(), 1000);
  }

  private clearStopTimeout() {
    if (this.lastTimeoutId) {
      window.clearTimeout(this.lastTimeoutId);
      this.lastTimeoutId = null;
    }
  }

  private stopTracking() {
    if (this.handler() !== null) {
      this.removeDocumentClickListenerFn?.();
      this.removeMouseLeaveListenerFn?.();
      this.removeMouseEnterListenerFn?.();

      this.handler.set(false);
      this.clearStopTimeout();
    }
  }

  private setHandlerSelected() {
    this.setListeners();

    this.handler.set(true);
  }

  private angleDegreesFromPoint(point: Point) {
    const radio = Math.round(this.size() / 2);

    const deltaX = (point.x - radio) / radio;
    const deltaY = (point.y - radio) / radio;

    if (Math.abs(deltaX) < 0.1 && Math.abs(deltaY) < 0.1) {
      return this.state.angleDegrees();
    }

    const angle = Math.atan2(deltaX, deltaY);
    let angleDegrees = Math.round((angle * 180) / Math.PI);
    if (angleDegrees < 0) {
      angleDegrees += 360;
    }

    let newAngle = angleDegrees;

    if (!this.shiftPressed()) {
      const currentAngle = this.state.angleDegrees();
      const movement = Math.min(this.maxMovement, Math.abs(currentAngle - angleDegrees));
      let distancia =
        currentAngle - angleDegrees > 180
          ? movement
          : currentAngle - angleDegrees < -180
          ? -movement
          : currentAngle < angleDegrees
          ? movement
          : -movement;
      newAngle = currentAngle + distancia;
    }

    return newAngle < 0 ? newAngle + 360 : newAngle >= 360 ? newAngle - 360 : newAngle;
  }

  private setListeners() {
    this.removeDocumentClickListenerFn = this.renderer.listen("document", "mouseup", () => {
      if (this.handler()) {
        this.stopTracking();
      }
    });
    this.removeMouseLeaveListenerFn = this.renderer.listen(this.canvas!.nativeElement, "mouseleave", () => {
      if (this.handler() === null) {
        return;
      }
      this.setStopTimeout();
    });
    this.removeMouseEnterListenerFn = this.renderer.listen(this.canvas!.nativeElement, "mouseenter", () => {
      if (this.handler() !== null) {
        this.clearStopTimeout();
      }
    });
  }

  private dibujar(
    angleDegrees: number,
    active: boolean = false,
    size: number = this.size(),
    darkMode: boolean = this.darkMode()
  ) {
    if (!this.canvas) {
      return;
    }
    if (this.canvasContext === null) {
      this.canvasContext = this.canvas.nativeElement.getContext("bitmaprenderer");
    }

    const ctx = this.canvasContext!;

    requestAnimationFrame(() => {
      drawCompass(ctx, angleDegrees, size, active, darkMode);
    });
  }

  private pointFromEvent(event: MouseEvent): Point {
    const el = this.canvas?.nativeElement;
    if (!el) {
      return { x: 0, y: 0 };
    }

    const style = window.getComputedStyle(el);

    const padding = parseFloat(style.paddingLeft.replace("px", "")) || 0;
    const canvasPadding = padding * 2;

    const rect = el.getBoundingClientRect();
    const size = rect.bottom - rect.top - canvasPadding;

    return pointFromCanvas({ x: event.clientX - rect.left - padding, y: event.clientY - rect.top - padding }, size);
  }

  ngOnDestroy() {
    this.removeDocumentClickListenerFn?.();
    this.removeMouseLeaveListenerFn?.();
    this.removeMouseEnterListenerFn?.();

    this.clearStopTimeout();

    this.mouseMoveSubscription?.unsubscribe();
  }
}
