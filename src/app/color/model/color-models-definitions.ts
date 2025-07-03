import { ColorComponent, ColorModel, ColorModelName, ColorParts } from "./colors.model";

export const colorModels: ColorModel[] = [
  new ColorModel("oklch", [
    new ColorComponent({ caption: "Lightness", label: "L" }, { min: 0, max: 1 }, 0.005, "", 35),
    new ColorComponent({ caption: "Chroma", label: "C" }, { min: 0, max: 0.44 }, 0.004, "", 20),
    new ColorComponent({ caption: "Hue", label: "H" }, { min: -180, max: 540 }, 1, "", 55, 9),
  ]),
  new ColorModel(
    "hsl",
    [
      new ColorComponent({ caption: "Hue", label: "H" }, { min: -180, max: 540 }, 1, "deg", 55, 9),
      new ColorComponent({ caption: "Saturation", label: "S" }, { min: 0, max: 100 }, 1, "%", 20),
      new ColorComponent({ caption: "Lightness", label: "L" }, { min: 0, max: 100 }, 1, "%", 35),
    ],
    2
  ),
  new ColorModel("rgb", [
    new ColorComponent({ caption: "Red", label: "R" }, { min: 0, max: 255 }, 1, "", 25),
    new ColorComponent({ caption: "Green", label: "G" }, { min: 0, max: 255 }, 1, "", 25),
    new ColorComponent({ caption: "Blue", label: "B" }, { min: 0, max: 255 }, 1, "", 25),
  ]),
  new ColorModel(
    "hex",
    [
      new ColorComponent({ caption: "Red", label: "R" }, { min: 0, max: 255 }, 1, "", 25, 2, (value: number) =>
        Math.round(value).toString(16).padStart(2, "0").toUpperCase()
      ),
      new ColorComponent({ caption: "Green", label: "G" }, { min: 0, max: 255 }, 1, "", 25, 2, (value: number) =>
        Math.round(value).toString(16).padStart(2, "0").toUpperCase()
      ),
      new ColorComponent({ caption: "Blue", label: "B" }, { min: 0, max: 255 }, 1, "", 25, 2, (value: number) =>
        Math.round(value).toString(16).padStart(2, "0").toUpperCase()
      ),
    ],
    0,
    (parts: ColorParts) => {
      // Convert hex to RGB
      return `#${parts[0]}${parts[1]}${parts[2]}`;
    }
  ),
];

export const namedColorModels: Record<ColorModelName, ColorModel> = {
  oklch: colorModels[0]!,
  hsl: colorModels[1]!,
  rgb: colorModels[2]!,
  hex: colorModels[3]!,
};
