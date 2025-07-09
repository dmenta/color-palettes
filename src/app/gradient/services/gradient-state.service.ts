import { computed, effect, inject, Injectable, Signal, signal } from "@angular/core";
import { StorageService } from "../../core/service/storage.service";
import { defaultGradientState } from "../models/default-gradient-state";
import { GradientStateValues } from "../models/gradient-state-values";
import { ColorValues } from "../../color/model/colors.model";
import { GradientDefinition, gradientFromPoints } from "../models/gradient-stops";
import { toOklch } from "../../color/model/color";
import { virtualSize } from "../bezier-panel/bezier-panel-drawing";
import { GradientState } from "./gradient-state.model";
import { bezierCurve } from "../common/bezier-curve";
import { DoubleHandlers } from "../models/double-handlers.model";

@Injectable({
  providedIn: "root",
})
export class GradientStateService implements GradientState {
  private store = inject(StorageService);

  private initialState = this.store.get<GradientStateValues>("gradient-state") ?? defaultGradientState;

  angleDegrees = signal<number>(this.initialState.angle);

  startRGBColor = signal(this.initialState.colors.start);
  endRGBColor = signal(this.initialState.colors.end);

  handlers = signal(this.initialState.handlers);

  private startOklch = computed(() => toOklch(this.rgbText(this.startRGBColor())));
  private endOklch = computed(() => toOklch(this.rgbText(this.endRGBColor())));
  private points = computed(() => bezierCurve.points(this.handlers(), virtualSize, virtualSize));

  startColor = computed(() => this.oklchText(this.startOklch()));
  endColor = computed(() => this.oklchText(this.endOklch()));

  gradient: Signal<GradientDefinition> = computed(() =>
    gradientFromPoints(this.startOklch(), this.endOklch(), this.points!(), this.angleDegrees())
  );

  private readonly currentState = computed(() => {
    return {
      colors: {
        start: this.startRGBColor(),
        end: this.endRGBColor(),
      },
      handlers: this.handlers(),
      angle: this.angleDegrees(),
    };
  });

  constructor() {
    effect(() => this.store.save("gradient-state", this.currentState()));
  }

  onAngleDegreesChange(angle: number) {
    this.angleDegrees.set(angle);
  }

  onStartColorChange(color: ColorValues) {
    this.startRGBColor.set(color);
  }

  onEndColorChange(color: ColorValues) {
    this.endRGBColor.set(color);
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
