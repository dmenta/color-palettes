import { namedColorModels } from "./color-models-definitions";
import { ColorConfigState, ColorValues } from "./colors.model";
import { PaletteStepsConfig, PaletteValuesConfig, PaletteVisualConfig } from "./palette.model";

export type ColorStateValues = {
  colorConfig: ColorConfigState;
  paletteStepsConfig: PaletteStepsConfig;
  paletteVisualConfig: PaletteVisualConfig;
  paletteValuesConfig: PaletteValuesConfig;
};

export const colorModelDefault = namedColorModels["oklch"];

export const defaultColorState: ColorStateValues = {
  colorConfig: {
    colorModelName: colorModelDefault.name,
    variable: colorModelDefault.components[2],
    variableIndex: colorModelDefault.components.findIndex(
      (c) => c.name.caption === colorModelDefault.components[2].name.caption
    ),
    color: { 0: 0.641, 1: 0.161, 2: 344.6 } as ColorValues,
    range: { min: 191, max: 498 },
  },
  paletteStepsConfig: {
    steps: 8,
    automatic: true,
  },
  paletteVisualConfig: {
    height: 100,
    flat: false,
    separate: true,
  },
  paletteValuesConfig: {
    showValues: "no",
  },
} as ColorStateValues;
