import { Coordenates, Point } from "../models/bezier-curve";

export function drawBezierPanel(
  ctx: ImageBitmapRenderingContext,
  coords: Coordenates,
  size: number,
  active: "H1" | "H2" | null,
  color: string
) {
  const offscreen = new OffscreenCanvas(size, size);
  const offCtx = offscreen.getContext("2d")!;

  drawGrid(offCtx, size, color);

  const handlersColors = handlerColors(color);
  const colorCurve = curveColor(color);

  drawHandlerLine(offCtx, { x: 0, y: size }, coords.point1, handlersColors.line);

  drawHandler(offCtx, coords.point1, handlersColors.h1);

  drawHandlerLine(offCtx, { x: size, y: 0 }, coords.point2, handlersColors.line);

  drawHandler(offCtx, coords.point2, handlersColors.h2);

  if (active === "H1") {
    drawHandlerActive(offCtx, coords.point1, handlersColors.h1);
  } else if (active === "H2") {
    drawHandlerActive(offCtx, coords.point2, handlersColors.h2);
  }

  offCtx.beginPath();
  offCtx.moveTo(0, size);
  offCtx.strokeStyle = colorCurve;

  offCtx.bezierCurveTo(coords.point1.x, coords.point1.y, coords.point2.x, coords.point2.y, size, 0);
  offCtx.lineWidth = 2;
  offCtx.stroke();

  const bitmapOne = offscreen.transferToImageBitmap();
  ctx.transferFromImageBitmap(bitmapOne);
}

function drawGrid(ctx: OffscreenCanvasRenderingContext2D, size: number, color: string) {
  const colors = gridColors(color);
  ctx.beginPath();
  ctx.rect(0, 0, size, size);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  const ratio = size / 100;

  ctx.strokeStyle = colors.lines;

  for (let i = 10; i <= 90; i += 10) {
    ctx.beginPath();
    ctx.moveTo(0, i * ratio);
    ctx.lineTo(size, i * ratio);
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i * ratio, 0);
    ctx.lineTo(i * ratio, size);
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}
function drawHandler(ctx: OffscreenCanvasRenderingContext2D, point: Point, color: string) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawHandlerActive(ctx: OffscreenCanvasRenderingContext2D, point: Point, color: string) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawHandlerLine(ctx: OffscreenCanvasRenderingContext2D, start: Point, end: Point, color: string) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function handlerColors(color: string): { h1: string; h2: string; line: string } {
  return {
    h1: color === "black" ? "darkred" : "red",
    h2: color === "black" ? "navy" : "blue",
    line: color === "black" ? "#405040" : "#E0FFE0",
  };
}

function curveColor(color: string): string {
  return color === "black" ? "#303030" : "#D0D0D0";
}

function gridColors(color: string): { lines: string; border: string } {
  return {
    lines: color === "black" ? "#606060" : "#C0C0C0",
    border: color === "black" ? "#101010" : "#F0F0F0",
  };
}
