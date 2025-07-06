export function drawCompass(
  ctx: ImageBitmapRenderingContext,
  angleDeg: number,
  diameter: number = 100,
  active: boolean = false,
  darkMode: boolean = false
) {
  const offscreenCanvas = new OffscreenCanvas(diameter, diameter);
  const offCtx = offscreenCanvas.getContext("2d");

  if (!offCtx) {
    return;
  }

  drawGrid(offCtx, diameter, darkMode);

  drawAngle(offCtx, angleDeg, diameter, darkMode);

  drawArrow(offCtx, angleDeg, diameter, active, darkMode);

  const image = offscreenCanvas.transferToImageBitmap();
  ctx.transferFromImageBitmap(image);
}

function drawAngle(ctx: OffscreenCanvasRenderingContext2D, angleDeg: number, diameter: number, darkMode: boolean) {
  const radio = Math.round(diameter / 2);

  ctx.font = "20px 'Noto Sans'";
  ctx.fillStyle = darkMode ? "oklch(0.904 0.104 18 / 0.9)" : "oklch(0.334 0.244 18 / 0.8)";

  const textSize = ctx.measureText(angleDeg.toFixed(0) + "°");
  const posicion = angleDeg >= 90 && angleDeg <= 270 ? -10 : 5 + textSize.fontBoundingBoxAscent;
  ctx.fillText(angleDeg.toFixed(0) + "°", 4 + radio - textSize.width / 2, radio + posicion);
}

const gridRadioSizeRatio = 0.84;
const arrowRadioSizeRatio = 0.85;

function drawGrid(ctx: OffscreenCanvasRenderingContext2D, diameter: number, darkMode: boolean) {
  const radio = Math.round(diameter / 2);

  ctx.beginPath();
  ctx.arc(radio, radio, radio, 0, Math.PI * 2);
  ctx.lineWidth = 0.5;
  ctx.fillStyle = "#80808040";
  ctx.fill();

  const size = Math.round(gridRadioSizeRatio * radio);

  const colors = gridColors(darkMode);
  ctx.beginPath();
  ctx.arc(radio, radio, size, 0, Math.PI * 2);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.setLineDash([2, 2]);
  ctx.strokeStyle = "#8080890";
  ctx.arc(radio, radio, size * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colors.lines;
  for (let i = 0; i <= 11; i++) {
    const angle = ((Math.PI * 2) / 12) * i;
    const coseno = Math.cos(angle) * size;
    const seno = Math.sin(angle) * size;
    const x0 = coseno + radio;
    const y0 = seno + radio;
    const x1 = coseno * 0.5 + radio;
    const y1 = seno * 0.5 + radio;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

function gridColors(darkMode: boolean): { lines: string; border: string } {
  return {
    lines: !darkMode ? "#606060" : "#cccccc",
    border: !darkMode ? "#404040" : "#DDDDDD",
  };
}

const arrowWide = 5;
const arrowLength = 14;
const arrowOverflow = 8;
const arrowInset = -3;
function drawArrow(
  ctx: OffscreenCanvasRenderingContext2D,
  angleDegress: number,
  diameter: number,
  active: boolean,
  darkMode: boolean
) {
  const colors = arrowColors(darkMode);
  const radio = Math.round(diameter / 2);
  const size = Math.round(arrowRadioSizeRatio * radio);

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

function arrowColors(darkMode: boolean): { lines: string; tip: string; toe: string } {
  return {
    lines: !darkMode ? "#606060" : "#cccccc",
    tip: !darkMode ? "oklch(0.634 0.254 18)" : "oklch(0.355 0.146 29)",
    toe: !darkMode ? "#d0d0d0" : "gray",
  };
}
