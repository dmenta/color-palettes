import {
  ChangeDetectionStrategy,
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
import { Point, pointsMatch } from "../models/bezier-curve";
import { GradientStateService } from "../services/gradient-state.service";
import { drawCompass } from "./compass-drawing";
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, Subscription, tap } from "rxjs";

@Component({
  selector: "zz-orientation-compass",
  imports: [],
  templateUrl: "./orientation-compass.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrientationCompassComponent {
  private readonly maxMovement = 12; // Maximum movement in degrees when not holding control
  private mouseMoveSubscription: Subscription | null = null;
  private touchMoveSubscription: Subscription | null = null;
  private touchStartSubscription: Subscription | null = null;
  private removeDocumentClickListenerFn: (() => void) | null = null;
  private removeDocumentTouchEndListenerFn: (() => void) | null = null;

  private state = inject(GradientStateService);

  private presetAngles: { angle: number; point: Point }[] = [];

  private shiftPressed = signal(false);
  private canvasContext: ImageBitmapRenderingContext | null = null;

  handler = signal(false);
  size = input(100);
  darkMode = input(false);

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;

  @HostListener("window:keydown.shift", ["$event"])
  onShiftKeyDown(event: KeyboardEvent) {
    if (!this.shiftPressed()) {
      this.shiftPressed.set(true);
      event.preventDefault();
    }
  }

  @HostListener("window:keyup.shift", ["$event"])
  onShiftKeyUp(event: KeyboardEvent) {
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
    this.mouseMoveSubscription = fromEvent(document, "mousemove")
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

    this.touchStartSubscription = fromEvent(this.canvas?.nativeElement!, "touchstart", { passive: false })
      .pipe(
        filter(() => !this.handler()),
        tap((event) => event.preventDefault()),
        debounceTime(1),
        map((event) => this.pointFromEvent(event as TouchEvent)),
        filter((point) => !this.checkPreset(point))
      )
      .subscribe(() => {
        this.setHandlerSelected();
      });

    this.touchMoveSubscription = fromEvent(document, "touchmove", { passive: false })
      .pipe(
        filter(() => this.handler()),
        tap((event) => event.preventDefault()),
        debounceTime(1),
        map((event) => this.angleDegreesFromPoint(this.pointFromEvent(event as TouchEvent))),
        map((angle) => (this.shiftPressed() ? Math.round(angle / 45) * 45 : angle)),
        distinctUntilChanged()
      )
      .subscribe((angle) => {
        this.state.onAngleDegreesChange(angle);
      });

    const radius = Math.round((this.size() * 0.84) / 2);
    const center = Math.round(this.size() / 2);
    const is45 = radius * 0.7071;

    this.presetAngles.push({ angle: 0, point: { x: center, y: center + radius } });
    this.presetAngles.push({ angle: 45, point: { x: center + is45, y: center + is45 } });
    this.presetAngles.push({ angle: 90, point: { x: center + radius, y: center } });
    this.presetAngles.push({ angle: 135, point: { x: center + is45, y: center - is45 } });
    this.presetAngles.push({ angle: 180, point: { x: center, y: center - radius } });
    this.presetAngles.push({ angle: 225, point: { x: center - is45, y: center - is45 } });
    this.presetAngles.push({ angle: 270, point: { x: center - radius, y: center } });
    this.presetAngles.push({ angle: 315, point: { x: center - is45, y: center + is45 } });

    this.dibujar(this.state.angleDegrees());
  }

  onDoubleClick(_event: MouseEvent) {
    this.state.onAngleDegreesChange(0);
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.checkPreset(this.pointFromEvent(event))) {
      this.setHandlerSelected();
    }
  }

  private checkPreset(point: Point) {
    for (const preset of this.presetAngles) {
      if (pointsMatch(preset.point, point, 7)) {
        if (preset.angle !== this.state.angleDegrees()) {
          this.state.onAngleDegreesChange(preset.angle);
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  private stopTracking() {
    if (this.handler() !== null) {
      this.removeDocumentClickListenerFn?.();
      this.removeDocumentTouchEndListenerFn?.();

      this.handler.set(false);
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
    this.removeDocumentClickListenerFn = this.renderer.listen("document", "touchend", () => {
      if (this.handler()) {
        this.stopTracking();
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

  private pointFromEvent(event: MouseEvent | TouchEvent): Point {
    const el = this.canvas?.nativeElement;
    if (!el) {
      return { x: 0, y: 0 };
    }

    const style = window.getComputedStyle(el);

    const padding = parseFloat(style.paddingLeft.replace("px", "")) || 0;
    const canvasPadding = padding * 2;

    const rect = el.getBoundingClientRect();
    const size = rect.bottom - rect.top - canvasPadding;

    if (event instanceof TouchEvent) {
      if (event.touches.length === 0) {
        return { x: 0, y: 0 };
      }
      const touch = event.touches[0];
      return {
        x: touch!.clientX - rect.left - padding,
        y: size - (touch!.clientY - rect.top - padding),
      };
    } else {
      return {
        x: event.clientX - rect.left - padding,
        y: size - (event.clientY - rect.top - padding),
      };
    }
  }

  ngOnDestroy() {
    this.removeDocumentClickListenerFn?.();
    this.removeDocumentTouchEndListenerFn?.();

    this.mouseMoveSubscription?.unsubscribe();
    this.touchMoveSubscription?.unsubscribe();
    this.touchStartSubscription?.unsubscribe();
  }
}
