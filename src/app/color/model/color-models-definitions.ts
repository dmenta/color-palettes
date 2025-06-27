import { ColorComponent, ColorModel, ColorModelName } from "./colors.model";

export const colorModels: ColorModel[] = [
  new ColorModel("rgb", [
    new ColorComponent("Red", "r", 255, "", 0, 25),
    new ColorComponent("Green", "g", 255, "", 0, 25),
    new ColorComponent("Blue", "b", 255, "", 0, 25),
  ]),
  new ColorModel("hsl", [
    new ColorComponent("Hue", "h", 540, "deg", 0, 55, -180),
    new ColorComponent("Saturation", "s", 100, "%", 0, 20),
    new ColorComponent("Lightness", "l", 100, "%", 1, 35),
  ]),
  new ColorModel("oklch", [
    new ColorComponent("Lightness", "l", 1, "", 3, 35),
    new ColorComponent("Chroma", "c", 0.4, "", 3, 20),
    new ColorComponent("Hue", "h", 540, "", 2, 55, -180),
  ]),
];

export const namedColorModels: Record<ColorModelName, ColorModel> = {
  rgb: colorModels[0],
  hsl: colorModels[1],
  oklch: colorModels[2],
};
