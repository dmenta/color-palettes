import { computed, effect, inject, Injectable, Signal, signal } from "@angular/core";
import { StorageService } from "../../core/service/storage.service";
import { DoubleGradientStateValues } from "../models/gradient-state-values";
import { ColorValues } from "../../color/model/colors.model";
import { bezierPoints, Point } from "../models/bezier-curve";
import { GradientDefinition, gradientFromPoints } from "../models/gradient-points";
import { toOklch } from "../../color/model/color";
import { defaultDoubleGradientState } from "../models/default-gradient-state";
import { DoubleHandlers } from "../double-bezier-panel/double-bezier-curve";

@Injectable({
  providedIn: "root",
})
export class DoubleGradientStateService {
  private store = inject(StorageService);

  private initialState =
    this.store.get<DoubleGradientStateValues>("double-gradient-state") ?? defaultDoubleGradientState;

  angleDegrees = signal<number>(this.initialState.angle);

  startRGBColor = signal(this.initialState.colors.start);
  centerRGBColor = signal(this.initialState.colors.center);
  endRGBColor = signal(this.initialState.colors.end);

  center = signal<Point>(this.initialState.center);
  handlers = signal(this.initialState.handlers);

  private startOklch = computed(() => toOklch(this.rgbText(this.startRGBColor())));
  private endOklch = computed(() => toOklch(this.rgbText(this.endRGBColor())));
  private points = computed(() => bezierPoints(this.handlers()));

  startColor = computed(() => this.oklchText(this.startOklch()));
  endColor = computed(() => this.oklchText(this.endOklch()));

  gradient: Signal<GradientDefinition> = computed(() =>
    gradientFromPoints(this.startOklch(), this.endOklch(), this.points!(), this.angleDegrees())
  );

  private readonly currentState = computed(() => {
    return {
      colors: {
        start: this.startRGBColor(),
        center: this.centerRGBColor(),
        end: this.endRGBColor(),
      },
      center: this.center(),
      handlers: this.handlers(),
      angle: this.angleDegrees(),
    };
  });

  constructor() {
    effect(() => this.store.save("double-gradient-state", this.currentState()));
  }

  onAngleDegreesChange(angle: number) {
    this.angleDegrees.set(angle);
  }

  onStartColorChange(color: ColorValues) {
    this.startRGBColor.set(color);
  }
  onCenterColorChange(color: ColorValues) {
    this.centerRGBColor.set(color);
  }

  onEndColorChange(color: ColorValues) {
    this.endRGBColor.set(color);
  }

  onCenterChange(point: Point) {
    this.center.set(point);
  }

  onHandlersChange(handlers: DoubleHandlers) {
    this.handlers.set({ ...handlers });
  }

  private rgbText(rgb: ColorValues): string {
    return `rgb(${Math.round(rgb[0])} ${Math.round(rgb[1])} ${Math.round(rgb[2])})`;
  }
  private oklchText(lch: ColorValues): string {
    return `oklch(${lch[0].toFixed(3)} ${lch[1].toFixed(3)} ${lch[2].toFixed(1)})`;
  }
}
