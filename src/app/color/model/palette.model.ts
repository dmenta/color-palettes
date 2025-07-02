import {
  ColorConfigState,
  colorConfigStateEquals,
  ColorModelName,
  ColorValues,
  colorValuesEquals,
} from "./colors.model";

export type showValuesOption = "no" | "yes" | "rgb" | "hex";

export type PaletteStepsConfig = {
  pasos: number;
  automatico: boolean;
};

export type PaletteVisualConfig = {
  alto: number;
  continuo: boolean;
  separate: boolean;
};

export type PaletteValuesConfig = {
  showValues: showValuesOption;
};

export type Swatch = {
  valores: ColorValues;
  color: string;
  rgbValues: ColorValues;
  rgb: string;
  fore: string;
  clamp?: boolean;
};
export type Palette = { model: ColorModelName; swatches: Swatch[] };

type PaletteState = {
  stepsConfig: PaletteStepsConfig;
  colorConfig: ColorConfigState;
};

export type PaletteInfo = {
  palette: Palette;
  state: PaletteState;
};

export function paletteInfoEquals(current: PaletteInfo, next: PaletteInfo) {
  if (!paletteEquals(current.palette, next.palette)) {
    return false;
  }

  if (!paletteStateEquals(current.state, next.state)) {
    return false;
  }

  return true;
}

function paletteStateEquals(current: PaletteState, next: PaletteState) {
  if (!colorConfigStateEquals(current.colorConfig, next.colorConfig)) {
    return false;
  }

  if (!stepsConfigEquals(current.stepsConfig, next.stepsConfig)) {
    return false;
  }

  return true;
}

function paletteEquals(current: Palette, next: Palette) {
  if (current.model !== next.model) {
    return false;
  }

  if (!colorSwatchesEquals(current.swatches, next.swatches)) {
    return false;
  }

  return true;
}
function colorSwatchesEquals(current: Swatch[], next: Swatch[]) {
  if (current.length !== next.length) {
    return false;
  }
  for (let i = 0; i < current.length; i++) {
    if (!swatchEquals(current[i], next[i])) {
      return false;
    }
  }
  return true;
}

function swatchEquals(current: Swatch | undefined, next: Swatch | undefined) {
  if (!current || !next) {
    return false;
  }

  if (!colorValuesEquals(current.valores, next.valores)) {
    return false;
  }

  if (!colorValuesEquals(current.rgbValues, next.rgbValues)) {
    return false;
  }

  if (current.clamp !== next.clamp) {
    return false;
  }

  if (current.fore !== next.fore) {
    return false;
  }

  return true;
}

function stepsConfigEquals(current: PaletteStepsConfig, next: PaletteStepsConfig) {
  return current.pasos === next.pasos && current.automatico === next.automatico;
}
