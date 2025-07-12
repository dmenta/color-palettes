import { DoubleGradientStateValues } from "./gradient-state-values";

const optionADoubleGradientState: DoubleGradientStateValues = {
  colors: { start: [14, 10, 99], center: [255, 22, 0], end: [250, 145, 48] },
  center: { x: 240, y: 250 },
  handlers: { h1: { x: 38, y: 114 }, h2: { x: 134, y: 223 }, h3: { x: 304, y: 266 }, h4: { x: 490, y: 375 } },
  angle: 143,
};

const optionBDoubleGradientState: DoubleGradientStateValues = {
  colors: { start: [13, 10, 67], center: [218, 29, 11], end: [194, 131, 71] },
  center: { x: 275, y: 186 },
  handlers: { h1: { x: 84, y: 38 }, h2: { x: 190, y: 215 }, h3: { x: 399, y: 144 }, h4: { x: 464, y: 338 } },
  angle: 144,
};
export const doubleGradientStates = {
  default: optionBDoubleGradientState as DoubleGradientStateValues,
};
