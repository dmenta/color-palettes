import { FontDefinition } from "../font-configuration/font-definition";
import { knownVariations } from "../font-configuration/multivalue-property";

export const merriweather = {
  name: "Merriweather",
  properties: [
    {
      type: "range",
      name: "font-size",
      displayName: "Size",
      configuration: { unit: "px", type: "range", min: 12, max: 72, defaultValue: 24 },
    },
    {
      type: "range",
      name: "font-weight",
      displayName: "Weight",
      configuration: { type: "range", min: 300, max: 900, defaultValue: 400 },
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
            part: knownVariations["width"],
            configuration: { type: "range", min: 87, max: 112, defaultValue: 100, step: 2 },
          },
        ],
      },
    },
  ],
} as FontDefinition;
