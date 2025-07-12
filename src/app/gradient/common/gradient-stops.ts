import { toContrast, toRgb } from "../../color/model/color";
import { ColorValues } from "../../color/model/colors.model";
import { GradientDefinition, GradientStop } from "./models/gradient";
import { Point } from "./models/point.model";

export const gradientGen = {
  string: gradientString,
  fromPoints: gradientFromPoints,
  doubleStops: doubleGradientStops,
};

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
    darkMode: toContrast(first.stops.slice(-3, -2)[0]!.color) === "white",
    gradientRGB: gradientString([...first.rgbStops.slice(0, -1), ...second.rgbStops.slice(1)], angleDegrees, "srgb"),
    rgbStops: [...first.rgbStops.slice(0, -1), ...second.rgbStops.slice(1)],
  };
}
export function gradientString(stops: GradientStop[], angleDegrees: number, space: string) {
  return `linear-gradient(${angleDegrees}deg in ${space}, ${stops
    .map((p) => `${p.color} ${p.offset.toFixed(1)}%`)
    .join(", ")})`;
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
