import Color from "colorjs.io";
import { ColorComponent, ColorModel, ColorValues } from "../model/colors.model";

export function toRgb(textoColor: string): { values: ColorValues; color: string } {
  const color = new Color(textoColor);

  const r = Math.round(Math.max(0, Math.min(1, color.srgb["r"] ?? 0)) * 255);
  const g = Math.round(Math.max(0, Math.min(1, color.srgb["g"] ?? 0)) * 255);
  const b = Math.round(Math.max(0, Math.min(1, color.srgb["b"] ?? 0)) * 255);

  return { values: [r, g, b] as ColorValues, color: `rgb(${r} ${g} ${b})` };
}

export function toHsl(textoColor: string) {
  const rgb = toRgb(textoColor);
  const color = new Color(rgb.color).to("hsl");

  return [color.coords[0].valueOf(), color.coords[1].valueOf(), color.coords[2].valueOf()] as ColorValues;
}

export function toOklch(textoColor: string) {
  const color = new Color(textoColor).to("oklch");

  return [color.coords[0].valueOf(), color.coords[1].valueOf(), color.coords[2].valueOf()] as ColorValues;
}
export function toContrast(textoColor: string): string {
  const color = new Color(textoColor).to("srgb");
  const contraste1 = color.contrastWCAG21("white");
  const contraste2 = color.contrastWCAG21("black");

  return contraste1 > 2.4 && contraste2 < 7.5 ? "white" : "black";
}

export function rgbToHex(rgb: ColorValues) {
  return `#${rgb[0].toString(16).padStart(2, "0")}${rgb[1].toString(16).padStart(2, "0")}${rgb[2]
    .toString(16)
    .padStart(2, "0")}`.toUpperCase();
}

export function rgbFromHex(color: string) {
  color = color?.replace("#", "") ?? "000000";

  if (color.length !== 6) {
    color = "000000";
  }

  const colorValue = parseInt(color, 16);
  const r = (colorValue >> 16) & 0xff;
  const g = (colorValue >> 8) & 0xff;
  const b = colorValue & 0xff;
  return [r, g, b] as ColorValues;
}

export function rgbTo(rgb: ColorValues, colorModel: ColorModel): ColorValues {
  const color = new Color(`rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`).to(colorModel.name);

  const a = ensureCoord(color.coords[0], colorModel.components[0]);
  const b = ensureCoord(color.coords[1], colorModel.components[1]);
  const c = ensureCoord(color.coords[2], colorModel.components[2]);

  return [a, b, c] as ColorValues;
}

function ensureCoord(coord: number, component: ColorComponent): number {
  const coordAsegurada = Number.isNaN(coord) ? 0 : coord;

  return Math.max(0, Math.min(component.max, coordAsegurada));
}
