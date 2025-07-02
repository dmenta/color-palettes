import { namedColorModels } from "./color-models-definitions";
import { ColorConfigState, ColorValues, MinMax } from "./colors.model";
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
    variable: colorModelDefault.components[colorModelDefault.defaultVariableIndex],
    variableIndex: colorModelDefault.components.findIndex(
      (c) => c.name === colorModelDefault.components[colorModelDefault.defaultVariableIndex].name
    ) as 0 | 1 | 2,
    color: colorModelDefault.defaultValues() as ColorValues,
    minmax: [
      colorModelDefault.components[colorModelDefault.defaultVariableIndex].min,
      colorModelDefault.components[colorModelDefault.defaultVariableIndex].max,
    ] as MinMax,
  },
  paletteStepsConfig: {
    pasos: 12,
    automatico: true,
  },
  paletteVisualConfig: {
    alto: 80,
    continuo: false,
    separate: false,
  },
  paletteValuesConfig: {
    showValues: "no",
  },
} as ColorStateValues;
