import { Handlers, Handler, Point } from "../models/bezier-curve";
import { bezierCurveColor, bezierGridColors, bezierHandleColors, HandlerColors } from "./bezier.draw-colors";

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

  const handlersColors = bezierHandleColors(darkMode);
  const colorCurve = bezierCurveColor(darkMode);

  drawHandler(offCtx, { x: size, y: 0 }, coords.h2, handlersColors, "h2", active === "h2");
  drawHandler(offCtx, { x: 0, y: size }, coords.h1, handlersColors, "h1", active === "h1");

  offCtx.beginPath();
  offCtx.moveTo(0, size);
  offCtx.strokeStyle = colorCurve;

  offCtx.bezierCurveTo(coords.h1.x, coords.h1.y, coords.h2.x, coords.h2.y, size, 0);
  offCtx.lineWidth = active !== null ? 3 : 2;
  offCtx.stroke();

  const bitmapOne = offscreen.transferToImageBitmap();
  ctx.transferFromImageBitmap(bitmapOne);
}

function drawGrid(ctx: OffscreenCanvasRenderingContext2D, size: number, darkMode: boolean) {
  const colors = bezierGridColors(darkMode);
  ctx.beginPath();
  ctx.rect(0, 0, size, size);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  const ratio = size / 100;

  ctx.strokeStyle = colors.lines;

  ctx.setLineDash([2, 2]);

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
  ctx.setLineDash([]);
}

function drawHandler(
  ctx: OffscreenCanvasRenderingContext2D,
  start: Point,
  end: Point,
  colors: HandlerColors,
  name: "h1" | "h2" = "h1",
  active: boolean
) {
  drawHandlerLine(ctx, start, end, colors, active);

  ctx.beginPath();
  ctx.arc(end.x, end.y, 7, 0, Math.PI * 2);
  ctx.fillStyle = colors[name];
  ctx.fill();
  if (active) {
    drawHandlerActive(ctx, end, colors, name);
  }
}

function drawHandlerActive(
  ctx: OffscreenCanvasRenderingContext2D,
  point: Point,
  colors: HandlerColors,
  name: "h1" | "h2" = "h1"
) {
  // Shadow
  ctx.shadowColor = colors.shadow;
  ctx.shadowBlur = 7;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;

  ctx.beginPath();
  ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
  ctx.strokeStyle = colors[name];
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.shadowColor = "transparent"; // Reset shadow
}

function drawHandlerLine(
  ctx: OffscreenCanvasRenderingContext2D,
  start: Point,
  end: Point,
  colors: HandlerColors,
  active: boolean
) {
  ctx.beginPath();
  ctx.lineWidth = active ? 1.5 : 1;
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = active ? colors.activeline : colors.line;
  ctx.stroke();
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
