import { ColorValues } from "../../color/model/colors.model";
import { Coordenates } from "./bezier-curve";
import { GradientOrientation } from "./orientations";

export type GradientStateValues = {
  colors: {
    source: ColorValues;
    destination: ColorValues;
  };
  handlers: Coordenates;
  orientation: GradientOrientation;
};
