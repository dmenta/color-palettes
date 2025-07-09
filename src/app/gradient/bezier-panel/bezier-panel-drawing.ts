import { redondeo } from "../common/common-funcs";
import { Handler, Handlers, Point } from "../models/bezier-curve";
import { Context2D } from "../models/context-2d";
import { bezierCurveColor, bezierGridColors, bezierHandleColors, HandlerColors } from "./bezier.draw-colors";

const widthFactor = 1;
const activeHandlerRadius = 18;
export const handlerRadius = 10;
export const virtualSize = 2000;
const activeHandlerShadowBlur = 7;
const activeHandlerShadowOffset = 5;
const gridLines = 10;

export function drawBezierPanel(
  ctx: ImageBitmapRenderingContext,
  coords: Handlers,
  size: number,
  active: Handler | null,
  darkMode: boolean
) {
  const offscreen = new OffscreenCanvas(size, size);
  const offCtx = offscreen.getContext("2d")!;

  offCtx.imageSmoothingQuality = "high";
  offCtx.imageSmoothingEnabled = true;

  drawGrid(offCtx, size, darkMode);

  const handlersColors = bezierHandleColors(darkMode);
  const colorCurve = bezierCurveColor(darkMode);

  const origin = redondeo.point({ x: 0, y: size });
  const end = redondeo.point({ x: size, y: 0 });

  const vertice = {
    h1: origin,
    h2: end,
  };

  const ultimo = active ?? "h1";
  const primero = ultimo === "h2" ? "h1" : "h2";

  drawHandler(offCtx, vertice[primero], coords[primero], handlersColors, primero, false);
  drawHandler(offCtx, vertice[ultimo], coords[ultimo], handlersColors, ultimo, active === ultimo);

  offCtx.beginPath();
  offCtx.moveTo(origin.x, origin.y);
  offCtx.strokeStyle = colorCurve;
  offCtx.bezierCurveTo(coords.h1.x, coords.h1.y, coords.h2.x, coords.h2.y, end.x, end.y);
  offCtx.lineWidth = widthFactor * (active !== null ? 3 : 2);
  offCtx.stroke();

  const bitmapOne = offscreen.transferToImageBitmap();
  (ctx as ImageBitmapRenderingContext).transferFromImageBitmap(bitmapOne);
}

function drawGrid(ctx: Context2D, size: number, darkMode: boolean) {
  const colors = bezierGridColors(darkMode);

  const ratio = size / virtualSize;

  ctx.beginPath();
  ctx.rect(0, 0, redondeo.value(ratio * virtualSize), redondeo.value(ratio * virtualSize));
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = redondeo.value(widthFactor * 1);
  ctx.stroke();

  ctx.strokeStyle = colors.lines;

  ctx.setLineDash([1, 3]);

  const gridSpacing = virtualSize / gridLines;

  for (let i = virtualSize / gridLines; i < virtualSize; i += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, redondeo.value(i * ratio));
    ctx.lineTo(size, redondeo.value(i * ratio));
    ctx.lineWidth = redondeo.value(widthFactor * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(redondeo.value(i * ratio), 0);
    ctx.lineTo(redondeo.value(i * ratio), size);
    ctx.lineWidth = redondeo.value(widthFactor * 0.5);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawHandler(ctx: Context2D, start: Point, end: Point, colors: HandlerColors, name: Handler, active: boolean) {
  drawHandlerLine(ctx, start, end, colors, active);

  ctx.beginPath();
  ctx.arc(end.x, end.y, handlerRadius, 0, Math.PI * 2);
  ctx.fillStyle = colors[name];
  ctx.fill();
  if (active) {
    drawHandlerActive(ctx, end, colors, name);
  }
}
function drawHandlerActive(ctx: Context2D, point: Point, colors: HandlerColors, name: Handler) {
  // Shadow
  ctx.shadowColor = colors.shadow;
  ctx.shadowBlur = activeHandlerShadowBlur;
  ctx.shadowOffsetX = activeHandlerShadowOffset;
  ctx.shadowOffsetY = activeHandlerShadowOffset;

  ctx.beginPath();
  ctx.arc(point.x, point.y, activeHandlerRadius, 0, Math.PI * 2);
  ctx.strokeStyle = colors[name];
  ctx.lineWidth = redondeo.value(widthFactor * 2);
  ctx.stroke();

  ctx.shadowColor = "transparent"; // Reset shadow
}

function drawHandlerLine(ctx: Context2D, start: Point, end: Point, colors: HandlerColors, active: boolean) {
  ctx.beginPath();
  ctx.lineWidth = redondeo.value(widthFactor * (active ? 1.5 : 1));
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = active ? colors.activeline : colors.line;
  ctx.stroke();
}

export function pointFromCanvas(point: Point, size: number): Point {
  const ratio = virtualSize / size;
  return redondeo.point({
    x: redondeo.value(Math.max(0, Math.min(point.x, size)) * ratio),
    y: redondeo.value(Math.max(0, Math.min(size - point.y, size)) * ratio),
  });
}

export function pointToCanvas(point: Point, size: number): Point {
  const ratio = size / virtualSize;
  return redondeo.point({
    x: Math.max(0, Math.min(point.x, virtualSize)) * ratio,
    y: size - Math.max(0, Math.min(point.y, virtualSize)) * ratio,
  });
}
