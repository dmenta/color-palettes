import { ColorValues } from "../../color/model/colors.model";
import { DoubleGradientStateValues, GradientStateValues } from "./gradient-state-values";

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

export const defaultDoubleGradientState: DoubleGradientStateValues = {
  colors: {
    start: [249, 147, 52] as ColorValues,
    center: [249, 147, 52] as ColorValues,
    end: [7, 10, 95] as ColorValues,
  },
  center: { x: 800, y: 1300 },
  handlers: {
    h1: { x: 250, y: 200 },
    h2: { x: 350, y: 400 },
    h3: { x: 1200, y: 1200 },
    h4: { x: 1700, y: 1700 },
  },
  angle: 0,
};
