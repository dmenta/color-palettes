import { Pipe, PipeTransform } from "@angular/core";
import Color from "colorjs.io";

@Pipe({ name: "toRgb", standalone: true })
export class ColorToRgbPipe implements PipeTransform {
  transform(textoColor: string, channel?: "R" | "G" | "B"): string {
    const color = new Color(textoColor).to("srgb");

    const r = Math.max(0, Math.min(1, color.r)) * 255;
    if (channel === "R") {
      return r.toFixed();
    }

    const g = Math.max(0, Math.min(1, color.g)) * 255;
    if (channel === "G") {
      return g.toFixed();
    }

    const b = Math.max(0, Math.min(1, color.b)) * 255;
    if (channel === "B") {
      return b.toFixed();
    }
    return `
R:${Math.round(r)}
G:${Math.round(g)}
B:${Math.round(b)}`;
  }
}

@Pipe({ name: "toContrast", standalone: true })
export class ColorToContrastPipe implements PipeTransform {
  transform(textoColor: string): string {
    const color = new Color(textoColor).to("srgb");
    const contraste1 = color.contrastWCAG21("white");
    const contraste2 = color.contrastWCAG21("black");

    return contraste1 > 2.4 && contraste2 < 7.5 ? "white" : "black";
  }
}
// 0.127 0.945 / 0.019 / 21.09 grises
