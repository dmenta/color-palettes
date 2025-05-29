import { createFontVariationAxe, fontFamily, sizeConfig, weightConfig } from "./font-axe-types";
import { fontVariations } from "./font-variation";

export const familiasDisponibles = [
  {
    name: "Nunito Sans",
    propiedades: [
      sizeConfig({ min: 12, max: 24 }, 16),
      weightConfig({ min: 200, max: 1000 }, 400),
      createFontVariationAxe([
        { variation: fontVariations.width, min: 75, max: 125, step: 2.5, initialValue: 100 },
        { variation: fontVariations.lowercase, min: 440, max: 540, step: 2.5, initialValue: 500 },
      ]),
    ],
  },
  {
    name: "Roboto",
    propiedades: [
      sizeConfig({ min: 12, max: 24 }, 16),
      weightConfig({ min: 100, max: 900 }, 400),
      createFontVariationAxe([{ variation: fontVariations.width, min: 75, max: 100, step: 2.5, initialValue: 100 }]),
    ],
  },
  {
    name: "Noto Sans",
    propiedades: [
      sizeConfig({ min: 12, max: 24 }, 16),
      weightConfig({ min: 100, max: 900 }, 400),
      createFontVariationAxe([{ variation: fontVariations.width, min: 62.5, max: 100, step: 2.5, initialValue: 100 }]),
    ],
  },
  {
    name: "Roboto Flex",
    propiedades: [
      sizeConfig({ min: 12, max: 32 }, 16),
      weightConfig({ min: 100, max: 1000 }, 400),
      createFontVariationAxe([
        { variation: fontVariations.width, min: 25, max: 151, step: 2.5, initialValue: 100 },
        { variation: fontVariations.grade, min: -200, max: 150, step: 5, initialValue: 0 },
        { variation: fontVariations.slant, min: -10, max: 0, step: 0.5, initialValue: 0 },
        { variation: fontVariations.lowercase, min: 416, max: 570, step: 5, initialValue: 514 },
        { variation: fontVariations.uppercase, min: 528, max: 760, step: 5, initialValue: 712 },
        { variation: fontVariations.ascending, min: 649, max: 854, step: 5, initialValue: 750 },
        { variation: fontVariations.descending, min: -305, max: -98, step: 5, initialValue: -203 },
        { variation: fontVariations.counterWidth, min: 323, max: 603, step: 5, initialValue: 468 },
        { variation: fontVariations.thickStroke, min: 27, max: 175, step: 2.5, initialValue: 96 },
        { variation: fontVariations.thinStroke, min: 25, max: 135, step: 2.5, initialValue: 79 },
        { variation: fontVariations.figureHeight, min: 560, max: 788, step: 2.5, initialValue: 738 },
      ]),
    ],
  },
] as fontFamily[];
