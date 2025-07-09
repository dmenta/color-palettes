import { ColorValues } from "../../color/model/colors.model";
import { DoubleHandlers } from "../double-bezier-panel/double-bezier-curve";
import { Handlers, Point } from "./bezier-curve";

export type GradientStateValues = {
  colors: {
    start: ColorValues;
    end: ColorValues;
  };
  handlers: Handlers;
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
