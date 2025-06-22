import { ColorComponent, ColorModel, ColorModelName } from "./colors.model";

export const colorModels: ColorModel[] = [
  new ColorModel("rgb", {
    A: new ColorComponent("Red", 255),
    B: new ColorComponent("Green", 255),
    C: new ColorComponent("Blue", 255),
  }),
  new ColorModel("hsl", {
    A: new ColorComponent("Hue", 360, "deg"),
    B: new ColorComponent("Saturation", 100, "%"),
    C: new ColorComponent("Lightness", 100, "%"),
  }),
  new ColorModel("oklch", {
    A: new ColorComponent("Lightness", 100, "%", 2),
    B: new ColorComponent("Chroma", 0.3, "", 3),
    C: new ColorComponent("Hue", 360, "", 2),
  }),
];

export const namedColorModels: Record<ColorModelName, ColorModel> = {
  rgb: colorModels[0],
  hsl: colorModels[1],
  oklch: colorModels[2],
};
