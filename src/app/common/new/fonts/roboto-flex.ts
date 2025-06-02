import { FontDefinition } from "../font-configuration/font-definition";
import { knownVariations } from "../font-configuration/multivalue-property";

export const robotoFlex = {
  name: "Roboto Flex",
  properties: [
    {
      type: "range",
      name: "font-size",
      displayName: "Size",
      configuration: { unit: "px", type: "range", min: 12, max: 72, defaultValue: 36 },
    },
    {
      type: "range",
      name: "font-weight",
      displayName: "Weight",
      configuration: { type: "range", min: 100, max: 1000, defaultValue: 400 },
    },
    {
      name: "font-variation-settings",
      displayName: "Variations",
      configuration: {
        type: "multi",
        parts: [
          {
            type: "range",
            part: knownVariations["width"],
            configuration: { type: "range", min: 25, max: 151, defaultValue: 100, step: 2.5 },
          },
          {
            type: "range",
            part: knownVariations["grade"],
            configuration: { type: "range", min: -200, max: 150, defaultValue: 0, step: 5 },
          },
          {
            type: "range",
            part: knownVariations["slant"],
            configuration: { type: "range", min: -10, max: 0, defaultValue: 0, step: 1 },
          },
          {
            type: "range",
            part: knownVariations["lowercase"],
            configuration: { type: "range", min: 416, max: 570, defaultValue: 514, step: 5 },
          },
          {
            type: "range",
            part: knownVariations["uppercase"],
            configuration: { type: "range", min: 528, max: 760, defaultValue: 712, step: 5 },
          },
          {
            type: "range",
            part: knownVariations["ascending"],
            configuration: { type: "range", min: 649, max: 854, defaultValue: 750, step: 5 },
          },
          {
            type: "range",
            part: knownVariations["descending"],
            configuration: { type: "range", min: -305, max: -98, defaultValue: -203, step: 5 },
          },
          {
            type: "range",
            part: knownVariations["counterWidth"],
            configuration: { type: "range", min: 323, max: 603, defaultValue: 468, step: 5 },
          },
          {
            type: "range",
            part: knownVariations["thickStroke"],
            configuration: { type: "range", min: 27, max: 175, defaultValue: 96, step: 2 },
          },
          {
            type: "range",
            part: knownVariations["thinStroke"],
            configuration: { type: "range", min: 25, max: 135, defaultValue: 79, step: 2 },
          },
          {
            part: knownVariations["figureHeight"],
            configuration: { type: "range", min: 560, max: 788, defaultValue: 738, step: 2 },
          },
        ],
      },
    },
  ],
} as FontDefinition;
