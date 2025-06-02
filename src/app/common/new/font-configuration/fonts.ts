import { FontStyleAxeSingle, sizeConfig, weightConfig } from "../../font-style/font-axe-types";
import {
  createFontVariationSettingsConfiguration,
  createRangeMultiValuePartConfiguration,
  knownVariations,
  MultiValuePartConfiguration,
  MultivaluePropertyConfiguration,
} from "./multivalue-property";

export const fontFamilies = [
  // {
  //   name: "Nunito Sans",
  //   propiedades: [
  //     sizeConfig({ min: 12, max: 24 }, 16),
  //     weightConfig({ min: 200, max: 1000 }, 400),
  //     italicConfig(false),
  //     createFontVariationAxe([
  //       { variation: fontVariations.width, min: 75, max: 125, step: 2.5, 100 },
  //       { variation: fontVariations.lowercase, min: 440, max: 540, step: 2, 500 },
  //     ]),
  //   ],
  // },
  // {
  //   name: "Roboto",
  //   propiedades: [
  //     sizeConfig({ min: 12, max: 72 }, 36),
  //     weightConfig({ min: 100, max: 900 }, 400),
  //     italicConfig(false),
  //     createFontVariationAxe([{ variation: fontVariations.width, min: 75, max: 100, step: 2.5, 100 }]),
  //   ],
  // },
  // {
  //   name: "Noto Sans",
  //   propiedades: [
  //     sizeConfig({ min: 12, max: 24 }, 16),
  //     weightConfig({ min: 100, max: 900 }, 400),
  //     italicConfig(false),
  //     createFontVariationAxe([{ variation: fontVariations.width, min: 62.5, max: 100, step: 2.5, 100 }]),
  //   ],
  // },
  // {
  //   name: "Fraunces",
  //   propiedades: [
  //     sizeConfig({ min: 12, max: 120 }, 16),
  //     weightConfig({ min: 100, max: 900 }, 400),
  //     italicConfig(false),
  //     createFontVariationAxe([
  //       { variation: fontVariations.softness, min: 0, max: 100, step: 2, 0 },
  //       { variation: fontVariations.wonky, min: 0, max: 1, step: 1, 0 },
  //     ]),
  //   ],
  // },
  // {
  //   name: "Noto Serif",
  //   propiedades: [
  //     sizeConfig({ min: 12, max: 36 }, 16),
  //     weightConfig({ min: 100, max: 900 }, 400),
  //     italicConfig(false),
  //     createFontVariationAxe([{ variation: fontVariations.width, min: 62.5, max: 100, step: 2.5, 100 }]),
  //   ],
  // },
  // {
  //   name: "Merriweather",
  //   propiedades: [
  //     sizeConfig({ min: 12, max: 36 }, 16),
  //     weightConfig({ min: 300, max: 900 }, 400),
  //     italicConfig(false),
  //     createFontVariationAxe([{ variation: fontVariations.width, min: 87, max: 112, step: 2.5, 100 }]),
  //   ],
  // },

  {
    name: "Roboto Flex",
    propiedades: [
      sizeConfig({ min: 12, max: 72 }, 36),
      weightConfig({ min: 100, max: 1000 }, 400),
      createFontVariationSettingsConfiguration([
        createRangeMultiValuePartConfiguration(knownVariations["width"], 25, 151, 100, 2.5),
        createRangeMultiValuePartConfiguration(knownVariations["grade"], -200, 150, 0, 5),
        createRangeMultiValuePartConfiguration(knownVariations["slant"], -10, 0, 0, 1),
        createRangeMultiValuePartConfiguration(knownVariations["lowercase"], 416, 570, 514, 5),
        createRangeMultiValuePartConfiguration(knownVariations["uppercase"], 528, 760, 712, 5),
        createRangeMultiValuePartConfiguration(knownVariations["ascending"], 649, 854, 750, 5),
        createRangeMultiValuePartConfiguration(knownVariations["descending"], -305, -98, -203, 5),
        createRangeMultiValuePartConfiguration(knownVariations["counterWidth"], 323, 603, 468, 5),
        createRangeMultiValuePartConfiguration(knownVariations["thickStroke"], 27, 175, 96, 2),
        createRangeMultiValuePartConfiguration(knownVariations["thinStroke"], 25, 135, 79, 2),
        createRangeMultiValuePartConfiguration(knownVariations["figureHeight"], 560, 788, 738, 2),
      ] as MultiValuePartConfiguration[]),
    ] as (FontStyleAxeSingle | MultivaluePropertyConfiguration)[],
  },
];

export type FontFamily = {
  name: string;
  propiedades: (FontStyleAxeSingle | MultivaluePropertyConfiguration)[];
};
