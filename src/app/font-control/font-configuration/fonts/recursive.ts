import { createWeigthStandardDedinition, FontDefinition } from "../models/font-definition";
import { knownVariations } from "../models/multivalue-property";

export const recursive = {
  name: "Recursive",
  properties: [
    {
      type: "range",
      name: "font-size",
      displayName: "Size",
      configuration: { unit: "px", type: "range", min: 12, max: 72, defaultValue: 36 },
    },
    createWeigthStandardDedinition(300, 1000),
    {
      name: "font-variation-settings",
      displayName: "Variations",
      configuration: {
        type: "multi",
        parts: [
          {
            type: "range",
            part: knownVariations["casual"],
            configuration: { type: "range", min: 0, max: 1, defaultValue: 0, step: 0.01 },
          },
          {
            type: "range",
            part: knownVariations["slant"],
            configuration: { type: "range", min: -15, max: 0, defaultValue: 0, step: 1 },
          },
          {
            type: "range",
            part: knownVariations["cursive"],
            configuration: { type: "range", min: 0, max: 1, defaultValue: 0, step: 0.1 },
          },
          {
            type: "range",
            part: knownVariations["monospace"],
            configuration: { type: "range", min: 0, max: 1, defaultValue: 0, step: 0.01 },
          },
        ],
      },
    },
  ],
} as FontDefinition;
