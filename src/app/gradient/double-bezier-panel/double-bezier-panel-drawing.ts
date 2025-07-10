import { DoubleBezierCenterColors, DoubleBezierColors, DoubleHandlerColors } from "./double-bezier.draw-colors";
import { redondeo } from "../common/common-funcs";
import { Context2D } from "../models/context-2d";
import { DoubleGradientConfig } from "./double-bezier-config";
import { Point } from "../models/point.model";
import { DoubleHandler, DoubleHandlers } from "../models/double-handlers.model";

export class doubleBezierDrawing {
  private readonly handlersKeys = ["h4", "h3", "h2", "h1"] as const;
  private readonly ctx: Context2D;
  private readonly start: Point;
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
    this.end = redondeo.point({ x: this.size, y: 0 });

    this.vertices = {
      h1: this.start,
      h2: this.start,
      h3: this.end,
      h4: this.end,
    };
  }

  private handlersToCanvas(handlers: DoubleHandlers): DoubleHandlers {
    return {
      h1: this.pointToCanvas(handlers.h1),
      h2: this.pointToCanvas(handlers.h2),
      h3: this.pointToCanvas(handlers.h3!),
      h4: this.pointToCanvas(handlers.h4!),
    } as DoubleHandlers;
  }

  public oppositeHandler(center: Point, moving: Point, opposite: Point) {
    let deltaY = center.y - moving.y;
    let deltaX = center.x - moving.x;

    deltaY = Math.abs(deltaY) < 0.25 ? Math.sign(deltaY) * 0.25 : deltaY;
    deltaX = Math.abs(deltaX) < 0.25 ? Math.sign(deltaX) * 0.25 : deltaX;

    const hMoving = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    const hOpposite = Math.sqrt(Math.pow(opposite.x - center.x, 2) + Math.pow(opposite.y - center.y, 2));

    return redondeo.point({
      x: center.x + (deltaX / hMoving) * hOpposite,
      y: center.y + (deltaY / hMoving) * hOpposite,
    });
  }

  public draw(rawCoords: DoubleHandlers, active: ActiveHandler, darkMode: boolean, centerRaw: Point) {
    const center = this.pointToCanvas(centerRaw);
    this.vertices.h2 = center;
    this.vertices.h3 = center;

    const coords = this.handlersToCanvas(rawCoords);

    this.drawGridSlim(darkMode);

    const semiactivo = active === "h2" ? "h3" : active === "h3" ? "h2" : null;

    for (const key of this.handlersKeys) {
      if (key === active || key === semiactivo) {
        continue;
      }
      this.drawHandler(this.vertices[key], coords[key]!, this.colors.handler(key, darkMode));
    }

    this.drawBezier(this.start, center, coords.h1, coords.h2, darkMode, active !== null);
    this.drawBezier(center, this.end, coords.h3!, coords.h4!, darkMode, active !== null);

    if (active !== null && active !== "center") {
      this.drawActiveHandlerSlim(this.vertices[active], coords[active]!, this.colors.handler(active, darkMode));
      if (semiactivo) {
        this.drawSemiActiveHandlerSlim(
          this.vertices[semiactivo],
          coords[semiactivo]!,
          this.colors.handler(semiactivo, darkMode)
        );
      }
    }

    if (active === "center") {
      this.drawCenterHandlerActive(center, this.colors.center(darkMode));
    } else {
      this.drawCenterHandler(center, this.colors.center(darkMode), false);
    }

    const bitmapOne = this.canvas.transferToImageBitmap();
    this.imageContext.transferFromImageBitmap(bitmapOne);
  }

  private drawBezier(start: Point, end: Point, handler1: Point, handler2: Point, darkMode: boolean, active: boolean) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.bezierCurveTo(handler1.x, handler1.y, handler2.x, handler2.y, end.x, end.y);

    this.ctx.strokeStyle = this.colors.curve(darkMode);
    this.ctx.lineWidth = this.config.widthFactor * (active !== null ? 3 : 2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawGridSlim(darkMode: boolean) {
    const colors = this.colors.grid(darkMode);

    const ratio = this.size / this.config.virtualSize;
    const gridSpacing = this.config.virtualSize / this.config.gridLines;

    this.ctx.save();
    this.ctx.beginPath();

    for (let i = 1; i < this.config.gridLines; i++) {
      const posicion = redondeo.value(i * gridSpacing * ratio);
      this.ctx.moveTo(0, posicion);
      this.ctx.lineTo(this.size, posicion);
      this.ctx.moveTo(posicion, 0);
      this.ctx.lineTo(posicion, this.size);
    }

    this.ctx.setLineDash([1, 3]);
    this.ctx.strokeStyle = colors.lines;
    this.ctx.lineWidth = redondeo.value(this.config.widthFactor * 0.5);
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.save();
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
    this.ctx.restore();
  }

  private drawCenterHandler(center: Point, colors: DoubleBezierCenterColors, active: boolean) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = active ? colors.active : colors.main;
    this.ctx.fillRect(
      redondeo.value(center.x - this.config.handlerRadius),
      redondeo.value(center.y - this.config.handlerRadius),
      redondeo.value(this.config.handlerRadius * 2),
      redondeo.value(this.config.handlerRadius * 2)
    );
    this.ctx.restore();
  }

  private drawCenterHandlerActive(center: Point, colors: DoubleBezierCenterColors) {
    this.ctx.save();

    this.ctx.shadowColor = colors.shadow;
    this.ctx.shadowBlur = this.config.activeHandlerShadowBlur;
    this.ctx.shadowOffsetX = this.config.activeHandlerShadowOffset;
    this.ctx.shadowOffsetY = this.config.activeHandlerShadowOffset;

    const outerSize = redondeo.value(this.config.handlerRadius * 3 + this.config.widthFactor * 2);
    const innerSize = redondeo.value(this.config.handlerRadius * 3);
    const centerSize = redondeo.value(this.config.handlerRadius * 2);

    this.ctx.translate(center.x, center.y);

    this.ctx.beginPath();
    this.ctx.rect(outerSize / -2, outerSize / -2, outerSize, outerSize);
    this.ctx.rect(innerSize / -2, innerSize / -2, innerSize, innerSize);

    this.ctx.rect(
      redondeo.value(-this.config.handlerRadius),
      redondeo.value(-this.config.handlerRadius),
      centerSize,
      centerSize
    );

    this.ctx.fillStyle = colors.active;
    this.ctx.fill("evenodd");

    this.ctx.restore();
  }

  private drawHandler(origin: Point, point: Point, colors: DoubleHandlerColors) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineWidth = redondeo.value(this.config.widthFactor * 1);
    this.ctx.moveTo(origin.x, origin.y);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.strokeStyle = colors.common.line;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.config.handlerRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = colors.main;
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawActiveHandlerSlim(origin: Point, point: Point, colors: DoubleHandlerColors) {
    this.ctx.save();
    this.ctx.shadowColor = colors.common.shadow;
    this.ctx.shadowBlur = this.config.activeHandlerShadowBlur;
    this.ctx.shadowOffsetX = this.config.activeHandlerShadowOffset;
    this.ctx.shadowOffsetY = this.config.activeHandlerShadowOffset;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineWidth = redondeo.value(this.config.widthFactor * 1.5);
    this.ctx.moveTo(origin.x, origin.y);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.strokeStyle = colors.common.activeline;
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.translate(point.x, point.y);

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.config.handlerRadius, 0, Math.PI * 2); // Outer circle
    this.ctx.arc(0, 0, this.config.activeHandlerRadius, 0, Math.PI * 2, true); // Outer circle
    this.ctx.arc(0, 0, this.config.activeHandlerRadius + redondeo.value(this.config.widthFactor * 2), 0, Math.PI * 2); // Outer circle
    this.ctx.fillStyle = colors.main;
    this.ctx.fill("evenodd");
    this.ctx.restore();
  }

  private drawSemiActiveHandlerSlim(origin: Point, point: Point, colors: DoubleHandlerColors) {
    this.ctx.save();
    this.ctx.shadowColor = colors.common.shadow;
    this.ctx.shadowBlur = this.config.activeHandlerShadowBlur;
    this.ctx.shadowOffsetX = this.config.activeHandlerShadowOffset;
    this.ctx.shadowOffsetY = this.config.activeHandlerShadowOffset;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(origin.x, origin.y);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.lineWidth = redondeo.value(this.config.widthFactor * 1);
    this.ctx.strokeStyle = colors.common.line;
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.config.handlerRadius, 0, Math.PI * 2); // Outer circle
    this.ctx.fillStyle = colors.main;
    this.ctx.fill();
    this.ctx.restore();
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

export type ActiveHandler = DoubleHandler | "center" | null;
