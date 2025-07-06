import Color from "colorjs.io";
import { toContrast, toRgb } from "../../color/model/color";
import { ColorValues } from "../../color/model/colors.model";
import { Point } from "./bezier-curve";

export function gradientFromPoints(
  source: ColorValues,
  destination: ColorValues,
  valores: Point[],
  orientation: string
) {
  console.debug("colors:", source, destination);
  const indiceMedio = indiceValorMedio(valores);

  const lRange = destination[0]! - source[0]!;
  const cRange = destination[1]! - source[1]!;

  let hSource = source[2]!;
  let hDestination = destination[2]!;
  const path = hDestination - hSource;

  if (path > 180) {
    hSource += 360;
  } else if (path < -180) {
    hDestination += 360;
  } else {
    console.debug("H range is not greater than 180 degrees, no adjustment needed.");
  }

  const hRange = hDestination - hSource;
  const hDelta = hSource;

  const lMin = source[0]!;
  const cMin = source[1]!;

  let midColor = "";

  const pasos = [] as string[];
  const pasosRGB = [] as { offset: number; color: string }[];
  let start = "";
  let end = "";
  for (let i = 0; i < valores.length; i++) {
    const stepRatio = valores[i]!.y;
    const lSource = (stepRatio * lRange) / 100 + lMin;
    const cSource = (stepRatio * cRange) / 100 + cMin;
    const hSource = (stepRatio * hRange) / 100 + hDelta;
    console.debug(`Step ${i}: l=${lSource.toFixed(3)}, c=${cSource.toFixed(3)}, h=${hSource.toFixed(1)}`);

    const pos = valores[i]!.x;
    const color = `oklch(${lSource.toFixed(3)} ${cSource.toFixed(3)} ${hSource.toFixed(1)})`;
    if (i === indiceMedio) {
      midColor = color;
    }
    if (i === 0) {
      start = color;
    }
    if (i === valores.length - 1) {
      end = color;
    }

    const rgb = toRgb(color).color;

    pasosRGB.push({ offset: pos, color: rgb });
    pasos.push(`${color} ${pos.toFixed(1)}%`);
  }

  return {
    start: start,
    end: end,
    gradient: `linear-gradient(${orientation} in oklch, ${pasos})`,
    contrast: toContrast(midColor),
    gradientRGB: `linear-gradient(${orientation} in srgb, ${pasosRGB
      .map((p) => `${p.color} ${p.offset.toFixed(1)}%`)
      .join(", ")})`,
    pasosRGB: pasosRGB,
  } as GradientDefinition;
}

export type GradientDefinition = {
  start: string;
  end: string;
  gradient: string;
  contrast: string;
  gradientRGB: string;
  pasosRGB: { offset: number; color: string }[];
};

// <stop offset="1" style="stop-color:rgb(140,140,20);stop-opacity:1"/>
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
