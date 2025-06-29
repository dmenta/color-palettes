import { ColorComponent, ColorModel, ColorModelName } from "./colors.model";

export const colorModels: ColorModel[] = [
  new ColorModel("rgb", [
    new ColorComponent("Red", "R", 255, "", 0, 50),
    new ColorComponent("Green", "G", 255, "", 0, 50),
    new ColorComponent("Blue", "B", 255, "", 0, 50),
  ]),
  new ColorModel(
    "hsl",
    [
      new ColorComponent("Hue", "H", 540, "deg", 0, 50, -180),
      new ColorComponent("Saturation", "S", 100, "%", 0, 50),
      new ColorComponent("Lightness", "L", 100, "%", 1, 50),
    ],
    2
  ),
  new ColorModel("oklch", [
    new ColorComponent("Lightness", "L", 1, "", 3, 50),
    new ColorComponent("Chroma", "C", 0.4, "", 3, 50),
    new ColorComponent("Hue", "H", 540, "", 2, 50, -180),
  ]),
];

export const namedColorModels: Record<ColorModelName, ColorModel> = {
  rgb: colorModels[0]!,
  hsl: colorModels[1]!,
  oklch: colorModels[2]!,
};
