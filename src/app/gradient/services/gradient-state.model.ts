import { InjectionToken, Signal } from "@angular/core";
import { ColorValues } from "../../color/model/colors.model";
import { GradientDefinition } from "../models/gradient-stops";
import { DoubleHandlers } from "../models/double-handlers.model";
import { Point } from "../models/point.model";
import { Handlers } from "../models/handlers.model";

export const GRADIENT_STATE_TOKEN = new InjectionToken<DoubleGradientState>("GRADIENT_STATE");
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
  handlers: Signal<Handlers>;
  onHandlersChange: (handlers: Handlers) => void;
}

export interface GradientState extends GradientOrientationState, GradientColorsState, GradientHandlersState {
  gradient: Signal<GradientDefinition>;
}

export interface DoubleGradientState extends GradientState {
  center: Signal<Point>;
  centerRGBColor: Signal<ColorValues>;
  onCenterChange: (point: Point) => void;
  onCenterColorChange: (color: ColorValues) => void;
  handlers: Signal<DoubleHandlers>;
  onHandlersChange: (handlers: DoubleHandlers) => void;
}
