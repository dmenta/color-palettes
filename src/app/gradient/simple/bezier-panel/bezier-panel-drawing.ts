import { redondeo } from "../../common/common-funcs";
import { Context2D } from "../../common/models/context-2d";
import { Handler, Handlers } from "../models/handlers.model";
import { Point } from "../../common/models/point.model";
import { SimpleBezierColors } from "./bezier.draw-colors";

export const virtualSize = 2000;

export class BezierPanelDrawing {
  public readonly handlerRadius = 10;
  private readonly widthFactor = 1;
  private readonly activeHandlerRadius = 18;
  private readonly activeHandlerShadowBlur = 7;
  private readonly activeHandlerShadowOffset = 5;
  private readonly gridLines = 10;

  private readonly ctx: Context2D;
  private readonly start: Point;
  private readonly end: Point;
  private readonly canvas: OffscreenCanvas;
  vertices: { h1: Point; h2: Point };

  constructor(
    private imageContext: ImageBitmapRenderingContext,
    public size: number,
    private colors: SimpleBezierColors
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
      h2: this.end,
    };
  }

  draw(coords: Handlers, active: Handler | null, darkMode: boolean) {
    this.drawBezierPanel(coords, active, darkMode);

    const bitmapOne = this.canvas.transferToImageBitmap();
    this.imageContext.transferFromImageBitmap(bitmapOne);
  }

  private drawBezierPanel(coords: Handlers, active: Handler | null, darkMode: boolean) {
    this.ctx.save();

    this.ctx.globalCompositeOperation = "destination-over";
    for (let item of ["h1", "h2"] as Handler[]) {
      if (item !== active) {
        this.drawHandler(coords[item], item, darkMode);
      }
    }

    this.ctx.restore();

    this.ctx.save();
    if (active === null) {
      this.ctx.globalCompositeOperation = "destination-over";
    }

    this.drawBezierCurve(coords, active !== null, darkMode);
    this.ctx.restore();

    if (active !== null) {
      this.drawActiveHandlerSlim(coords[active], active, darkMode);
    }

    this.ctx.save();
    this.ctx.globalCompositeOperation = "destination-over";
    this.drawGrid(darkMode);

    this.ctx.restore();
  }

  private drawBezierCurve(coords: Handlers, active: boolean, darkMode: boolean) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.start.x, this.start.y);
    this.ctx.strokeStyle = this.colors.curve(darkMode);
    this.ctx.bezierCurveTo(coords.h1.x, coords.h1.y, coords.h2.x, coords.h2.y, this.end.x, this.end.y);
    this.ctx.lineWidth = this.widthFactor * (active !== null ? 3 : 2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawGrid(darkMode: boolean) {
    const colors = this.colors.grid(darkMode);

    const ratio = this.size / virtualSize;
    const gridSpacing = virtualSize / this.gridLines;

    this.ctx.save();
    this.ctx.beginPath();

    for (let i = 1; i < this.gridLines; i++) {
      const posicion = redondeo.value(i * gridSpacing * ratio);
      this.ctx.moveTo(0, posicion);
      this.ctx.lineTo(this.size, posicion);
      this.ctx.moveTo(posicion, 0);
      this.ctx.lineTo(posicion, this.size);
    }

    this.ctx.setLineDash([1, 3]);
    this.ctx.strokeStyle = colors.lines;
    this.ctx.lineWidth = redondeo.value(this.widthFactor * 0.5);
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, 0, redondeo.value(ratio * virtualSize), redondeo.value(ratio * virtualSize));
    this.ctx.strokeStyle = colors.border;
    this.ctx.lineWidth = redondeo.value(this.widthFactor * 1);
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawHandler(position: Point, name: Handler, darkMode: boolean) {
    const colors = this.colors.handler(name, darkMode);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, this.handlerRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = colors.main;
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.save();
    const angle = Math.atan2(position.y - this.vertices[name].y, position.x - this.vertices[name].x) + Math.PI / 2;
    const hypotenuse = Math.sqrt(
      Math.pow(position.x - this.vertices[name].x, 2) + Math.pow(position.y - this.vertices[name].y, 2)
    );
    this.ctx.translate(position.x, position.y);
    this.ctx.rotate(angle);

    this.ctx.beginPath();
    this.ctx.rect(-0.75, 0, 1.5, hypotenuse);
    this.ctx.fillStyle = colors.common.line;
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawActiveHandlerSlim(position: Point, name: Handler, darkMode: boolean) {
    const colors = this.colors.handler(name, darkMode);

    this.ctx.save();
    this.ctx.shadowColor = colors.common.shadow;
    this.ctx.shadowBlur = this.activeHandlerShadowBlur;
    this.ctx.shadowOffsetX = this.activeHandlerShadowOffset;
    this.ctx.shadowOffsetY = this.activeHandlerShadowOffset;

    this.ctx.save();
    const angle = Math.atan2(position.y - this.vertices[name].y, position.x - this.vertices[name].x) + Math.PI / 2;
    const hypotenuse = Math.sqrt(
      Math.pow(position.x - this.vertices[name].x, 2) + Math.pow(position.y - this.vertices[name].y, 2)
    );
    this.ctx.translate(position.x, position.y);
    this.ctx.rotate(angle);

    this.ctx.beginPath();
    this.ctx.rect(-1, 0, 2, hypotenuse);
    this.ctx.fillStyle = colors.common.activeline;
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.translate(position.x, position.y);

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.handlerRadius, 0, Math.PI * 2); // Outer circle
    this.ctx.arc(0, 0, this.activeHandlerRadius, 0, Math.PI * 2, true); // Outer circle
    this.ctx.arc(0, 0, this.activeHandlerRadius - redondeo.value(this.widthFactor * 2), 0, Math.PI * 2); // Outer circle
    this.ctx.fillStyle = colors.main;
    this.ctx.fill("evenodd");
    this.ctx.restore();
  }
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
