import { fontVariation, fontVariationDefinition, fontBooleanVariationDefinition } from "./font-variation";
import { StylePropertyValue, StyleProperty, stylePropertyValue, variationValue } from "./style-property-types";
import { createSliderOptions, numericRange, sliderOptions } from "../../../core/components/slider/slider-types";

type styleProperty = {
  readonly name: string;
  readonly caption: string;
  readonly type: "single" | "multi" | "boolean";
};

export interface FontStyleAxeSingle extends styleProperty {
  readonly type: "single";
  range: sliderOptions;
  readonly unit: string;
  propertyValue: (value: number) => StylePropertyValue;
}

export interface FontStyleAxeBoolean extends styleProperty {
  readonly type: "boolean";
  defaultValue: boolean;
  readonly trueValue: string | number;
  readonly falseValue: string | number;
  propertyValue: (value: boolean) => StylePropertyValue;
}

export interface FontStyleAxeMulti extends styleProperty {
  readonly type: "multi";
  readonly parts: (FontVariationAxe | FontVariationBoolean)[];
  propertyValue: (value: { [key: string]: number }) => StylePropertyValue;
}

interface FontVariationAxe {
  type: "single";
  variation: fontVariation;
  range: sliderOptions;
  propertyValue: (value: { [key: string]: number }) => string;
}

type booleanRange = {
  min: number;
  max: number;
  defaultValue: boolean;
};
interface FontVariationBoolean {
  type: "boolean";
  variation: fontVariation;
  range: booleanRange;
  propertyValue: (value: { [key: string]: number }) => string;
}

export function sizeConfig(range: numericRange, defaultValue: number) {
  const sizePropertyDefinition = {
    type: "single",
    caption: "Size",
    name: "font-size",
    unit: "px",
  } as StyleProperty;

  const stops = [12, 16, 24, 32, 40, 48, 56, 60];

  return createFontAxeSingle(sizePropertyDefinition, range, defaultValue, 0.5, stops);
}

export function weightConfig(range: numericRange, defaultValue: number) {
  const weightPropertyDefinition = {
    type: "single",
    caption: "Weight",
    name: "font-weight",
    unit: "",
  } as StyleProperty;

  const stops = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  return createFontAxeSingle(weightPropertyDefinition, range, defaultValue, 10, stops);
}

export function italicConfig(defaultValue: boolean) {
  const italicPropertyDefinition = {
    type: "boolean",
    caption: "Italic",
    name: "font-style",
    trueValue: "italic",
    falseValue: "normal",
  } as StyleProperty;

  return createFontAxeBooleanString(italicPropertyDefinition, defaultValue);
}

function createFontAxeSingle(
  definition: StyleProperty,
  range: numericRange,
  defaultValue: number,
  step: number,
  stops: number[] = []
): FontStyleAxeSingle {
  if (definition.type !== "single") {
    throw new Error("Definition must be of type 'single'");
  }

  const sliderOptions = createSliderOptions(range, defaultValue, step, stops);

  return {
    ...definition,
    range: sliderOptions,
    unit: definition.type === "single" ? definition.unit ?? "" : "",
    propertyValue: (value: number) => stylePropertyValue(definition, value),
  };
}

function createFontAxeBooleanString(definition: StyleProperty, defaultValue: boolean): FontStyleAxeBoolean {
  if (definition.type !== "boolean") {
    throw new Error("Definition must be of type 'boolean'");
  }
  return {
    ...definition,
    defaultValue: defaultValue,
    propertyValue: (value: boolean) => {
      return {
        name: definition.name,
        type: "boolean",
        value: value ? definition.trueValue : definition.falseValue,
      } as StylePropertyValue;
    },
  };
}

export function createFontVariationAxe(variations: fontVariationDefinition[]): FontStyleAxeMulti {
  const property = {
    type: "multi",
    caption: "Variations",
    name: "font-variation-settings",
  } as StyleProperty;

  const parts = variations.map((variation) => {
    if (variation.max - variation.min === variation.step) {
      return createFontBooleanVariationPart(variation);
    } else {
      return createFontVariationPartAxe(variation);
    }
  });

  return {
    ...property,
    type: "multi",
    parts: parts,
    propertyValue: (value: { [key: string]: number }) => {
      return {
        name: property.name,
        value: parts
          .filter((part) => value[part.variation.identifier] !== part.range.defaultValue)
          .map((part) => part.propertyValue(value))
          .join(", "),
      } as StylePropertyValue;
    },
  };
}

function createFontVariationPartAxe(definition: fontVariationDefinition) {
  const sliderOptions = createSliderOptions(
    { min: definition.min, max: definition.max },
    definition.defaultValue,
    definition.step,
    definition.stops ?? []
  );
  return {
    type: "single",
    variation: {
      identifier: definition.variation,
      caption: variationCaptions[definition.variation] ?? definition.variation,
    },
    range: sliderOptions,
    propertyValue: (value: { [key: string]: number }) => variationValue(definition.variation, value),
  } as FontVariationAxe;
}

function createFontBooleanVariationPart(definition: fontBooleanVariationDefinition) {
  return {
    type: "boolean",
    variation: {
      identifier: definition.variation,
      caption: variationCaptions[definition.variation] ?? definition.variation,
    },
    range: {
      min: definition.min,
      max: definition.max,
      defaultValue: definition.defaultValue === definition.max,
    },
    propertyValue: (value: { [key: string]: number }) =>
      `${definition.variation} ${value[definition.variation] ? definition.max : definition.min}`,
  } as FontVariationBoolean;
}

const variationCaptions: { [key: string]: string } = {
  "'wdth'": "Width",
  "'slnt'": "Slant",
  "'GRAD'": "Grade",
  "'YTLC'": "Lowercase",
  "'YTUC'": "Uppercase",
  "'YTAS'": "Ascending",
  "'YTDE'": "Descending",
  "'YOPQ'": "Thin Stroke",
  "'XOPQ'": "Thick Stroke",
  "'XTRA'": "Counter Width",
  "'YTFI'": "Figure Height",
  "'SOFT'": "Softness",
  "'WONK'": "Wonky",
};

export type fontFamily = {
  name: string;
  propiedades: (FontStyleAxeSingle | FontStyleAxeBoolean | FontStyleAxeMulti)[];
};
