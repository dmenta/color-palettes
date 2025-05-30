import { createSliderOptions, numericRange, sliderOptions } from "../slider/slider-types";
import { fontVariation, fontVariationDefinition } from "./font-variation";
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

export interface FontStyleAxeMulti extends FontStyleAxe {
  readonly type: "multi";
  readonly parts: FontVariationAxe[];
  propertyValue: (value: { [key: string]: number }) => StylePropertyValue;
}

interface FontVariationAxe {
  variation: fontVariation;
  range: sliderOptions;
  propertyValue: (value: { [key: string]: number }) => string;
}
interface FontStyleAxe {
  propiedad: Pick<StylePropertyDefinition, "name" | "caption">;
  readonly type: "single" | "multi";
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

function createFontAxeSingle(
  definition: StylePropertyDefinition,
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

export function createFontVariationAxe(variations: fontVariationDefinition[]): FontStyleAxeMulti {
  const property = {
    type: "multi",
    caption: "Variations",
    name: "font-variation-settings",
  } as StylePropertyDefinition;

  const parts = variations.map((variation) => createFontVariationPartAxe(variation));

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
    variation: {
      identifier: definition.variation,
      caption: variationCaptions[definition.variation] ?? definition.variation,
    },
    range: sliderOptions,
    propertyValue: (value: { [key: string]: number }) => variationValue(definition.variation, value),
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
};

export type fontFamily = {
  name: string;
  propiedades: (FontStyleAxeSingle | FontStyleAxeMulti)[];
};
