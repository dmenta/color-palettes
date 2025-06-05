import { createWeigthStandardDedinition, FontDefinition } from "../models/font-definition";
import { knownVariations } from "../models/multivalue-property";

export const nunitoSans = {
  name: "Nunito Sans",
  properties: [
    {
      type: "range",
      name: "font-size",
      displayName: "Size",
      configuration: { unit: "px", type: "range", min: 12, max: 72, defaultValue: 36 },
    },
    createWeigthStandardDedinition(200, 900),
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
            configuration: { type: "range", min: 75, max: 125, defaultValue: 100, step: 2.5 },
          },
          {
            part: knownVariations["lowercase"],
            configuration: { type: "range", min: 440, max: 540, defaultValue: 500, step: 2 },
          },
        ],
      },
    },
  ],
} as FontDefinition;
