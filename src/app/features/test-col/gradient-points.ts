import { toContrast } from "../../color/model/color";
import { ColorValues } from "../../color/model/colors.model";

export function gradientFromPoints(
  source: ColorValues,
  destination: ColorValues,
  valores: { x: number[]; y: number[] },
  orientation: string
) {
  const menores = valores.x.filter((x) => x <= 50).sort((a, b) => b - a);
  const mayores = valores.x.filter((x) => x > 50).sort((a, b) => a - b);

  let indiceMedio = 0;
  if (50 - menores[0]! < mayores[0]! - 50) {
    indiceMedio = menores.length - 1;
  } else {
    indiceMedio = menores.length;
  }

  const lRange = destination[0]! - source[0]!;
  const cRange = destination[1]! - source[1]!;

  const pathA = destination[2]! - source[2]!;
  const pathB = source[2]! + 360 - destination[2]!;

  const hMin = source[2]!;
  let hDelta = hMin;
  let multiplier = 1;

  if (pathA > pathB) {
    source[2] = source[2]! + 360;
    hDelta = hMin + 360;
    multiplier = -1;
  }

  const hRange = Math.min(pathA, pathB);

  const lMin = source[0]!;
  const cMin = source[1]!;

  let midColor = "";

  const pasos = [] as string[];
  for (let i = 0; i < valores.x.length; i++) {
    const stepRatio = valores.y[i]!;
    const lSource = (stepRatio * lRange) / 100 + lMin;
    const cSource = (stepRatio * cRange) / 100 + cMin;
    const hSource = (multiplier * (stepRatio * hRange)) / 100 + hDelta;

    if (i === indiceMedio) {
      midColor = `oklch(${lSource.toFixed(3)} ${cSource.toFixed(3)} ${hSource.toFixed(1)})`;
    }

    const pos = valores.x[i]!;
    pasos.push(`oklch(${lSource.toFixed(3)} ${cSource.toFixed(3)} ${hSource.toFixed(1)}) ${pos.toFixed(1)}%`);
  }

  return { gradient: `linear-gradient(${orientation} in oklch, ${pasos})`, contrast: toContrast(midColor) };
}
