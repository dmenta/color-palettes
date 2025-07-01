import { ColorComponent, ColorModel, ColorModelName } from "./colors.model";

export const colorModels: ColorModel[] = [
  new ColorModel("oklch", [
    new ColorComponent("Lightness", "L", 1, "", 3, 35),
    new ColorComponent("Chroma", "C", 0.4, "", 3, 20),
    new ColorComponent("Hue", "H", 540, "", 1, 55, -180),
  ]),
  new ColorModel(
    "hsl",
    [
      new ColorComponent("Hue", "H", 540, "deg", 0, 55, -180),
      new ColorComponent("Saturation", "S", 100, "%", 0, 20),
      new ColorComponent("Lightness", "L", 100, "%", 1, 35),
    ],
    2
  ),
  new ColorModel("rgb", [
    new ColorComponent("Red", "R", 255, "", 0, 25),
    new ColorComponent("Green", "G", 255, "", 0, 25),
    new ColorComponent("Blue", "B", 255, "", 0, 25),
  ]),
];

export const namedColorModels: Record<ColorModelName, ColorModel> = {
  oklch: colorModels[0]!,
  hsl: colorModels[1]!,
  rgb: colorModels[2]!,
};
