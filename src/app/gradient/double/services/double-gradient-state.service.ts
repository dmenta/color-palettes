import { computed, effect, inject, Injectable, Signal, signal } from "@angular/core";
import { doubleGradientConfig } from "../double-bezier-panel/double-bezier-config";
import { StorageService } from "../../../core/service/storage.service";
import { DoubleGradientStateValues } from "../models/gradient-state-values";
import { Point } from "../../common/models/point.model";
import { toOklch } from "../../../color/model/color";
import { bezierCurve } from "../../common/bezier-curve";
import { doubleGradientStops, gradientString } from "../../common/gradient-stops";
import { ColorValues } from "../../../color/model/colors.model";
import { DoubleHandlers } from "../models/double-handlers.model";
import { GradientColors, GradientOrientationState } from "../../common/models/gradient-state.model";
import { GradientDefinition } from "../../common/models/gradient";
import { doubleGradientStates } from "../models/default-gradient-state";

@Injectable({
  providedIn: "root",
})
export class DoubleGradientStateService implements GradientOrientationState, GradientColors {
  private store = inject(StorageService);

  private initialState =
    this.store.get<DoubleGradientStateValues>("double-gradient-state") ?? doubleGradientStates.default;

  angleDegrees = signal<number>(this.initialState.angle);

  startRGBColor = signal(this.initialState.colors.start);
  centerRGBColor = signal(this.initialState.colors.center);
  endRGBColor = signal(this.initialState.colors.end);

  center = signal<Point>(this.initialState.center);
  handlers = signal(this.initialState.handlers);

  private startOklch = computed(() => toOklch(this.rgbText(this.startRGBColor())));
  private centerOklch = computed(() => toOklch(this.rgbText(this.centerRGBColor())));
  private endOklch = computed(() => toOklch(this.rgbText(this.endRGBColor())));
  points = computed(() => bezierCurve.doublePoints(this.handlers(), this.center(), doubleGradientConfig.virtualSize));

  startColor = computed(() => this.oklchText(this.startOklch()));
  centerColor = computed(() => this.oklchText(this.centerOklch()));

  endColor = computed(() => this.oklchText(this.endOklch()));

  gradient: Signal<GradientDefinition> = computed(() =>
    doubleGradientStops(this.startOklch(), this.centerOklch(), this.endOklch(), this.points!(), this.angleDegrees())
  );

  controlGradient: Signal<string> = computed(() => gradientString(this.gradient().stops, 90, "oklch"));

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
    this.handlers.set({ ...(handlers as DoubleHandlers) });
  }

  private rgbText(rgb: ColorValues): string {
    return `rgb(${Math.round(rgb[0])} ${Math.round(rgb[1])} ${Math.round(rgb[2])})`;
  }
  private oklchText(lch: ColorValues): string {
    return `oklch(${lch[0].toFixed(3)} ${lch[1].toFixed(3)} ${lch[2].toFixed(1)})`;
  }
}
