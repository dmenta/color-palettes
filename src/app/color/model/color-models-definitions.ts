import { ColorComponent, ColorModel, ColorModelName } from "./colors.model";

export const colorModels: ColorModel[] = [
  new ColorModel("rgb", [
    new ColorComponent("Red", 255, "", 0, 25),
    new ColorComponent("Green", 255, "", 0, 25),
    new ColorComponent("Blue", 255, "", 0, 25),
  ]),
  new ColorModel("hsl", [
    new ColorComponent("Hue", 720, "deg", 0, 55),
    new ColorComponent("Saturation", 100, "%", 0, 20),
    new ColorComponent("Lightness", 100, "%", 0, 35),
  ]),
  new ColorModel("oklch", [
    new ColorComponent("Lightness", 1, "", 3, 35),
    new ColorComponent("Chroma", 0.3, "", 3, 20),
    new ColorComponent("Hue", 720, "", 2, 55),
  ]),
];

export const namedColorModels: Record<ColorModelName, ColorModel> = {
  rgb: colorModels[0],
  hsl: colorModels[1],
  oklch: colorModels[2],
};
