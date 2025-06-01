import { createFontVariationAxe, fontFamily, italicConfig, sizeConfig, weightConfig } from "./font-axe-types";
import { fontVariations } from "./font-variation";

export const familiasDisponibles = [
  {
    name: "Nunito Sans",
    propiedades: [
      sizeConfig({ min: 12, max: 24 }, 16),
      weightConfig({ min: 200, max: 1000 }, 400),
      italicConfig(false),
      createFontVariationAxe([
        { variation: fontVariations.width, min: 75, max: 125, step: 2.5, defaultValue: 100 },
        { variation: fontVariations.lowercase, min: 440, max: 540, step: 2, defaultValue: 500 },
      ]),
    ],
  },
  {
    name: "Roboto",
    propiedades: [
      sizeConfig({ min: 12, max: 72 }, 36),
      weightConfig({ min: 100, max: 900 }, 400),
      italicConfig(false),
      createFontVariationAxe([{ variation: fontVariations.width, min: 75, max: 100, step: 2.5, defaultValue: 100 }]),
    ],
  },
  {
    name: "Noto Sans",
    propiedades: [
      sizeConfig({ min: 12, max: 24 }, 16),
      weightConfig({ min: 100, max: 900 }, 400),
      italicConfig(false),
      createFontVariationAxe([{ variation: fontVariations.width, min: 62.5, max: 100, step: 2.5, defaultValue: 100 }]),
    ],
  },
  {
    name: "Fraunces",
    propiedades: [
      sizeConfig({ min: 12, max: 120 }, 16),
      weightConfig({ min: 100, max: 900 }, 400),
      italicConfig(false),
      createFontVariationAxe([
        { variation: fontVariations.softness, min: 0, max: 100, step: 2, defaultValue: 0 },
        { variation: fontVariations.wonky, min: 0, max: 1, step: 1, defaultValue: 0 },
      ]),
    ],
  },
  {
    name: "Noto Serif",
    propiedades: [
      sizeConfig({ min: 12, max: 36 }, 16),
      weightConfig({ min: 100, max: 900 }, 400),
      italicConfig(false),
      createFontVariationAxe([{ variation: fontVariations.width, min: 62.5, max: 100, step: 2.5, defaultValue: 100 }]),
    ],
  },
  {
    name: "Merriweather",
    propiedades: [
      sizeConfig({ min: 12, max: 36 }, 16),
      weightConfig({ min: 300, max: 900 }, 400),
      italicConfig(false),
      createFontVariationAxe([{ variation: fontVariations.width, min: 87, max: 112, step: 2.5, defaultValue: 100 }]),
    ],
  },

  {
    name: "Roboto Flex",
    propiedades: [
      sizeConfig({ min: 12, max: 72 }, 36),
      weightConfig({ min: 100, max: 1000 }, 400),
      createFontVariationAxe([
        { variation: fontVariations.width, min: 25, max: 151, step: 2.5, defaultValue: 100 },
        { variation: fontVariations.grade, min: -200, max: 150, step: 5, defaultValue: 0 },
        { variation: fontVariations.slant, min: -10, max: 0, step: 1, defaultValue: 0 },
        { variation: fontVariations.lowercase, min: 416, max: 570, step: 5, defaultValue: 514 },
        { variation: fontVariations.uppercase, min: 528, max: 760, step: 5, defaultValue: 712 },
        { variation: fontVariations.ascending, min: 649, max: 854, step: 5, defaultValue: 750 },
        { variation: fontVariations.descending, min: -305, max: -98, step: 5, defaultValue: -203 },
        { variation: fontVariations.counterWidth, min: 323, max: 603, step: 5, defaultValue: 468 },
        { variation: fontVariations.thickStroke, min: 27, max: 175, step: 2, defaultValue: 96 },
        { variation: fontVariations.thinStroke, min: 25, max: 135, step: 2, defaultValue: 79 },
        { variation: fontVariations.figureHeight, min: 560, max: 788, step: 2, defaultValue: 738 },
      ]),
    ],
  },
] as fontFamily[];
