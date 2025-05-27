import { createSliderOptions, numericRange, sliderOptions } from "../slider/slider-types";
import { StyleProperty, StylePropertyDefinition, StylePropertyValue } from "./style-property-types";

export interface FontStyleAxe {
  readonly definition: StylePropertyDefinition;
  readonly options: sliderOptions;
  propertyValue(value: number): StylePropertyValue;
}

export function createFontAxe(
  definition: StylePropertyDefinition,
  range: numericRange,
  initialValue: number,
  step: number,
  stops: number[] = []
): FontStyleAxe {
  return new FontAxe({
    definition,
    options: createSliderOptions(range, initialValue, step, stops),
  });
}
type fontAxeConfig = {
  readonly definition: StylePropertyDefinition;
  readonly options: sliderOptions;
};

class FontAxe implements FontStyleAxe {
  readonly definition: StylePropertyDefinition;
  readonly options: sliderOptions;
  private readonly property: StyleProperty;

  propertyValue(value: number) {
    return this.property.propertyValue(value);
  }

  constructor(config: fontAxeConfig) {
    this.definition = config.definition;
    this.property = new StyleProperty(config.definition);
    this.options = config.options;
  }
}
