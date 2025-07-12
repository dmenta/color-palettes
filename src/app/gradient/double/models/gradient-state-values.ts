import { ColorValues } from "../../../color/model/colors.model";
import { Point } from "../../common/models/point.model";
import { DoubleHandlers } from "./double-handlers.model";

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
