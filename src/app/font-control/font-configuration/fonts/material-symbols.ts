import { createWeigthStandardDedinition, FontDefinition } from "../models/font-definition";
import { knownVariations } from "../models/multivalue-property";

export const materialSymbols = {
  name: "Material Symbols Rounded",
  properties: [
    {
      type: "range",
      name: "font-size",
      displayName: "Size",
      configuration: { unit: "px", type: "range", min: 12, max: 120, defaultValue: 24 },
    },
    createWeigthStandardDedinition(100, 700),
    {
      name: "font-variation-settings",
      displayName: "Variations",
      configuration: {
        type: "multi",
        parts: [
          {
            type: "range",
            part: knownVariations["grade"],
            configuration: { type: "range", min: -25, max: 200, defaultValue: 0, step: 5 },
          },
          {
            part: knownVariations["opticalSize"],
            configuration: { type: "range", min: 20, max: 48, defaultValue: null, step: 2 },
          },
          {
            part: knownVariations["fill"],
            configuration: { type: "boolean", trueValue: "1", falseValue: "0", defaultValue: false },
          },
        ],
      },
    },
  ],
} as FontDefinition;
