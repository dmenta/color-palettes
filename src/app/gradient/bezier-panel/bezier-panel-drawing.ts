import { Handlers, Handler, Point } from "../models/bezier-curve";

export function drawBezierPanel(
  ctx: ImageBitmapRenderingContext,
  coords: Handlers,
  size: number,
  active: Handler | null,
  darkMode: boolean
) {
  const offscreen = new OffscreenCanvas(size, size);
  const offCtx = offscreen.getContext("2d")!;

  drawGrid(offCtx, size, darkMode);

  const handlersColors = handlerColors(darkMode);
  const colorCurve = curveColor(darkMode);

  drawHandlerLine(offCtx, { x: size, y: 0 }, coords.h2, handlersColors.line);

  drawHandler(offCtx, coords.h2, handlersColors.h2);

  drawHandlerLine(offCtx, { x: 0, y: size }, coords.h1, handlersColors.line);

  drawHandler(offCtx, coords.h1, handlersColors.h1);

  if (active === "h1") {
    drawHandlerActive(offCtx, coords.h1, handlersColors.h1);
  } else if (active === "h2") {
    drawHandlerActive(offCtx, coords.h2, handlersColors.h2);
  }

  offCtx.beginPath();
  offCtx.moveTo(0, size);
  offCtx.strokeStyle = colorCurve;

  offCtx.bezierCurveTo(coords.h1.x, coords.h1.y, coords.h2.x, coords.h2.y, size, 0);
  offCtx.lineWidth = 2;
  offCtx.stroke();

  const bitmapOne = offscreen.transferToImageBitmap();
  ctx.transferFromImageBitmap(bitmapOne);
}

function drawGrid(ctx: OffscreenCanvasRenderingContext2D, size: number, darkMode: boolean) {
  const colors = gridColors(darkMode);
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
  ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawHandlerActive(ctx: OffscreenCanvasRenderingContext2D, point: Point, color: string) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawHandlerLine(ctx: OffscreenCanvasRenderingContext2D, start: Point, end: Point, color: string) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function handlerColors(darkMode: boolean): { h1: string; h2: string; line: string } {
  return {
    h1: !darkMode ? "oklch(0.355 0.146 29)" : "oklch(0.634 0.254 18)",
    h2: !darkMode ? "oklch(0.377 0.1 247)" : "oklch(0.858 0.146 197)",
    line: !darkMode ? "#305030" : "#E0FFE0",
  };
}

function curveColor(darkMode: boolean): string {
  return !darkMode ? "#303030" : "#D0D0D0";
}

function gridColors(darkMode: boolean): { lines: string; border: string } {
  return {
    lines: !darkMode ? "#606060" : "#C0C0C0",
    border: !darkMode ? "#101010" : "#F0F0F0",
  };
}

export function pointFromCanvas(point: Point, size: number): Point {
  const ratio = 100 / size;
  return {
    x: Math.max(0, Math.min(point.x, size)) * ratio,
    y: Math.max(0, Math.min(size - point.y, size)) * ratio,
  };
}

export function pointToCanvas(point: Point, size: number): Point {
  const ratio = size / 100;
  return {
    x: Math.max(0, Math.min(point.x, 100)) * ratio,
    y: size - Math.max(0, Math.min(point.y, size)) * ratio,
  };
}
