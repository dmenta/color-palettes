import { ColorValues } from "../../../color/model/colors.model";
import { DoubleHandlers } from "../../double/models/double-handlers.model";

export type GradientStateValues = {
  colors: {
    start: ColorValues;
    end: ColorValues;
  };
  handlers: DoubleHandlers;
  angle: number;
};
