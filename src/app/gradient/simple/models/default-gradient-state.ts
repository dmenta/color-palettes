import { ColorValues } from "../../../color/model/colors.model";
import { GradientStateValues } from "./gradient-state-values";

export const defaultGradientState: GradientStateValues = {
  colors: {
    start: [249, 147, 52] as ColorValues,
    end: [7, 10, 95] as ColorValues,
  },
  handlers: {
    h1: { x: 6.8, y: 120 },
    h2: { x: 40, y: 193.6 },
  },
  angle: 0,
};
