import { ColorComponent, ColorModel, ColorModelName, ColorParts } from "./colors.model";

export const colorModels: ColorModel[] = [
  new ColorModel("oklch", [
    new ColorComponent("Lightness", "L", 1, "", 3, 35, 0, 3),
    new ColorComponent("Chroma", "C", 0.4, "", 3, 20, 0, 6),
    new ColorComponent("Hue", "H", 540, "", 1, 55, -180, 9),
  ]),
  new ColorModel(
    "hsl",
    [
      new ColorComponent("Hue", "H", 540, "deg", 0, 55, -180, 9),
      new ColorComponent("Saturation", "S", 100, "%", 0, 20),
      new ColorComponent("Lightness", "L", 100, "%", 1, 35, 0, 5),
    ],
    2
  ),
  new ColorModel("rgb", [
    new ColorComponent("Red", "R", 255, "", 0, 25, 0, 2),
    new ColorComponent("Green", "G", 255, "", 0, 25, 0, 2),
    new ColorComponent("Blue", "B", 255, "", 0, 25, 0, 2),
  ]),
  new ColorModel(
    "hex",
    [
      new ColorComponent("Red", "R", 255, "", 0, 25, 0, 2, (value: number) =>
        Math.round(value).toString(16).padStart(2, "0").toUpperCase()
      ),
      new ColorComponent("Green", "G", 255, "", 0, 25, 0, 2, (value: number) =>
        Math.round(value).toString(16).padStart(2, "0").toUpperCase()
      ),
      new ColorComponent("Blue", "B", 255, "", 0, 25, 0, 2, (value: number) =>
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
