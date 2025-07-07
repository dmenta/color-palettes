import { toContrast, toRgb } from "../../color/model/color";
import { ColorValues } from "../../color/model/colors.model";
import { Point } from "./bezier-curve";
import { GradientOrientation } from "./orientations";

export function gradientFromPoints(
  start: ColorValues,
  end: ColorValues,
  valores: Point[],
  angleDegrees: number | null = null,
  orientation: GradientOrientation = "to right"
) {
  const lVariation = lightnessVariation(start, end);
  const cVariation = chromaVariation(start, end);
  const hVariation = hueVariation(start, end);

  const stops: GradientStop[] = [];
  const rgbStops: GradientStop[] = [];

  for (let i = 0; i < valores.length; i++) {
    const point = valores[i]!;
    const stepRatio = point.y / 100;
    const lStart = (stepRatio * lVariation.range + lVariation.delta).toFixed(3);
    const cStart = (stepRatio * cVariation.range + cVariation.delta).toFixed(3);
    const hStart = (stepRatio * hVariation.range + hVariation.delta).toFixed(1);

    const color = `oklch(${lStart} ${cStart} ${hStart})`;

    stops.push({ offset: point.x, color: color });
    rgbStops.push({ offset: point.x, color: toRgb(color).color });
  }

  const indiceMedio = indiceValorMedio(valores);

  const solvedAngle = angleDegrees !== null ? angleDegrees + "deg" : orientation;

  return {
    stops: stops,
    gradient: gradientString(stops, solvedAngle, "oklch"),
    darkMode: toContrast(stops[indiceMedio]!.color) === "white",
    gradientRGB: gradientString(rgbStops, solvedAngle, "srgb"),
    rgbStops: rgbStops,
  } as GradientDefinition;
}

function chromaVariation(start: ColorValues, end: ColorValues) {
  return { range: end[1]! - start[1]!, delta: start[1]! };
}

function lightnessVariation(start: ColorValues, end: ColorValues) {
  return { range: end[0]! - start[0]!, delta: start[0]! };
}

function hueVariation(start: ColorValues, end: ColorValues) {
  const path = end[2]! - start[2]!;
  const hStart = path > 180 ? start[2]! + 360 : start[2]!;
  const hEnd = path < -180 ? end[2]! + 360 : end[2]!;

  return { range: hEnd - hStart, delta: hStart };
}
export function gradientString(stops: GradientStop[], orientation: string, space: string) {
  return `linear-gradient(${orientation} in ${space}, ${stops
    .map((p) => `${p.color} ${p.offset.toFixed(1)}%`)
    .join(", ")})`;
}
function indiceValorMedio(valores: Point[]): number {
  const menores = valores
    .map((val) => val.x)
    .filter((x) => x <= 50)
    .sort((a, b) => b - a);
  const mayores = valores
    .map((val) => val.x)
    .filter((x) => x > 50)
    .sort((a, b) => a - b);

  if (50 - menores[0]! < mayores[0]! - 50) {
    return menores.length - 1;
  } else {
    return menores.length;
  }
}

const baseDate = new Date(2025, 0, 1).valueOf();

export function gradientToImage(stops: GradientStop[], angleDegrees: number = 0) {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("No se pudo obtener el contexto del canvas");
    return;
  }

  const calcSizeX = canvas.width / 2;
  const calcSizeY = canvas.height / 2;

  const seno = Math.sin(((angleDegrees + 90) * Math.PI * 2) / 360);
  const coseno = Math.cos(((angleDegrees + 90) * Math.PI * 2) / 360);

  const hypotenusa = Math.sqrt(calcSizeX * calcSizeX + calcSizeY * calcSizeY);
  let deltaX = hypotenusa * coseno;
  let maxX = Math.abs(calcSizeY * seno);

  let deltaY = hypotenusa * seno;
  let maxY = Math.abs(calcSizeX * coseno);

  if (deltaY < -calcSizeY) {
    deltaY = Math.max(deltaY, -calcSizeY - maxY);
  } else if (deltaY > calcSizeY) {
    deltaY = Math.min(deltaY, calcSizeY + maxY);
  }

  if (deltaX < -calcSizeX) {
    deltaX = Math.max(deltaX, -calcSizeX - maxX);
  } else if (deltaX > calcSizeX) {
    deltaX = Math.min(deltaX, calcSizeX + maxX);
  }

  const gradient = ctx.createLinearGradient(
    calcSizeX + deltaX,
    calcSizeY + deltaY,
    calcSizeX - deltaX,
    calcSizeY - deltaY
  );

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]!;
    gradient.addColorStop(stop.offset / 100, stop.color);
  }

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.rect(0, 0, 1920, 1080);
  ctx.fill();

  const createEl = document.createElement("a");
  const url = canvas.toDataURL("image/png", 1);
  createEl.href = url;
  createEl.download = `colorina-gradient-${new Date().valueOf() - baseDate}.png`;
  createEl.click();
  createEl.remove();
}

export function gradientToSVG(stops: GradientStop[], _angleDegrees: number = 0): void {
  let fileContent = toSVG(stops, _angleDegrees);

  const file = new Blob([fileContent], { type: "image/svg+xml" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `colorina-gradient-${new Date().valueOf() - baseDate}.svg`;
  link.click();
  link.remove();
}

function toSVG(stops: GradientStop[], _angleDegrees: number = 0) {
  const width = 1920;
  const height = 1080;

  let x1 = 0;
  let x2 = 1920;
  let y1 = 0;
  let y2 = 0;

  const pasos = stops
    .map((p) => `        <stop offset="${(p.offset / 100).toFixed(3)}" style="stop-color:${p.color};stop-opacity:1"/>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
      style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <rect x="0" y="0" width="${width}" height="${height}" style="fill:url(#_Linear1);"/>
    <defs>
        <linearGradient id="_Linear1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse" >
${pasos}
        </linearGradient>
    </defs>
</svg>`;
}

export type GradientDefinition = {
  stops: GradientStop[];
  gradient: string;
  darkMode: boolean;
  gradientRGB: string;
  rgbStops: GradientStop[];
};

type GradientStop = {
  offset: number;
  color: string;
};
