import { Point } from "../models/bezier-curve";
import { DoubleBezierColorConfig, DoubleBezierGridColors, DoubleHandlerColors } from "./double-bezier.draw-colors";
import { DoubleHandler, DoubleHandlers } from "./double-bezier-curve";

interface Context2D
  extends CanvasPath,
    CanvasPathDrawingStyles,
    CanvasDrawPath,
    CanvasDrawImage,
    CanvasShadowStyles,
    CanvasFillStrokeStyles {}

export class doubleBezierDrawing {
  private readonly widthFactor = 1;
  private readonly activeHandlerRadius = 10;
  public static readonly handlerRadius = 7;
  public static readonly virtualSize = 2000;
  private readonly activeHandlerShadowBlur = 7;
  private readonly activeHandlerShadowOffset = 5;
  private readonly gridLines = 20;

  private readonly ctx: Context2D;
  private readonly start: Point;
  private readonly center: Point;
  private readonly end: Point;
  private readonly vertices: { h1: Point; h2: Point; h3: Point; h4: Point };
  private readonly canvas: OffscreenCanvas;

  constructor(
    private imageContext: ImageBitmapRenderingContext,
    public size: number,
    private colors: DoubleBezierColorConfig
  ) {
    this.canvas = new OffscreenCanvas(size, size);
    const context = this.canvas.getContext("2d")!;
    context.imageSmoothingQuality = "high";
    context.imageSmoothingEnabled = true;

    this.ctx = context as Context2D;

    this.start = this.redondearPoint({ x: 0, y: this.size });
    this.center = this.redondearPoint({ x: this.size / 2, y: this.size / 2 });
    this.end = this.redondearPoint({ x: this.size, y: 0 });

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

    const handlersColors = this.doubleBezierHandlerColors(darkMode);

    const semiactivo = active === "h2" ? "h3" : active === "h3" ? "h2" : null;

    const segundo = active === "h1" ? "h1" : "h2";
    const primero = segundo === "h1" ? "h2" : "h1";

    this.drawHandler(this.vertices[primero], coords[primero], handlersColors, primero, false);
    this.drawHandler(
      this.vertices[segundo],
      coords[segundo],
      handlersColors,
      segundo,
      active === segundo,
      semiactivo === segundo
    );

    const cuarto = active === "h4" ? "h4" : "h3";
    const tercero = cuarto === "h4" ? "h3" : "h4";

    this.drawHandler(this.vertices[tercero], coords[tercero], handlersColors, tercero, false);
    this.drawHandler(
      this.vertices[cuarto],
      coords[cuarto],
      handlersColors,
      cuarto,
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
    this.ctx.strokeStyle = this.doubleBezierCurveColor(darkMode);
    this.ctx.bezierCurveTo(handler1.x, handler1.y, handler2.x, handler2.y, end.x, end.y);
    this.ctx.lineWidth = this.widthFactor * (active !== null ? 3 : 2);
    this.ctx.stroke();
  }
  private drawGrid(darkMode: boolean) {
    const colors = this.doubleBezierGridColors(darkMode);

    const ratio = this.size / doubleBezierDrawing.virtualSize;

    this.ctx.beginPath();
    this.ctx.rect(
      0,
      0,
      this.redondear(ratio * doubleBezierDrawing.virtualSize),
      this.redondear(ratio * doubleBezierDrawing.virtualSize)
    );
    this.ctx.strokeStyle = colors.border;
    this.ctx.lineWidth = this.redondear(this.widthFactor * 1);
    this.ctx.stroke();

    this.ctx.strokeStyle = colors.lines;

    this.ctx.setLineDash([1, 3]);

    for (let i = 10; i < doubleBezierDrawing.virtualSize; i += doubleBezierDrawing.virtualSize / this.gridLines) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.redondear(i * ratio));
      this.ctx.lineTo(this.size, this.redondear(i * ratio));
      this.ctx.lineWidth = this.redondear(this.widthFactor * 0.5);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(this.redondear(i * ratio), 0);
      this.ctx.lineTo(this.redondear(i * ratio), this.size);
      this.ctx.lineWidth = this.redondear(this.widthFactor * 0.5);
      this.ctx.stroke();
    }
    this.ctx.setLineDash([]);
  }

  private drawHandler(
    start: Point,
    end: Point,
    colors: DoubleHandlerColors,
    name: DoubleHandler,
    active: boolean,
    semiactive: boolean = false
  ) {
    if (active || semiactive) {
      this.ctx.shadowColor = colors.shadow;
      this.ctx.shadowBlur = this.activeHandlerShadowBlur;
      this.ctx.shadowOffsetX = this.activeHandlerShadowOffset;
      this.ctx.shadowOffsetY = this.activeHandlerShadowOffset;

      if (active) {
        this.drawHandlerActive(end, colors, name);
      }
    }
    this.drawHandlerLine(start, end, colors, active);

    if (!semiactive) {
      this.ctx.shadowColor = "transparent"; // Reset shadow
    }
    this.ctx.beginPath();
    this.ctx.arc(end.x, end.y, doubleBezierDrawing.handlerRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = colors[name];
    this.ctx.fill();

    this.ctx.shadowColor = "transparent"; // Reset shadow
  }
  private drawHandlerActive(point: Point, colors: DoubleHandlerColors, name: DoubleHandler) {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.activeHandlerRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = colors[name];
    this.ctx.lineWidth = this.redondear(this.widthFactor * 2);
    this.ctx.stroke();
  }

  private drawHandlerLine(start: Point, end: Point, colors: DoubleHandlerColors, active: boolean) {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.redondear(this.widthFactor * (active ? 1.5 : 1));
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.strokeStyle = active ? colors.activeline : colors.line;
    this.ctx.stroke();
  }

  private doubleBezierHandlerColors(darkMode: boolean): DoubleHandlerColors {
    return darkMode ? this.colors.handlerColors.dark : this.colors.handlerColors.light;
  }

  private doubleBezierCurveColor(darkMode: boolean): string {
    return darkMode ? this.colors.curveColor.dark : this.colors.curveColor.light;
  }

  private doubleBezierGridColors(darkMode: boolean): DoubleBezierGridColors {
    return darkMode ? this.colors.gridColors.dark : this.colors.gridColors.light;
  }

  public pointFromCanvas(point: Point): Point {
    const ratio = doubleBezierDrawing.virtualSize / this.size;
    return this.redondearPoint({
      x: this.redondear(Math.max(0, Math.min(point.x, this.size)) * ratio),
      y: this.redondear(Math.max(0, Math.min(this.size - point.y, this.size)) * ratio),
    });
  }

  public pointToCanvas(point: Point): Point {
    const ratio = this.size / doubleBezierDrawing.virtualSize;
    return this.redondearPoint({
      x: Math.max(0, Math.min(point.x, doubleBezierDrawing.virtualSize)) * ratio,
      y: this.size - Math.max(0, Math.min(point.y, doubleBezierDrawing.virtualSize)) * ratio,
    });
  }

  public redondearPoint(point: Point): Point {
    return {
      x: this.redondear(point.x),
      y: this.redondear(point.y),
    };
  }

  public redondear(value: number): number {
    return Math.round(value);
  }
}
