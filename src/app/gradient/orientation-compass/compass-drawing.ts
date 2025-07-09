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

  drawGrid(offCtx, parametros, presetHover, angleDeg, darkMode);

  drawArrow(offCtx, angleDeg, parametros, paramsArrow, active, darkMode);

  const image = offscreenCanvas.transferToImageBitmap();
  ctx.transferFromImageBitmap(image);
}

function drawGrid(
  ctx: OffscreenCanvasRenderingContext2D,
  parametros: ParametrosCompass,
  presetHover: number | null = null,
  angleDeg: number = 0,
  darkMode: boolean
) {
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
  ctx.setLineDash([]);
  ctx.strokeStyle = "transparent";

  const colors = compassGridColors(darkMode);
  ctx.beginPath();
  ctx.arc(
    parametros.center,
    parametros.center,
    redondeo.value(parametros.ratio * parametros.gridRadio),
    0,
    Math.PI * 2
  );
  ctx.moveTo(parametros.center, parametros.center);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    parametros.center,
    parametros.center,
    redondeo.value(parametros.ratio * parametros.gridRadio * 0.2),
    0,
    Math.PI * 2
  );
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.lines;
  ctx.stroke();

  ctx.strokeStyle = colors.lines;
  for (let i = 0; i <= 7; i++) {
    const angle = ((Math.PI * 2) / 8) * i;
    const cosenoBase = Math.cos(angle);
    const senoBase = Math.sin(angle);
    const deltaX = parametros.gridRadio * cosenoBase * 1.1;
    const deltaY = parametros.gridRadio * senoBase * 1.1;
    const x0 = deltaX + parametros.radio;
    const y0 = deltaY + parametros.radio;
    const x1 = deltaX * 0.75 + parametros.radio;
    const y1 = deltaY * 0.75 + parametros.radio;

    ctx.beginPath();
    ctx.moveTo(redondeo.value(parametros.ratio * x0), redondeo.value(parametros.ratio * y0));
    ctx.lineTo(redondeo.value(parametros.ratio * x1), redondeo.value(parametros.ratio * y1));
    ctx.lineWidth = 1;
    ctx.stroke();

    const currAngleDeg = ((i + 2) % 8) * 45;
    const markActive = angleDeg === currAngleDeg;
    const markHover = !markActive && presetHover !== null && presetHover === currAngleDeg;
    const color = markActive ? colors.activePreset : markHover ? colors.presetHover : colors.preset;

    const presetCenterX = cosenoBase * parametros.presetSize + parametros.radio;
    const presetCenterY = senoBase * parametros.presetSize + parametros.radio;

    ctx.beginPath();
    ctx.arc(
      redondeo.value(parametros.ratio * presetCenterX),
      redondeo.value(parametros.ratio * presetCenterY),
      4,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = color;
    ctx.fill();
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

  ctx.shadowColor = "transparent";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
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
