import { InjectionToken, Signal } from "@angular/core";
import { ColorValues } from "../../color/model/colors.model";
import { DoubleHandlers } from "../double-bezier-panel/double-bezier-curve";
import { Handlers } from "../models/bezier-curve";
import { GradientDefinition } from "../models/gradient-points";

export const GRADIENT_STATE_TOKEN = new InjectionToken<GradientState>("GRADIENT_STATE");
export interface GradientOrientationState {
  angleDegrees: Signal<number>;

  onAngleDegreesChange: (angle: number) => void;
}

export interface GradientColorsState {
  startRGBColor: Signal<ColorValues>;
  endRGBColor: Signal<ColorValues>;

  startColor: Signal<string>;
  endColor: Signal<string>;

  onStartColorChange: (color: ColorValues) => void;
  onEndColorChange: (color: ColorValues) => void;
}

export interface GradientHandlersState {
  handlers: Signal<GradientHandlers>;
  onHandlersChange: (handlers: GradientHandlers) => void;
}

export interface GradientState extends GradientOrientationState, GradientColorsState, GradientHandlersState {
  gradient: Signal<GradientDefinition>;
}

export type GradientHandlers = Handlers | DoubleHandlers;
