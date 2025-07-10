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
    start: [14, 10, 99],
    center: [255, 22, 0],
    end: [250, 145, 48],
  },
  center: { x: 979, y: 999 },
  handlers: { h1: { x: 150, y: 456 }, h2: { x: 579, y: 856 }, h3: { x: 1408, y: 896 }, h4: { x: 1957, y: 1456 } },
  angle: 143,
};
