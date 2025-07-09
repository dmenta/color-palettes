import { DoubleBezierColors, DoubleHandlerColors } from "./double-bezier.draw-colors";
import { redondeo } from "../common/common-funcs";
import { Context2D } from "../models/context-2d";
import { DoubleGradientConfig } from "./double-bezier-config";
import { Point } from "../models/point.model";
import { DoubleHandler, DoubleHandlers } from "../models/double-handlers.model";

export class doubleBezierDrawing {
  private readonly ctx: Context2D;
  private readonly start: Point;
  private readonly center: Point;
  private readonly end: Point;
  private readonly vertices: { h1: Point; h2: Point; h3: Point; h4: Point };
  private readonly canvas: OffscreenCanvas;

  constructor(
    private imageContext: ImageBitmapRenderingContext,
    public size: number,
    private colors: DoubleBezierColors,
    private config: DoubleGradientConfig
  ) {
    this.canvas = new OffscreenCanvas(size, size);
    const context = this.canvas.getContext("2d")!;
    context.imageSmoothingQuality = "high";
    context.imageSmoothingEnabled = true;

    this.ctx = context as Context2D;

    this.start = redondeo.point({ x: 0, y: this.size });
    this.center = redondeo.point({ x: this.size / 2, y: this.size / 2 });
    this.end = redondeo.point({ x: this.size, y: 0 });

    this.vertices = {
      h1: this.start,
      h2: this.center,
      h3: this.center,
      h4: this.end,
    };
  }

  private handlersToCanvas(handlers: DoubleHandlers): DoubleHandlers {
    return {
      h1: this.pointToCanvas(handlers.h1),
      h2: this.pointToCanvas(handlers.h2),
      h3: this.pointToCanvas(handlers.h3),
      h4: this.pointToCanvas(handlers.h4),
    } as DoubleHandlers;
  }

  public draw(rawCoords: DoubleHandlers, active: DoubleHandler | null, darkMode: boolean) {
    const coords = this.handlersToCanvas(rawCoords);
    this.drawGrid(darkMode);

    const semiactivo = active === "h2" ? "h3" : active === "h3" ? "h2" : null;

    const segundo = active === "h1" ? "h1" : "h2";
    const primero = segundo === "h1" ? "h2" : "h1";

    this.drawHandler(this.vertices[primero], coords[primero], this.colors.handler(primero, darkMode), false);
    this.drawHandler(
      this.vertices[segundo],
      coords[segundo],
      this.colors.handler(segundo, darkMode),
      active === segundo,
      semiactivo === segundo
    );

    const cuarto = active === "h4" ? "h4" : "h3";
    const tercero = cuarto === "h4" ? "h3" : "h4";

    this.drawHandler(this.vertices[tercero], coords[tercero], this.colors.handler(tercero, darkMode), false);
    this.drawHandler(
      this.vertices[cuarto],
      coords[cuarto],
      this.colors.handler(cuarto, darkMode),
      active === cuarto,
      semiactivo === cuarto
    );

    this.drawBezier(this.start, this.center, coords.h1, coords.h2, darkMode, active !== null);
    this.drawBezier(this.center, this.end, coords.h3, coords.h4, darkMode, active !== null);

    const bitmapOne = this.canvas.transferToImageBitmap();
    this.imageContext.transferFromImageBitmap(bitmapOne);
  }

  private drawBezier(start: Point, end: Point, handler1: Point, handler2: Point, darkMode: boolean, active: boolean) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.strokeStyle = this.colors.curve(darkMode);
    this.ctx.bezierCurveTo(handler1.x, handler1.y, handler2.x, handler2.y, end.x, end.y);
    this.ctx.lineWidth = this.config.widthFactor * (active !== null ? 3 : 2);
    this.ctx.stroke();
  }
  private drawGrid(darkMode: boolean) {
    const colors = this.colors.grid(darkMode);

    const ratio = this.size / this.config.virtualSize;

    this.ctx.beginPath();
    this.ctx.rect(
      0,
      0,
      redondeo.value(ratio * this.config.virtualSize),
      redondeo.value(ratio * this.config.virtualSize)
    );
    this.ctx.strokeStyle = colors.border;
    this.ctx.lineWidth = redondeo.value(this.config.widthFactor * 1);
    this.ctx.stroke();

    this.ctx.strokeStyle = colors.lines;

    this.ctx.setLineDash([1, 3]);

    for (let i = 10; i < this.config.virtualSize; i += this.config.virtualSize / this.config.gridLines) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, redondeo.value(i * ratio));
      this.ctx.lineTo(this.size, redondeo.value(i * ratio));
      this.ctx.lineWidth = redondeo.value(this.config.widthFactor * 0.5);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(redondeo.value(i * ratio), 0);
      this.ctx.lineTo(redondeo.value(i * ratio), this.size);
      this.ctx.lineWidth = redondeo.value(this.config.widthFactor * 0.5);
      this.ctx.stroke();
    }
    this.ctx.setLineDash([]);
  }

  private drawHandler(
    start: Point,
    end: Point,
    colors: DoubleHandlerColors,
    active: boolean,
    semiactive: boolean = false
  ) {
    if (active || semiactive) {
      this.ctx.shadowColor = colors.common.shadow;
      this.ctx.shadowBlur = this.config.activeHandlerShadowBlur;
      this.ctx.shadowOffsetX = this.config.activeHandlerShadowOffset;
      this.ctx.shadowOffsetY = this.config.activeHandlerShadowOffset;

      if (active) {
        this.drawHandlerActive(end, colors);
      }
    }
    this.drawHandlerLine(start, end, colors, active);

    if (!semiactive) {
      this.ctx.shadowColor = "transparent"; // Reset shadow
    }
    this.ctx.beginPath();
    this.ctx.arc(end.x, end.y, this.config.handlerRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = colors.main;
    this.ctx.fill();

    this.ctx.shadowColor = "transparent"; // Reset shadow
  }
  private drawHandlerActive(point: Point, colors: DoubleHandlerColors) {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.config.activeHandlerRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = colors.main;
    this.ctx.lineWidth = redondeo.value(this.config.widthFactor * 2);
    this.ctx.stroke();
  }

  private drawHandlerLine(start: Point, end: Point, colors: DoubleHandlerColors, active: boolean) {
    this.ctx.beginPath();
    this.ctx.lineWidth = redondeo.value(this.config.widthFactor * (active ? 1.5 : 1));
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.strokeStyle = active ? colors.common.activeline : colors.common.line;
    this.ctx.stroke();
  }

  public pointFromCanvas(point: Point): Point {
    const ratio = this.config.virtualSize / this.size;
    return redondeo.point({
      x: redondeo.value(Math.max(0, Math.min(point.x, this.size)) * ratio),
      y: redondeo.value(Math.max(0, Math.min(this.size - point.y, this.size)) * ratio),
    });
  }

  public pointToCanvas(point: Point): Point {
    const ratio = this.size / this.config.virtualSize;
    return redondeo.point({
      x: Math.max(0, Math.min(point.x, this.config.virtualSize)) * ratio,
      y: this.size - Math.max(0, Math.min(point.y, this.config.virtualSize)) * ratio,
    });
  }
}
