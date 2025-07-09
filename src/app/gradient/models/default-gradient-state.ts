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
    center: [255, 0, 0] as ColorValues,
    end: [7, 10, 95] as ColorValues,
  },
  center: { x: 1000, y: 1000 },
  handlers: {
    h1: { x: 333, y: 333 },
    h2: { x: 666, y: 666 },
    h3: { x: 1333, y: 1333 },
    h4: { x: 1666, y: 1666 },
  },
  angle: 0,
};
