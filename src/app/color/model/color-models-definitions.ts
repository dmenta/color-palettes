import { ColorComponent, ColorModel, ColorModelName } from "./colors.model";

export const colorModels: ColorModel[] = [
  new ColorModel("rgb", [
    new ColorComponent("Red", 255, "", 0, 32),
    new ColorComponent("Green", 255, "", 0, 32),
    new ColorComponent("Blue", 255, "", 0, 32),
  ]),
  new ColorModel("hsl", [
    new ColorComponent("Hue", 360, "deg", 0, 75),
    new ColorComponent("Saturation", 100, "%", 0, 25),
    new ColorComponent("Lightness", 100, "%", 0, 50),
  ]),
  new ColorModel("oklch", [
    new ColorComponent("Lightness", 100, "%", 2, 50),
    new ColorComponent("Chroma", 0.3, "", 3, 30),
    new ColorComponent("Hue", 360, "", 2, 75),
  ]),
];

export const namedColorModels: Record<ColorModelName, ColorModel> = {
  rgb: colorModels[0],
  hsl: colorModels[1],
  oklch: colorModels[2],
};
