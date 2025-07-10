import { redondeo } from "../common/common-funcs";
import { compassArrowColors, compassGridColors } from "./compass-colors";

export const virtualSize = 2000;
export const gridRadioSizeRatio: number = 0.7;
export const presetSizeRatio: number = 0.9;

export function drawCompass(
  ctx: ImageBitmapRenderingContext,
  angleDeg: number,
  diameter: number = 100,
  presetHover: number | null = null,
  active: boolean = false,
  darkMode: boolean = false
) {
  const offscreenCanvas = new OffscreenCanvas(diameter, diameter);
  const offCtx = offscreenCanvas.getContext("2d");

  if (!offCtx) {
    return;
  }

  const ratio = diameter / virtualSize;
  const radio = virtualSize / 2;

  const parametros = {
    diameter,
    ratio: ratio,
    radio: virtualSize / 2,
    gridRadio: gridRadioSizeRatio * radio,
    center: redondeo.value(ratio * radio),
    presetSize: presetSizeRatio * radio,
    virtualSize,
  };

  const size = parametros.gridRadio * 0.95;
  const arrowOverflowValue = (arrowOverflow / parametros.diameter) * parametros.virtualSize;

  const paramsArrow = {
    size,
    arrowInsetValue: (arrowInset / parametros.diameter) * parametros.virtualSize,
    arrowOverflowValue: arrowOverflowValue,
    arrowWideValue: (arrowWide / parametros.diameter) * parametros.virtualSize,
    arrowTipBase: size - (arrowLength / parametros.diameter) * parametros.virtualSize + arrowOverflowValue,
    arrowTip: size + arrowOverflowValue,
  };

  drawGridSlim(offCtx, parametros, presetHover, angleDeg, darkMode);

  drawArrow(offCtx, angleDeg, parametros, paramsArrow, active, darkMode);

  const image = offscreenCanvas.transferToImageBitmap();
  ctx.transferFromImageBitmap(image);
}

function drawGridSlim(
  ctx: OffscreenCanvasRenderingContext2D,
  parametros: ParametrosCompass,
  presetHover: number | null = null,
  angleDeg: number = 0,
  darkMode: boolean
) {
  const centerX = parametros.center;
  const centerY = parametros.center;
  const radius = parametros.gridRadio * parametros.ratio;
  const steps = 8;
  const step = (Math.PI * 2) / steps;
  const rimOffset = -1;
  const innerCircleRadius = radius * 0.2;
  const presetRadius = 4;
  const ticksWidth = 1;
  const tickOffset = ticksWidth / 2;
  const ticksInner = parametros.gridRadio * 0.85 * parametros.ratio;
  const ticksLenght = 13;
  const presetCenter = parametros.presetSize * parametros.ratio;

  ctx.save();
  ctx.beginPath();
  ctx.arc(
    parametros.center,
    parametros.center,
    redondeo.value(parametros.ratio * parametros.gridRadio),
    0,
    Math.PI * 2
  );
  ctx.lineWidth = 1;
  ctx.fillStyle = "#7A736E33";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(centerX, centerY);

  ctx.beginPath();

  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.arc(0, 0, radius - rimOffset, 0, Math.PI * 2, true);
  ctx.arc(0, 0, innerCircleRadius, 0, Math.PI * 2);
  ctx.arc(0, 0, innerCircleRadius - rimOffset, 0, Math.PI * 2, true);

  for (let i = 0; i < steps; i++) {
    ctx.rotate(step);

    ctx.moveTo(Math.round(ticksInner), tickOffset);
    ctx.rect(Math.round(ticksInner), -tickOffset, ticksLenght, ticksWidth);

    ctx.moveTo(presetCenter, 0);
    ctx.arc(presetCenter, 0, presetRadius, 0, Math.PI * 2);
  }
  const colors = compassGridColors(darkMode);
  ctx.fillStyle = colors.lines;
  ctx.fill();
  ctx.restore();

  if (presetHover !== null) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(((Math.PI * 2) / 8) * ((presetHover - 90) / 45));
    ctx.beginPath();
    ctx.arc(presetCenter, 0, presetRadius, 0, Math.PI * 2);
    ctx.fillStyle = colors.presetHover;
    ctx.fill();
    ctx.restore();
  }
  const isPreset = (angleDeg + 90) % 45 === 0;
  if (isPreset) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(((Math.PI * 2) / 8) * ((angleDeg - 90) / 45));
    ctx.beginPath();
    ctx.arc(presetCenter, 0, presetRadius, 0, Math.PI * 2);
    ctx.fillStyle = colors.activePreset;
    ctx.fill();
    ctx.restore();
  }
}

const arrowWide = 5;
const arrowLength = 14;
const arrowOverflow = 4;
const arrowInset = -3;

export function drawArrow(
  ctx: OffscreenCanvasRenderingContext2D,
  angleDegress: number,
  parametros: ParametrosCompass,
  paramsArrow: ParametrosArrow,
  active: boolean,
  darkMode: boolean
) {
  const colors = compassArrowColors(darkMode);

  ctx.save();

  ctx.translate(parametros.center, parametros.center);
  ctx.rotate(((angleDegress - 180) * Math.PI) / 180);

  if (active) {
    ctx.shadowColor = !darkMode ? "#606060" : "#303030";
    ctx.shadowBlur = 7;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }

  ctx.beginPath();
  ctx.moveTo(0, redondeo.value(parametros.ratio * paramsArrow.size));
  ctx.lineTo(0, 0);
  ctx.strokeStyle = colors.lines;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fillStyle = colors.toe;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.strokeStyle = colors.lines;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, redondeo.value(parametros.ratio * paramsArrow.arrowTip));
  ctx.lineTo(
    redondeo.value(parametros.ratio * -paramsArrow.arrowWideValue),
    redondeo.value(parametros.ratio * paramsArrow.arrowTipBase)
  );
  ctx.lineTo(0, redondeo.value(parametros.ratio * (paramsArrow.arrowTipBase + paramsArrow.arrowInsetValue)));
  ctx.lineTo(
    redondeo.value(parametros.ratio * paramsArrow.arrowWideValue),
    redondeo.value(parametros.ratio * paramsArrow.arrowTipBase)
  );
  ctx.fillStyle = colors.tip;
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = colors.lines;
  ctx.lineWidth = 2;
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";
  ctx.stroke();

  ctx.restore();
}

type ParametrosCompass = {
  diameter: number;
  ratio: number;
  radio: number;
  gridRadio: number;
  center: number;
  presetSize: number;
  virtualSize: number;
};

type ParametrosArrow = {
  size: number;
  arrowInsetValue: number;
  arrowOverflowValue: number;
  arrowWideValue: number;
  arrowTipBase: number;
  arrowTip: number;
};
