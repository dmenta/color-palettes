import { ColorValues } from "../../color/model/colors.model";
import { GradientStateValues } from "./gradient-state-values";
import { GradientOrientation } from "./orientations";

export const defaultGradientState: GradientStateValues = {
  colors: {
    start: [249, 147, 52] as ColorValues,
    end: [7, 10, 95] as ColorValues,
  },
  handlers: {
    h1: { x: 3.4, y: 60 },
    h2: { x: 20, y: 96.8 },
  },
  orientation: "to top" as GradientOrientation,
};
