import { compassArrowColors, compassGridColors } from "./compass-colors";

export function drawCompass(
  ctx: ImageBitmapRenderingContext,
  angleDeg: number,
  diameter: number = 100,
  gridRadioSizeRatio: number = 0.84,
  presetSizeRatio: number = 0.9,
  presetHover: number | null = null,
  active: boolean = false,
  darkMode: boolean = false
) {
  const offscreenCanvas = new OffscreenCanvas(diameter, diameter);
  const offCtx = offscreenCanvas.getContext("2d");

  if (!offCtx) {
    return;
  }

  drawGrid(offCtx, diameter, gridRadioSizeRatio, presetSizeRatio, presetHover, angleDeg, darkMode);

  drawArrow(offCtx, angleDeg, diameter, gridRadioSizeRatio, active, darkMode);

  const image = offscreenCanvas.transferToImageBitmap();
  ctx.transferFromImageBitmap(image);
}

function drawGrid(
  ctx: OffscreenCanvasRenderingContext2D,
  diameter: number,
  gridRadioSizeRatio: number = 0.84,
  presetSizeRatio: number = 0.9,
  presetHover: number | null = null,
  angleDeg: number = 0,
  darkMode: boolean
) {
  const radio = Math.round(diameter / 2);

  ctx.beginPath();
  ctx.arc(radio, radio, Math.round(radio * gridRadioSizeRatio), 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.fillStyle = "#7A736E33";
  ctx.fill();
  ctx.setLineDash([]);
  ctx.strokeStyle = "transparent";

  const size = Math.round(gridRadioSizeRatio * radio);

  const colors = compassGridColors(darkMode);
  ctx.beginPath();
  ctx.arc(radio, radio, size, 0, Math.PI * 2);
  ctx.moveTo(radio, radio);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(radio, radio, Math.round(size * 0.2), 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.lines;
  ctx.stroke();

  ctx.strokeStyle = colors.lines;
  for (let i = 0; i <= 7; i++) {
    const angle = ((Math.PI * 2) / 8) * i;
    const cosenoBase = Math.cos(angle);
    const senoBase = Math.sin(angle);
    const deltaX = cosenoBase * size * 1.1;
    const deltaY = senoBase * size * 1.1;
    const x0 = Math.round(deltaX + radio);
    const y0 = Math.round(deltaY + radio);
    const x1 = Math.round(deltaX * 0.75 + radio);
    const y1 = Math.round(deltaY * 0.75 + radio);

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = 1;
    ctx.stroke();

    const currAngleDeg = ((i + 2) % 8) * 45;
    const markActive = angleDeg === currAngleDeg;
    const markHover = !markActive && presetHover !== null && presetHover === currAngleDeg;
    const color = markActive ? colors.activePreset : markHover ? colors.presetHover : colors.preset;
    ctx.beginPath();
    ctx.arc(
      Math.round(cosenoBase * radio * presetSizeRatio + radio),
      Math.round(senoBase * radio * presetSizeRatio + radio),
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
  diameter: number,
  gridRadioSizeRatio: number = 0.84,
  active: boolean,
  darkMode: boolean
) {
  const colors = compassArrowColors(darkMode);
  const radio = Math.round(diameter / 2);
  const size = Math.round(gridRadioSizeRatio * radio * 0.95);

  ctx.translate(radio, radio);
  ctx.rotate(((angleDegress - 180) * Math.PI) / 180);
  const y0 = size;

  if (active) {
    ctx.shadowColor = !darkMode ? "#606060" : "#303030";
    ctx.shadowBlur = 7;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }

  ctx.beginPath();
  ctx.moveTo(0, y0);
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
  ctx.moveTo(0, size + arrowOverflow);
  ctx.lineTo(-arrowWide, size - arrowLength + arrowOverflow);
  ctx.lineTo(0, size - arrowLength + arrowOverflow + arrowInset);
  ctx.lineTo(arrowWide, size - arrowLength + arrowOverflow);
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
