import { createSliderOptions, numericRange, sliderOptions } from "../components/slider/slider-types";
import { fontBooleanVariationDefinition, fontVariation, fontVariationDefinition } from "./font-variation";
import {
  StylePropertyDefinition,
  StylePropertyValue,
  stylePropertyValue,
  variationValue,
} from "./style-property-types";

export interface FontStyleAxeSingle extends FontStyleAxe {
  readonly type: "single";
  range: sliderOptions;
  readonly unit: string;
  propertyValue: (value: number) => StylePropertyValue;
}
export interface FontStyleAxeBoolean<T extends string | number = string | number> extends FontStyleAxe {
  readonly type: "boolean";
  readonly onValue: T;
  readonly offValue: T;
  defaultValue?: boolean;
  propertyValue: (value: boolean) => StylePropertyValue;
}
export interface FontStyleAxeMulti extends FontStyleAxe {
  readonly type: "multi";
  readonly parts: (FontVariationAxe | FontVariationBoolean)[];
  propertyValue: (value: { [key: string]: number }) => StylePropertyValue;
}

interface FontVariationAxe {
  type: "continuo";
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
  type: "discreto";
  variation: fontVariation;
  range: booleanRange;
  propertyValue: (value: { [key: string]: number }) => string;
}
interface FontStyleAxe<T extends string | number = string | number> {
  propiedad: Pick<StylePropertyDefinition<T>, "name" | "caption">;
  readonly type: "single" | "multi" | "boolean";
}

export function sizeConfig(range: numericRange, initialValue: number) {
  const sizePropertyDefinition = {
    type: "single",
    caption: "Size",
    name: "font-size",
    unit: "px",
  } as StylePropertyDefinition;

  const stops = [12, 16, 24, 32, 40, 48, 56, 60];

  return createFontAxeSingle(sizePropertyDefinition, range, initialValue, 0.5, stops);
}

export function weightConfig(range: numericRange, initialValue: number) {
  const weightPropertyDefinition = {
    type: "single",
    caption: "Weight",
    name: "font-weight",
    unit: "",
  } as StylePropertyDefinition;

  const stops = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  return createFontAxeSingle(weightPropertyDefinition, range, initialValue, 10, stops);
}

export function italicConfig(initialValue: boolean) {
  const italicPropertyDefinition = {
    type: "boolean",
    caption: "Italic",
    name: "font-style",
    onValue: "italic",
    offValue: "normal",
  } as StylePropertyDefinition<string>;

  return createFontAxeBoolean<string>(italicPropertyDefinition, initialValue);
}

function createFontAxeSingle<T extends string | number = string | number>(
  definition: StylePropertyDefinition<T>,
  range: numericRange,
  initialValue: number,
  step: number,
  stops: number[] = []
): FontStyleAxeSingle {
  const sliderOptions = createSliderOptions(range, initialValue, step, stops);
  return {
    propiedad: definition,
    type: "single",
    range: sliderOptions,
    unit: definition.type === "single" ? definition.unit ?? "" : "",

    propertyValue: (value: number) => stylePropertyValue(definition, value),
  };
}

function createFontAxeBoolean<T extends string | number = string | number>(
  definition: StylePropertyDefinition<T>,
  initialValue: boolean
): FontStyleAxeBoolean<T> {
  if (definition.type !== "boolean") {
    throw new Error("Definition must be of type 'boolean'");
  }
  return {
    propiedad: definition,
    type: "boolean",
    onValue: definition.onValue,
    offValue: definition.offValue,
    defaultValue: initialValue,
    propertyValue: (value: boolean) => {
      return {
        name: definition.name,
        value: value ? definition.onValue : definition.offValue,
      };
    },
  } as FontStyleAxeBoolean<T>;
}
export function createFontVariationAxe<T extends string | number = string | number>(
  variations: fontVariationDefinition[]
): FontStyleAxeMulti {
  const property = {
    type: "multi",
    caption: "Variations",
    name: "font-variation-settings",
  } as StylePropertyDefinition<T>;

  const parts = variations.map((variation) => {
    if (variation.max - variation.min === variation.step) {
      return createFontBooleanVariationPart(variation);
    } else {
      return createFontVariationPartAxe(variation);
    }
  });

  return {
    propiedad: property,
    type: "multi",
    parts: parts,
    propertyValue: (value: { [key: string]: number }) => {
      return {
        name: property.name,
        value: parts
          .filter((part) => value[part.variation.identifier] !== part.range.defaultValue)
          .map((part) => part.propertyValue(value))
          .join(", "),
      };
    },
  };
}

function createFontVariationPartAxe(definition: fontVariationDefinition): FontVariationAxe {
  const sliderOptions = createSliderOptions(
    { min: definition.min, max: definition.max },
    definition.initialValue,
    definition.step,
    definition.stops ?? []
  );
  return {
    type: "continuo",
    variation: {
      identifier: definition.variation,
      caption: variationCaptions[definition.variation] ?? definition.variation,
    },
    range: sliderOptions,
    propertyValue: (value: { [key: string]: number }) => variationValue(definition.variation, value),
  };
}

function createFontBooleanVariationPart(definition: fontBooleanVariationDefinition): FontVariationBoolean {
  return {
    type: "discreto",
    variation: {
      identifier: definition.variation,
      caption: variationCaptions[definition.variation] ?? definition.variation,
    },
    range: {
      min: definition.min,
      max: definition.max,
      defaultValue: definition.initialValue === definition.max,
    },
    propertyValue: (value: { [key: string]: number }) =>
      `${definition.variation} ${value[definition.variation] ? definition.max : definition.min}`,
  };
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
  propiedades: (FontStyleAxeSingle | FontStyleAxeBoolean<string | number> | FontStyleAxeMulti)[];
};
