import { createWeigthStandardDedinition, FontDefinition } from "../models/font-definition";
import { knownVariations } from "../models/multivalue-property";

export const handjet = {
  name: "Handjet",
  properties: [
    {
      type: "range",
      name: "font-size",
      displayName: "Size",
      configuration: { unit: "px", type: "range", min: 12, max: 72, defaultValue: 36 },
    },
    createWeigthStandardDedinition(100, 900),
    {
      name: "font-variation-settings",
      displayName: "Variations",
      configuration: {
        type: "multi",
        parts: [
          {
            part: knownVariations["elemGrid"],
            configuration: { type: "range", min: 1, max: 2, defaultValue: 1, step: 0.1 },
          },
          {
            part: knownVariations["elemShape"],
            configuration: { type: "range", min: 0, max: 16, defaultValue: 2, step: 1 },
          },
        ],
      },
    },
  ],
} as FontDefinition;
