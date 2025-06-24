import { Pipe, PipeTransform } from "@angular/core";
import Color from "colorjs.io";

@Pipe({ name: "toRgb", standalone: true })
export class ColorToRgbPipe implements PipeTransform {
  transform(textoColor: string): string {
    const color = new Color(textoColor).to("srgb");
    const partes = color.toString().replace("rgb(", "").replace(")", "").split(" ");
    console.log("Base RGB:", color.r, color.g, color.b);
    const r = Math.max(0, Math.min(1, color.r)) * 255;
    const g = Math.max(0, Math.min(1, color.g)) * 255;
    const b = Math.max(0, Math.min(1, color.b)) * 255;
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
    console.log("Contraste con blanco:", contraste1);
    console.log("Contraste con negro:", contraste2);

    return contraste1 > 2.4 && contraste2 < 7.5 ? "white" : "black";
  }
}
// 0.127 0.945 / 0.019 / 21.09 grises
