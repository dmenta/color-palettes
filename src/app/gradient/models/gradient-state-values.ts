import { ColorValues } from "../../color/model/colors.model";
import { Handlers } from "./bezier-curve";
import { GradientOrientation } from "./orientations";

export type GradientStateValues = {
  colors: {
    source: ColorValues;
    destination: ColorValues;
  };
  handlers: Handlers;
  orientation: GradientOrientation;
};
