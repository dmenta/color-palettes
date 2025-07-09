import { toContrast, toRgb } from "../../color/model/color";
import { ColorValues } from "../../color/model/colors.model";
import { Point } from "./point.model";

export function gradientFromPoints(start: ColorValues, end: ColorValues, valores: Point[], angleDegrees: number = 0) {
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

  return {
    stops: stops,
    gradient: gradientString(stops, angleDegrees, "oklch"),
    darkMode: toContrast(stops[indiceMedio]!.color) === "white",
    gradientRGB: gradientString(rgbStops, angleDegrees, "srgb"),
    rgbStops: rgbStops,
  } as GradientDefinition;
}

export function doubleGradientStops(
  start: ColorValues,
  center: ColorValues,
  end: ColorValues,
  valores: Point[],
  angleDegrees: number = 0
) {
  const halves = Math.floor(valores.length / 2);
  const first = gradientFromPoints(start, center, valores.slice(0, halves), angleDegrees);
  const second = gradientFromPoints(center, end, valores.slice(halves), angleDegrees);

  return {
    stops: [...first.stops.slice(0, -1), ...second.stops.slice(1)], // Avoid duplicating the center stop
    gradient: gradientString([...first.stops.slice(0, -1), ...second.stops.slice(1)], angleDegrees, "oklch"),
    darkMode: first.darkMode || second.darkMode,
    gradientRGB: gradientString([...first.rgbStops.slice(0, -1), ...second.rgbStops.slice(1)], angleDegrees, "srgb"),
    rgbStops: [...first.rgbStops.slice(0, -1), ...second.rgbStops.slice(1)],
  };
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

export function gradientString(stops: GradientStop[], angleDegrees: number, space: string) {
  return `linear-gradient(${angleDegrees}deg in ${space}, ${stops
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
    return Math.min(valores.length - 1, menores.length - 1);
  } else {
    return Math.min(valores.length - 1, menores.length);
  }
}

const baseDate = new Date(2025, 0, 1).valueOf();

export function gradientToImage(
  stops: GradientStop[],
  angleDegrees: number = 0,
  dimensions: { width: number; height: number } = { width: 1920, height: 1080 }
) {
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("No se pudo obtener el contexto del canvas");
    return;
  }

  const { x1, y1, x2, y2 } = gradientOrientation(canvas.width, canvas.height, angleDegrees);

  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]!;
    gradient.addColorStop(stop.offset / 100, stop.color);
  }

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  const createEl = document.createElement("a");
  const url = canvas.toDataURL("image/png", 1);
  createEl.href = url;
  createEl.download = `colorina-gradient-${new Date().valueOf() - baseDate}.png`;
  createEl.click();
  createEl.remove();
}

export function gradientToSVG(stops: GradientStop[], angleDegrees: number = 0): void {
  let fileContent = toSVG(stops, angleDegrees);

  const file = new Blob([fileContent], { type: "image/svg+xml" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `colorina-gradient-${new Date().valueOf() - baseDate}.svg`;
  link.click();
  link.remove();
}

function toSVG(stops: GradientStop[], angleDegrees: number = 0) {
  const width = 1920;
  const height = 1080;

  const maxSize = Math.max(width, height);
  const minSize = Math.min(width, height);
  const fullHypotenusa = Math.sqrt(width * width + height * height);
  let { x1: _x1, y1: _y1, x2: _x2, y2: _y2, hypotenusa } = gradientOrientation(width, height, angleDegrees);
  hypotenusa = Math.abs(hypotenusa);
  const origenX = (maxSize - hypotenusa) / 2;
  const origenY = (minSize - fullHypotenusa) / 2;

  const pasos = stops
    .map((p) => `        <stop offset="${(p.offset / 100).toFixed(3)}" style="stop-color:${p.color};stop-opacity:1"/>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
      style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">

    <rect x="${origenX}" y="${origenY}" width="${hypotenusa}" height="${fullHypotenusa}"  style=" transform-origin: center center; transform: rotate(${
    angleDegrees - 90
  }deg); fill:url(#_Linear1);"/>
    <rect x="0" y="0" width="${width}" height="${height}" stroke="black" fill="none" />

  <defs>
        <linearGradient id="_Linear1" x1="${origenX}" y1="0" x2="${hypotenusa}" y2="0" gradientUnits="userSpaceOnUse" >
${pasos}
        </linearGradient>
    </defs>
</svg>`;
}

function gradientOrientation(width: number, height: number, angleDegrees: number) {
  const calcSizeX = width / 2;
  const calcSizeY = height / 2;

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
  const realHypotenusa = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 2;

  return {
    x1: calcSizeX + deltaX,
    y1: calcSizeY + deltaY,
    x2: calcSizeX - deltaX,
    y2: calcSizeY - deltaY,
    hypotenusa: realHypotenusa,
  };
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
