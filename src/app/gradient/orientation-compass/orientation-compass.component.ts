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
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, merge, Subscription, tap } from "rxjs";

@Component({
  selector: "zz-orientation-compass",
  imports: [],
  templateUrl: "./orientation-compass.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrientationCompassComponent {
  private readonly maxMovement = 12; // Maximum movement in degrees when not holding control
  private readonly radioSizeRatio = 0.7; // Ratio for the size of the compass grid
  private readonly presetSizeRatio = 0.9; // Ratio for the size of the compass grid
  private canvasMoveSubscription: Subscription | null = null;
  private moveSubscription: Subscription | null = null;
  private grabHandlerSubscription: Subscription | null = null;
  private removeDocumentClickListenerFn: (() => void) | null = null;
  private removeDocumentTouchEndListenerFn: (() => void) | null = null;

  private state = inject(GradientStateService);

  private presetAngles: { angle: number; point: Point }[] = [];

  private shiftPressed = signal(false);
  private canvasContext: ImageBitmapRenderingContext | null = null;

  handler = signal(false);
  overPreset = signal<number | null>(null);
  inside = signal(false);
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
    this.createPresetAngles();
    this.subcribeToEvents();

    this.dibujar(this.state.angleDegrees());
  }
  private createPresetAngles() {
    const radius = Math.round((this.size() * this.presetSizeRatio) / 2);
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
  }

  private subcribeToEvents() {
    this.moveSubscription = merge(
      fromEvent(document, "mousemove"),
      fromEvent(document, "touchmove", { passive: false })
    )
      .pipe(
        filter(() => this.handler()),
        tap((event) => event.preventDefault()),
        debounceTime(1),
        map((event) => this.angleDegreesFromPoint(this.pointFromEvent(event as MouseEvent | TouchEvent))),
        map((angleDegrees) => this.calculateAngleMovement(angleDegrees)),
        distinctUntilChanged()
      )
      .subscribe((angle) => {
        this.state.onAngleDegreesChange(angle);
      });

    const movement = fromEvent(this.canvas?.nativeElement!, "mousemove").pipe(
      filter(() => !this.handler()),
      tap((event) => event.preventDefault()),
      debounceTime(1),
      map((event) => {
        const point = this.pointFromEvent(event as MouseEvent | TouchEvent);
        const insideRadio = Math.round((this.size() / 2) * this.radioSizeRatio);

        const inside = this.isInsideCircle(
          insideRadio,
          { x: point.x - this.size() / 2, y: point.y - this.size() / 2 },
          3
        );
        if (inside) {
          return { inside: true, preset: null };
        } else {
          const overPreset = this.isOverPreset(point);
          return { inside: false, preset: overPreset };
        }
      })
    );

    this.canvasMoveSubscription = merge(
      movement,
      fromEvent(this.canvas?.nativeElement!, "mouseleave").pipe(
        tap((event) => event.preventDefault()),
        map(() => ({ inside: false, preset: null }))
      )
    )
      .pipe(distinctUntilChanged((prev, curr) => prev.inside === curr.inside && prev.preset === curr.preset))
      .subscribe((status) => {
        this.inside.set(status.inside);
        this.overPreset.set(status.preset);
      });

    this.grabHandlerSubscription = merge(
      fromEvent(this.canvas?.nativeElement!, "mousedown"),
      fromEvent(this.canvas?.nativeElement!, "touchstart", { passive: false })
    )
      .pipe(
        filter(() => !this.handler() && (this.inside() || this.overPreset() !== null)),
        tap((event) => event.preventDefault()),
        debounceTime(1),
        map((event) => this.pointFromEvent(event as MouseEvent | TouchEvent))
      )
      .subscribe((point) => {
        this.onGrabHandler(point);
      });
  }

  /**
   *
   * @param radio
   * @param point
   * @param tolerance
   * @returns a boolean indicating if the point is inside the circle defined by the radio and center at (0,0).
   * The tolerance is used to allow a small margin of error when checking if the point is inside the circle.
   * The point is considered inside the circle if the distance from the center to the point is less than or equal to the radio minus the tolerance.
   */
  private isInsideCircle(radio: number, point: Point, tolerance: number = 3): boolean {
    const realRadio = Math.round(radio);
    const deltaX = Math.abs(point.x);
    const deltaY = Math.abs(point.y);
    const hypotenuse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const inside = hypotenuse - tolerance <= realRadio;

    return inside;
  }

  onDoubleClick(_event: MouseEvent) {
    this.state.onAngleDegreesChange(0);
  }

  onGrabHandler(point: Point): void {
    const presetAngle = this.isOverPreset(point);
    if (presetAngle !== null) {
      this.state.onAngleDegreesChange(presetAngle);
      return;
    }
    this.setHandlerSelected();
  }

  private isOverPreset(point: Point): number | null {
    if (this.inside()) {
      return null;
    }
    for (const preset of this.presetAngles) {
      if (pointsMatch(preset.point, point, 10)) {
        if (preset.angle !== this.state.angleDegrees()) {
          return preset.angle;
        } else {
          return null;
        }
      }
    }
    return null;
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

    return angleDegrees;
  }

  private calculateAngleMovement(newAngleDegrees: number): number {
    if (this.shiftPressed()) {
      return Math.round(newAngleDegrees / 45) * 45;
    }
    const currentAngle = this.state.angleDegrees();
    const movement = Math.min(this.maxMovement, Math.abs(currentAngle - newAngleDegrees));
    let distancia =
      currentAngle - newAngleDegrees > 180
        ? movement
        : currentAngle - newAngleDegrees < -180
        ? -movement
        : currentAngle < newAngleDegrees
        ? movement
        : -movement;

    return this.ensureAngleInRange(currentAngle + distancia);
  }

  private ensureAngleInRange(angleInDegrees: number): number {
    return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees >= 360 ? angleInDegrees - 360 : angleInDegrees;
  }

  private setListeners() {
    this.removeDocumentClickListenerFn = this.renderer.listen("document", "mouseup", () => this.stopTracking());
    this.removeDocumentClickListenerFn = this.renderer.listen("document", "touchend", () => this.stopTracking(), {
      passive: true,
    });
  }

  private dibujar(
    angleDegrees: number,
    active: boolean = false,
    size: number = this.size(),
    darkMode: boolean = this.darkMode(),
    overPreset: number | null = this.overPreset()
  ) {
    if (!this.canvas) {
      return;
    }
    if (this.canvasContext === null) {
      this.canvasContext = this.canvas.nativeElement.getContext("bitmaprenderer");
    }

    const ctx = this.canvasContext!;

    requestAnimationFrame(() => {
      drawCompass(ctx, angleDegrees, size, this.radioSizeRatio, this.presetSizeRatio, overPreset, active, darkMode);
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

    this.canvasMoveSubscription?.unsubscribe();
    this.moveSubscription?.unsubscribe();
    this.grabHandlerSubscription?.unsubscribe();
  }
}
