import { toContrast, toRgb } from "../../color/model/color";
import { ColorValues } from "../../color/model/colors.model";
import { Point } from "./bezier-curve";
import { GradientOrientation } from "./orientations";

export function gradientFromPoints(
  source: ColorValues,
  destination: ColorValues,
  valores: Point[],
  orientation: GradientOrientation
) {
  const lVariation = lightnessVariation(source, destination);
  const cVariation = chromaVariation(source, destination);
  const hVariation = hueVariation(source, destination);

  const pasos: GradientStep[] = [];
  const pasosRGB: GradientStep[] = [];

  for (let i = 0; i < valores.length; i++) {
    const point = valores[i]!;
    const stepRatio = point.y / 100;
    const lSource = (stepRatio * lVariation.range + lVariation.delta).toFixed(3);
    const cSource = (stepRatio * cVariation.range + cVariation.delta).toFixed(3);
    const hSource = (stepRatio * hVariation.range + hVariation.delta).toFixed(1);

    const color = `oklch(${lSource} ${cSource} ${hSource})`;

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

function chromaVariation(source: ColorValues, destination: ColorValues) {
  return { range: destination[1]! - source[1]!, delta: source[1]! };
}

function lightnessVariation(source: ColorValues, destination: ColorValues) {
  return { range: destination[0]! - source[0]!, delta: source[0]! };
}

function hueVariation(source: ColorValues, destination: ColorValues) {
  const path = destination[2]! - source[2]!;
  const hSource = path > 180 ? source[2]! + 360 : source[2]!;
  const hDestination = path < -180 ? destination[2]! + 360 : destination[2]!;

  return { range: hDestination - hSource, delta: hSource };
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
