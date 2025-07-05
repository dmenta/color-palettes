import { ColorValues } from "../../color/model/colors.model";
import { GradientStateValues } from "./gradient-state-values";
import { GradientOrientation } from "./orientations";

export const defaultGradientState: GradientStateValues = {
  colors: {
    source: [208, 22, 130] as ColorValues,
    destination: [37, 24, 119] as ColorValues,
  },
  handlers: {
    point1: { x: 20, y: 80 },
    point2: { x: 40, y: 70 },
  },
  orientation: "to right bottom" as GradientOrientation,
};
