import { Handler, Handlers, Point } from "../models/bezier-curve";
import { bezierCurveColor, bezierGridColors, bezierHandleColors, HandlerColors } from "./bezier.draw-colors";

const widthFactor = 1;
const activeHandlerRadius = 10;
export const handlerRadius = 7;
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

  const firstOrigin = redondearPoint({ x: 0, y: size });
  const firstEnd = redondearPoint({ x: size, y: 0 });

  drawHandler(offCtx, firstEnd, coords.h2, handlersColors, "h2", active === "h2");
  drawHandler(offCtx, firstOrigin, coords.h1, handlersColors, "h1", active === "h1");

  offCtx.beginPath();
  offCtx.moveTo(firstOrigin.x, firstOrigin.y);
  offCtx.strokeStyle = colorCurve;
  offCtx.bezierCurveTo(coords.h1.x, coords.h1.y, coords.h2.x, coords.h2.y, firstEnd.x, firstEnd.y);
  offCtx.lineWidth = widthFactor * (active !== null ? 3 : 2);
  offCtx.stroke();

  const bitmapOne = offscreen.transferToImageBitmap();
  (ctx as ImageBitmapRenderingContext).transferFromImageBitmap(bitmapOne);
}

function drawGrid(ctx: Context2D, size: number, darkMode: boolean) {
  const colors = bezierGridColors(darkMode);

  const ratio = size / virtualSize;

  ctx.beginPath();
  ctx.rect(0, 0, redondear(ratio * virtualSize), redondear(ratio * virtualSize));
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = redondear(widthFactor * 1);
  ctx.stroke();

  ctx.strokeStyle = colors.lines;

  ctx.setLineDash([1, 3]);

  const gridSpacing = virtualSize / gridLines;

  for (let i = virtualSize / gridLines; i < virtualSize; i += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, redondear(i * ratio));
    ctx.lineTo(size, redondear(i * ratio));
    ctx.lineWidth = redondear(widthFactor * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(redondear(i * ratio), 0);
    ctx.lineTo(redondear(i * ratio), size);
    ctx.lineWidth = redondear(widthFactor * 0.5);
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
  ctx.lineWidth = redondear(widthFactor * 2);
  ctx.stroke();

  ctx.shadowColor = "transparent"; // Reset shadow
}

function drawHandlerLine(ctx: Context2D, start: Point, end: Point, colors: HandlerColors, active: boolean) {
  ctx.beginPath();
  ctx.lineWidth = redondear(widthFactor * (active ? 1.5 : 1));
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = active ? colors.activeline : colors.line;
  ctx.stroke();
}

export function pointFromCanvas(point: Point, size: number): Point {
  const ratio = virtualSize / size;
  return redondearPoint({
    x: redondear(Math.max(0, Math.min(point.x, size)) * ratio),
    y: redondear(Math.max(0, Math.min(size - point.y, size)) * ratio),
  });
}

export function pointToCanvas(point: Point, size: number): Point {
  const ratio = size / virtualSize;
  return redondearPoint({
    x: Math.max(0, Math.min(point.x, virtualSize)) * ratio,
    y: size - Math.max(0, Math.min(point.y, virtualSize)) * ratio,
  });
}

export function redondearPoint(point: Point): Point {
  return {
    x: redondear(point.x),
    y: redondear(point.y),
  };
}

export function redondear(value: number): number {
  return Math.round(value);
}
interface Context2D
  extends CanvasPath,
    CanvasPathDrawingStyles,
    CanvasDrawPath,
    CanvasDrawImage,
    CanvasShadowStyles,
    CanvasFillStrokeStyles {}
