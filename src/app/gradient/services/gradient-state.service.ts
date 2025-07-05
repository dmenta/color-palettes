import { computed, effect, inject, Injectable, Signal, signal } from "@angular/core";
import { StorageService } from "../../core/service/storage.service";
import { defaultGradientState } from "../models/default-gradient-state";
import { GradientStateValues } from "../models/gradient-state-values";
import { GradientOrientation } from "../models/orientations";
import { ColorValues } from "../../color/model/colors.model";
import { bezierPoints, Handlers } from "../models/bezier-curve";
import { GradientDefinition, gradientFromPoints } from "../models/gradient-points";
import { toOklch } from "../../color/model/color";

@Injectable({
  providedIn: "root",
})
export class GradientStateService {
  private store = inject(StorageService);

  private initialState = this.store.get<GradientStateValues>("gradient-state") ?? defaultGradientState;

  orientation = signal<GradientOrientation>(this.initialState.orientation);

  sourceColor = signal(this.initialState.colors.source);
  destinationColor = signal(this.initialState.colors.destination);

  handlers = signal(this.initialState.handlers);

  private sourceOklch = computed(() => toOklch(this.rgbText(this.sourceColor())));
  private destinationOklch = computed(() => toOklch(this.rgbText(this.destinationColor())));
  private points = computed(() => bezierPoints(this.handlers()));

  gradient: Signal<GradientDefinition> = computed(() =>
    gradientFromPoints(this.sourceOklch(), this.destinationOklch(), this.points!(), this.orientation())
  );

  private readonly currentState = computed(() => {
    return {
      colors: {
        source: this.sourceColor(),
        destination: this.destinationColor(),
      },
      handlers: this.handlers(),
      orientation: this.orientation(),
    };
  });

  constructor() {
    effect(() => this.store.save("gradient-state", this.currentState()));
  }

  onOrientationChange(orientation: GradientOrientation) {
    this.orientation.set(orientation);
  }

  onSourceColorChange(color: ColorValues) {
    this.sourceColor.set(color);
  }

  onDestinationColorChange(color: ColorValues) {
    this.destinationColor.set(color);
  }

  onHandlersChange(handlers: Handlers) {
    this.handlers.set({ ...handlers });
  }

  private rgbText(rgb: ColorValues): string {
    return `rgb(${Math.round(rgb[0])} ${Math.round(rgb[1])} ${Math.round(rgb[2])})`;
  }
}
