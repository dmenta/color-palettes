import Color from "colorjs.io";
import { Triple } from "../model/colors.model";

export function toRgb(textoColor: string) {
  const color = new Color(textoColor);

  const r = Math.max(0, Math.min(1, color.srgb["r"] ?? 0)) * 255;
  const g = Math.max(0, Math.min(1, color.srgb["g"] ?? 0)) * 255;
  const b = Math.max(0, Math.min(1, color.srgb["b"] ?? 0)) * 255;

  return [Math.round(r), Math.round(g), Math.round(b)] as Triple<number>;
}
export function toContrast(textoColor: string): string {
  const color = new Color(textoColor).to("srgb");
  const contraste1 = color.contrastWCAG21("white");
  const contraste2 = color.contrastWCAG21("black");

  return contraste1 > 2.4 && contraste2 < 7.5 ? "white" : "black";
}

export function rgbToHex(rgb: Triple<number>) {
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
  return [r, g, b] as Triple<number>;
}
