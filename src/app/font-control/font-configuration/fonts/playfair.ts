import { createWeigthStandardDedinition, FontDefinition } from "../models/font-definition";
import { knownVariations } from "../models/multivalue-property";

export const playfair = {
  name: "Playfair",
  properties: [
    {
      type: "range",
      name: "font-size",
      displayName: "Size",
      configuration: { unit: "px", type: "range", min: 12, max: 96, defaultValue: 16 },
    },
    createWeigthStandardDedinition(300, 900),
    {
      type: "boolean",
      name: "font-style",
      displayName: "Italic",
      configuration: { type: "boolean", trueValue: "italic", falseValue: "normal", defaultValue: false },
    },
    {
      name: "font-variation-settings",
      displayName: "Variations",
      configuration: {
        type: "multi",
        parts: [
          {
            part: knownVariations["width"],
            configuration: { type: "range", min: 87.5, max: 112.5, defaultValue: 100, step: 2 },
          },
        ],
      },
    },
  ],
} as FontDefinition;
