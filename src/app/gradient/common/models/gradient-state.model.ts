import { InjectionToken, Signal } from "@angular/core";
import { ColorValues } from "../../../color/model/colors.model";
import { GradientDefinition } from "./gradient";

export const GRADIENT_ORIENTATION_TOKEN = new InjectionToken<GradientOrientationState>("GRADIENT_ORIENTATION_TOKEN");
export interface GradientOrientationState {
  angleDegrees: Signal<number>;

  onAngleDegreesChange: (angle: number) => void;
}

export const GRADIENT_COLORS_TOKEN = new InjectionToken<GradientColors>("GRADIENT_COLORS_TOKEN");
export interface GradientColors extends GradientOrientationState {
  startRGBColor: Signal<ColorValues>;
  endRGBColor: Signal<ColorValues>;
  gradient: Signal<GradientDefinition>;
}
