import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
  signal,
  ViewChild,
} from "@angular/core";
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, merge, Subscription, tap } from "rxjs";
import { ensureAngleInRange, isInsideCircle } from "./circle-operations";
import { Point, pointsMatch } from "../models/point.model";
import { domCommon } from "../common/common-funcs";
import { compassDrawing } from "./orientation-drawing";
import { GRADIENT_STATE_TOKEN, GradientOrientationState } from "../models/gradient-state.model";

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

  private state: GradientOrientationState = inject(GRADIENT_STATE_TOKEN);

  private anglesInDegrees = computed(() => this.state.angleDegrees());

  private presetAngles: { angle: number; point: Point }[] = [];

  private shiftPressed = signal(false);
  private drawing: compassDrawing | null = null;

  handler = signal(false);
  overPreset = signal<number | null>(null);
  inside = signal(false);
  size = input(100);
  darkMode = input(false);

  radius = computed(() => Math.round(this.size() / 2));

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;
  canvasRealSize: number = 0;

  get canvasElement(): HTMLCanvasElement {
    return this.canvas?.nativeElement!;
  }

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
      this.dibujar(this.anglesInDegrees(), this.handler(), this.darkMode(), this.overPreset());
    });
  }

  ngAfterViewInit() {
    this.createPresetAngles();
    this.subcribeToEvents();

    this.drawing = new compassDrawing(
      this.canvas!.nativeElement.getContext("bitmaprenderer") as ImageBitmapRenderingContext,
      this.size(),
      { x: this.size() / 2, y: this.size() / 2 }
    );

    this.canvasRealSize = this.realSize();

    this.dibujar(this.anglesInDegrees());
  }

  private subcribeToEvents() {
    this.moveSubscription = merge(
      fromEvent(document, "mousemove").pipe(map((event) => event as MouseEvent)),
      fromEvent(document, "touchmove", { passive: false }).pipe(map((event) => event as TouchEvent))
    )
      .pipe(
        filter(() => this.handler()),
        tap((event) => event.preventDefault()),
        debounceTime(1),
        map((event) => this.angleDegreesFromPoint(this.pointFromEvent(event))),
        map((angleDegrees) => this.calculateAngleMovement(angleDegrees)),
        distinctUntilChanged()
      )
      .subscribe((angle) => {
        this.state.onAngleDegreesChange(angle);
      });

    const movement = fromEvent(this.canvasElement, "mousemove").pipe(
      map((event) => event as MouseEvent),
      filter(() => !this.handler()),
      tap((event) => event.preventDefault()),
      debounceTime(1),
      map((event) => {
        const radio = this.radius();
        const point = this.pointFromEvent(event);
        const insideRadio = Math.round(radio * this.radioSizeRatio);

        const inside = isInsideCircle(insideRadio, { x: point.x - radio, y: point.y - radio }, 3);
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
      fromEvent(this.canvasElement, "mouseleave").pipe(
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
      fromEvent(this.canvasElement, "mousedown").pipe(
        filter(() => this.inside() || this.overPreset() !== null),
        map((event) => event as MouseEvent)
      ),
      fromEvent(this.canvasElement, "touchstart", { passive: false }).pipe(map((event) => event as TouchEvent))
    )
      .pipe(
        filter(() => !this.handler()),
        tap((event) => event.preventDefault()),
        debounceTime(1),
        map((event) => this.pointFromEvent(event))
      )
      .subscribe((point) => {
        this.onGrabHandler(point);
      });
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
      if (pointsMatch(preset.point, point, 14)) {
        if (preset.angle !== this.anglesInDegrees()) {
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
    const radio = this.radius();

    const deltaX = (point.x - radio) / radio;
    const deltaY = (point.y - radio) / radio;

    if (Math.abs(deltaX) < 0.1 && Math.abs(deltaY) < 0.1) {
      return this.anglesInDegrees();
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
    const currentAngle = this.anglesInDegrees();
    const movement = Math.min(this.maxMovement, Math.abs(currentAngle - newAngleDegrees));
    let distancia =
      currentAngle - newAngleDegrees > 180
        ? movement
        : currentAngle - newAngleDegrees < -180
        ? -movement
        : currentAngle < newAngleDegrees
        ? movement
        : -movement;

    return ensureAngleInRange(currentAngle + distancia);
  }

  private setListeners() {
    this.removeDocumentClickListenerFn = this.renderer.listen("document", "mouseup", () => this.stopTracking());
    this.removeDocumentClickListenerFn = this.renderer.listen("document", "touchend", () => this.stopTracking(), {
      passive: true,
    });
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

  private dibujar(
    angleDegrees: number,
    active: boolean = false,

    darkMode: boolean = this.darkMode(),
    overPreset: number | null = this.overPreset()
  ) {
    if (!this.drawing) {
      return;
    }
    const compass = this.drawing;

    requestAnimationFrame(() => {
      compass.draw(overPreset, angleDegrees, active, darkMode);
    });
  }

  private pointFromEvent(event: MouseEvent | TouchEvent): Point {
    const canvasPoint = domCommon.pointFromEvent(this.canvasElement, event);

    return { x: canvasPoint.x, y: this.canvasRealSize - canvasPoint.y };
  }
  private realSize(): number {
    const el = this.canvasElement;
    const style = window.getComputedStyle(el);
    const padding = parseFloat(style.paddingBottom.replace("px", "")) || 0;
    const canvasPadding = 2 * padding;
    const rect = el.getBoundingClientRect();

    return rect.bottom - rect.top - canvasPadding;
  }

  ngOnDestroy() {
    this.removeDocumentClickListenerFn?.();
    this.removeDocumentTouchEndListenerFn?.();

    this.canvasMoveSubscription?.unsubscribe();
    this.moveSubscription?.unsubscribe();
    this.grabHandlerSubscription?.unsubscribe();
  }
}
