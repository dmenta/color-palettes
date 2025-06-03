import { FontDefinition } from "../font-configuration/font-definition";
import { knownVariations } from "../font-configuration/multivalue-property";

export const fraunces = {
  name: "Fraunces",
  properties: [
    {
      type: "range",
      name: "font-size",
      displayName: "Size",
      configuration: { unit: "px", type: "range", min: 12, max: 120, defaultValue: 24 },
    },
    {
      type: "range",
      name: "font-weight",
      displayName: "Weight",
      configuration: { type: "range", min: 100, max: 900, defaultValue: 400 },
    },
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
            part: knownVariations["softness"],
            configuration: { type: "range", min: 0, max: 100, defaultValue: 0, step: 2 },
          },
          {
            part: knownVariations["wonky"],
            configuration: { type: "boolean", trueValue: "1", falseValue: "0", defaultValue: false },
          },
        ],
      },
    },
  ],
} as FontDefinition;
