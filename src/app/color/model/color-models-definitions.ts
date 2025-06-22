import { ColorComponent, ColorModel, ColorModelName } from "./colors.model";

export const colorModels: ColorModel[] = [
  new ColorModel("rgb", [
    new ColorComponent("Red", 255),
    new ColorComponent("Green", 255),
    new ColorComponent("Blue", 255),
  ]),
  new ColorModel("hsl", [
    new ColorComponent("Hue", 360, "deg"),
    new ColorComponent("Saturation", 100, "%"),
    new ColorComponent("Lightness", 100, "%"),
  ]),
  new ColorModel("oklch", [
    new ColorComponent("Lightness", 100, "%", 2),
    new ColorComponent("Chroma", 0.3, "", 3),
    new ColorComponent("Hue", 360, "", 2),
  ]),
];

export const namedColorModels: Record<ColorModelName, ColorModel> = {
  rgb: colorModels[0],
  hsl: colorModels[1],
  oklch: colorModels[2],
};
