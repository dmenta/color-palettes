import { numericRange } from "../slider/slider-types";
import { createFontAxe, FontStyleAxe } from "./font-axe-types";
import { StylePropertyDefinition } from "./style-property-types";

function sizeConfig(range: numericRange, initialValue: number) {
  const stops = [12, 16, 24, 32, 40, 48, 56, 60];

  return createFontAxe(sizePropertyDefinition, range, initialValue, 0.5, stops);
}

function weightConfig(range: numericRange, initialValue: number) {
  const stops = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  return createFontAxe(weightPropertyDefinition, range, initialValue, 10, stops);
}

function variationConfig(variation: fontVariation, range: numericRange, step: number, initialValue: number) {
  const variationDefinition = {
    type: "multi",
    caption: variation.caption,
    name: "font-variation-settings",
    identifier: variation.identifier,
  } as StylePropertyDefinition;

  return createFontAxe(variationDefinition, range, initialValue, step, []);
}

const widthVariation = { identifier: "'wdth'", caption: "Width" } as fontVariation;
const slantVariation = { identifier: "'slnt'", caption: "Slant" } as fontVariation;
const gradeVariation = { identifier: "'GRAD'", caption: "Grade" } as fontVariation;
const lowercaseVariation = { identifier: "'YTLC'", caption: "Lower" } as fontVariation;
const uppercaseVariation = { identifier: "'YTUC'", caption: "Upper" } as fontVariation;
const ascendingVariation = { identifier: "'YTAS'", caption: "Asc" } as fontVariation;
const descendingVariation = { identifier: "'YTDE'", caption: "Desc" } as fontVariation;
const thinStrokeVariation = { identifier: "'YOPQ'", caption: "Thin Stroke" } as fontVariation;
const thickStrokeVariation = { identifier: "'XOPQ'", caption: "Thick Stroke" } as fontVariation;
const counterWidthVariation = { identifier: "'XTRA'", caption: "Counter Width" } as fontVariation;
const figureHeightVariation = { identifier: "'YTFI'", caption: "Figure Height" } as fontVariation;

const sizePropertyDefinition = {
  type: "single",
  caption: "Size",
  name: "font-size",
  suffix: "px",
} as StylePropertyDefinition;

const weightPropertyDefinition = {
  type: "single",
  caption: "Weight",
  name: "font-weight",
  suffix: "",
} as StylePropertyDefinition;

export const familiasDisponibles = [
  {
    name: "Nunito Sans",
    axes: [
      sizeConfig({ min: 12, max: 24 }, 16),
      weightConfig({ min: 200, max: 1000 }, 400),
      variationConfig(widthVariation, { min: 75, max: 125 }, 2.5, 100),
      variationConfig(lowercaseVariation, { min: 440, max: 540 }, 2.5, 500),
    ],
  },
  {
    name: "Roboto",
    axes: [
      sizeConfig({ min: 12, max: 24 }, 16),
      weightConfig({ min: 100, max: 900 }, 400),
      variationConfig(widthVariation, { min: 75, max: 100 }, 2.5, 100),
    ],
  },
  {
    name: "Roboto Flex",
    axes: [
      sizeConfig({ min: 12, max: 32 }, 16),
      weightConfig({ min: 100, max: 1000 }, 400),
      variationConfig(widthVariation, { min: 25, max: 151 }, 2.5, 100),
      variationConfig(gradeVariation, { min: -200, max: 150 }, 5, 0),
      variationConfig(slantVariation, { min: -10, max: 0 }, 0.5, 0),
      variationConfig(lowercaseVariation, { min: 416, max: 570 }, 5, 514),
      variationConfig(uppercaseVariation, { min: 528, max: 760 }, 5, 712),
      variationConfig(ascendingVariation, { min: 649, max: 854 }, 5, 750),
      variationConfig(descendingVariation, { min: -305, max: -98 }, 5, -203),
      variationConfig(counterWidthVariation, { min: 323, max: 603 }, 5, 468),
      variationConfig(thickStrokeVariation, { min: 27, max: 175 }, 2.5, 96),
      variationConfig(thinStrokeVariation, { min: 25, max: 135 }, 2.5, 79),
      variationConfig(figureHeightVariation, { min: 560, max: 788 }, 2.5, 738),
    ],
  },
] as fontFamily[];

export type fontFamily = {
  name: string;
  axes: FontStyleAxe[];
};

export type fontVariation = {
  identifier: string;
  caption: string;
};

// <figure height>: Use a value from 560 to 788

// .roboto-flex-<uniquifier> {
//   font-optical-sizing: auto;
//   font-style: normal;
// }
