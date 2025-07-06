import { ColorValues } from "../../color/model/colors.model";
import { Handlers } from "./bezier-curve";
import { GradientOrientation } from "./orientations";

export type GradientStateValues = {
  colors: {
    start: ColorValues;
    end: ColorValues;
  };
  handlers: Handlers;
  orientation: GradientOrientation;
  angle: number;
};
