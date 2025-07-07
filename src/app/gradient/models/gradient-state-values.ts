import { ColorValues } from "../../color/model/colors.model";
import { Handlers } from "./bezier-curve";

export type GradientStateValues = {
  colors: {
    start: ColorValues;
    end: ColorValues;
  };
  handlers: Handlers;
  angle: number;
};
