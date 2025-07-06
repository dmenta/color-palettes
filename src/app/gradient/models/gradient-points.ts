import { toContrast, toRgb } from "../../color/model/color";
import { ColorValues } from "../../color/model/colors.model";
import { Point } from "./bezier-curve";
import { GradientOrientation } from "./orientations";

export function gradientFromPoints(
  start: ColorValues,
  end: ColorValues,
  valores: Point[],
  orientation: GradientOrientation
) {
  const lVariation = lightnessVariation(start, end);
  const cVariation = chromaVariation(start, end);
  const hVariation = hueVariation(start, end);

  const pasos: GradientStep[] = [];
  const pasosRGB: GradientStep[] = [];

  for (let i = 0; i < valores.length; i++) {
    const point = valores[i]!;
    const stepRatio = point.y / 100;
    const lStart = (stepRatio * lVariation.range + lVariation.delta).toFixed(3);
    const cStart = (stepRatio * cVariation.range + cVariation.delta).toFixed(3);
    const hStart = (stepRatio * hVariation.range + hVariation.delta).toFixed(1);

    const color = `oklch(${lStart} ${cStart} ${hStart})`;

    pasos.push({ offset: point.x, color: color });
    pasosRGB.push({ offset: point.x, color: toRgb(color).color });
  }

  const indiceMedio = indiceValorMedio(valores);

  return {
    gradient: gradientString(pasos, orientation, "oklch"),
    darkMode: toContrast(pasos[indiceMedio]!.color) === "white",
    gradientRGB: gradientString(pasosRGB, orientation, "srgb"),
    pasosRGB: pasosRGB,
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
function gradientString(steps: GradientStep[], orientation: GradientOrientation, space: string) {
  return `linear-gradient(${orientation} in ${space}, ${steps
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

export type GradientDefinition = {
  gradient: string;
  darkMode: boolean;
  gradientRGB: string;
  pasosRGB: GradientStep[];
};

type GradientStep = {
  offset: number;
  color: string;
};
