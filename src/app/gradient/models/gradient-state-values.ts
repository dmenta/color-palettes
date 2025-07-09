import { ColorValues } from "../../color/model/colors.model";
import { DoubleHandlers } from "./double-handlers.model";
import { Point } from "./point.model";

export type GradientStateValues = {
  colors: {
    start: ColorValues;
    end: ColorValues;
  };
  handlers: DoubleHandlers;
  angle: number;
};

export type DoubleGradientStateValues = {
  colors: {
    start: ColorValues;
    center: ColorValues;
    end: ColorValues;
  };
  center: Point;
  handlers: DoubleHandlers;
  angle: number;
};
