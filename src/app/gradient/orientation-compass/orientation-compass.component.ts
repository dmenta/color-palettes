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
  private mouseMoveSubscription: Subscription | null = null;

  private removeDocumentClickListenerFn: (() => void) | null = null;
  private removeMouseLeaveListenerFn: (() => void) | null = null;
  private removeMouseEnterListenerFn: (() => void) | null = null;

  private lastTimeoutId: number | null = null;

  private state = inject(GradientStateService);

  handler = signal(false);
  size = input(100);
  darkMode = input(false);
  controlPressed = signal(false);

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;
  canvasContext: ImageBitmapRenderingContext | null = null;

  @HostListener("window:keydown.control", ["$event"])
  onControlKeyDown(event: KeyboardEvent) {
    if (!this.controlPressed()) {
      this.controlPressed.set(true);
      event.preventDefault();
    }
  }

  @HostListener("window:keyup.control", ["$event"])
  onControlKeyUp(event: KeyboardEvent) {
    if (this.controlPressed()) {
      this.controlPressed.set(false);
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
        map((angle) => (this.controlPressed() ? Math.round(angle / 45) * 45 : angle)),
        distinctUntilChanged()
      )
      .subscribe((angle) => {
        this.state.onAngleDegreesChange(angle);
        console.log("Angle updated:", angle);
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

    if (Math.abs(deltaX) < 0.3 && Math.abs(deltaY) < 0.3) {
      return this.state.angleDegrees();
    }

    const angle = Math.atan2(deltaX, deltaY);
    const angleDegrees = Math.round((angle * 180) / Math.PI);

    let newAngle = angleDegrees;

    if (!this.controlPressed()) {
      const currentAngle = this.state.angleDegrees();
      let distancia = Math.abs(currentAngle - angleDegrees);
      if (Math.abs(distancia) > 180) {
        distancia = 360 - Math.abs(distancia);
        newAngle = Math.min(currentAngle, angleDegrees) - distancia / 15;
      } else {
        newAngle = Math.min(currentAngle, angleDegrees) + distancia / 15;
      }
    }

    return newAngle < 0 ? newAngle + 360 : newAngle > 360 ? newAngle - 360 : newAngle;
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

  /*
  220 a 360 first
0 a 15 first
15 a 180 last
180 a 220 mid*/

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
