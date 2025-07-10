import { redondeo } from "../common/common-funcs";
import { Context2D } from "../models/context-2d";
import { Handler, Handlers } from "../models/handlers.model";
import { Point } from "../models/point.model";
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

  const origin = redondeo.point({ x: 0, y: size });
  const end = redondeo.point({ x: size, y: 0 });

  const handlersColors = bezierHandleColors(darkMode);

  offCtx.save();

  offCtx.globalCompositeOperation = "destination-over";
  if (active !== "h2") {
    drawHandler(offCtx, end, coords.h2, handlersColors, "h2");
  }
  if (active !== "h1") {
    drawHandler(offCtx, origin, coords.h1, handlersColors, "h1");
  }
  offCtx.restore();

  offCtx.save();
  if (active === null) {
    offCtx.globalCompositeOperation = "destination-over";
  }

  drawBezierCurve(offCtx, origin, end, coords, active !== null, darkMode);
  offCtx.restore();

  if (active !== null) {
    drawActiveHandlerSlim(offCtx, active === "h1" ? origin : end, coords[active], handlersColors, active);
  }

  offCtx.save();
  offCtx.globalCompositeOperation = "destination-over";
  drawGrid(offCtx, size, darkMode);

  offCtx.restore();

  const bitmapOne = offscreen.transferToImageBitmap();
  (ctx as ImageBitmapRenderingContext).transferFromImageBitmap(bitmapOne);
}

function drawBezierCurve(
  ctx: Context2D,
  origin: Point,
  end: Point,
  coords: Handlers,
  active: boolean,
  darkMode: boolean
) {
  const colorCurve = bezierCurveColor(darkMode);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.strokeStyle = colorCurve;
  ctx.bezierCurveTo(coords.h1.x, coords.h1.y, coords.h2.x, coords.h2.y, end.x, end.y);
  ctx.lineWidth = widthFactor * (active !== null ? 3 : 2);
  ctx.stroke();
  ctx.restore();
}

function drawGrid(ctx: Context2D, size: number, darkMode: boolean) {
  const colors = bezierGridColors(darkMode);

  const ratio = size / virtualSize;
  const gridSpacing = virtualSize / gridLines;

  ctx.save();
  ctx.beginPath();

  for (let i = 1; i < gridLines; i++) {
    const posicion = redondeo.value(i * gridSpacing * ratio);
    ctx.moveTo(0, posicion);
    ctx.lineTo(size, posicion);
    ctx.moveTo(posicion, 0);
    ctx.lineTo(posicion, size);
  }

  ctx.setLineDash([1, 3]);
  ctx.strokeStyle = colors.lines;
  ctx.lineWidth = redondeo.value(widthFactor * 0.5);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, redondeo.value(ratio * virtualSize), redondeo.value(ratio * virtualSize));
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = redondeo.value(widthFactor * 1);
  ctx.stroke();
  ctx.restore();
}

function drawHandler(ctx: Context2D, start: Point, end: Point, colors: HandlerColors, name: Handler) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(end.x, end.y, handlerRadius, 0, Math.PI * 2);
  ctx.fillStyle = colors[name];
  ctx.fill();

  ctx.beginPath();
  ctx.lineWidth = redondeo.value(widthFactor);
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = colors.line;
  ctx.stroke();

  ctx.restore();
}

function drawActiveHandlerSlim(ctx: Context2D, origin: Point, point: Point, colors: HandlerColors, name: Handler) {
  ctx.save();
  ctx.shadowColor = colors.shadow;
  ctx.shadowBlur = activeHandlerShadowBlur;
  ctx.shadowOffsetX = activeHandlerShadowOffset;
  ctx.shadowOffsetY = activeHandlerShadowOffset;

  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = redondeo.value(widthFactor * 1.5);
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(point.x, point.y);
  ctx.strokeStyle = colors.activeline;
  ctx.stroke();
  ctx.restore();

  ctx.translate(point.x, point.y);

  ctx.beginPath();
  ctx.arc(0, 0, handlerRadius, 0, Math.PI * 2); // Outer circle
  ctx.arc(0, 0, activeHandlerRadius, 0, Math.PI * 2, true); // Outer circle
  ctx.arc(0, 0, activeHandlerRadius - redondeo.value(widthFactor * 2), 0, Math.PI * 2); // Outer circle
  ctx.fillStyle = colors[name];
  ctx.fill("evenodd");
  ctx.restore();
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
