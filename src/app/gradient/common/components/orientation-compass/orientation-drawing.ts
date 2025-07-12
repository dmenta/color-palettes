import { Context2D } from "../../models/context-2d";
import { Point } from "../../models/point.model";
import { redondeo } from "../../common-funcs";
import { compassArrowColors, compassGridColors } from "./compass-colors";

export class compassDrawing {
  private readonly ctx: Context2D;
  private readonly canvas: OffscreenCanvas;
  gridPaths: CompassGridPath;
  arrowPaths: CompassArrowPath;

  constructor(
    private imageContext: ImageBitmapRenderingContext,
    public diameter: number = 100,

    public center: Point = { x: 50, y: 50 }
  ) {
    this.canvas = new OffscreenCanvas(diameter, diameter);
    const context = this.canvas.getContext("2d")!;
    context.imageSmoothingQuality = "high";
    context.imageSmoothingEnabled = true;

    this.ctx = context as Context2D;
    this.ctx.translate(this.center.x, this.center.y);

    this.gridPaths = new CompassGridPath(diameter / 2);
    this.arrowPaths = new CompassArrowPath(diameter / 2);
  }

  public draw(
    presetHover: number | null = null,
    angleDegrees: number = 0,
    active: boolean = false,
    darkMode: boolean = false
  ) {
    this.drawGridSlim(darkMode);
    this.drawPresetHover(presetHover, darkMode);
    this.drawPresetActive(angleDegrees, darkMode);
    this.drawArrow(angleDegrees, active, darkMode);

    const image = this.canvas.transferToImageBitmap();
    this.imageContext.transferFromImageBitmap(image);
  }

  private drawArrow(angleDegress: number, active: boolean, darkMode: boolean) {
    const colors = compassArrowColors(darkMode);

    this.ctx.save();
    this.ctx.rotate(((angleDegress - 180) * Math.PI) / 180);

    this.ctx.save();
    if (active) {
      this.ctx.shadowColor = darkMode ? "#000000" : "#303030";
      this.ctx.shadowBlur = 7;
      this.ctx.shadowOffsetX = 3;
      this.ctx.shadowOffsetY = 3;
    }

    this.ctx.fillStyle = colors.lines;
    this.ctx.fill(this.arrowPaths.body);
    this.ctx.restore();

    this.ctx.fillStyle = colors.tip;
    this.ctx.fill(this.arrowPaths.tip);

    this.ctx.restore();

    this.ctx.fillStyle = colors.toe;
    this.ctx.fill(this.arrowPaths.toe);
  }

  private drawGridSlim(darkMode: boolean) {
    const { mark, preset } = this.gridPaths;
    const colors = compassGridColors(darkMode);

    this.ctx.fillStyle = "#7A736E33";
    this.ctx.fill(this.gridPaths.back);

    this.ctx.save();

    const steps = 8;
    const step = (Math.PI * 2) / steps;
    for (let i = 0; i < steps; i++) {
      this.ctx.rotate(step);

      this.ctx.fillStyle = colors.lines;
      this.ctx.fill(mark);

      this.ctx.fillStyle = colors.preset;
      this.ctx.fill(preset);
    }
    this.ctx.restore();

    this.ctx.fillStyle = colors.border;
    this.ctx.fill(this.gridPaths.rim);
  }

  private drawPresetHover(presetHover: number | null, darkMode: boolean) {
    const preset = this.gridPaths.preset;
    const colors = compassGridColors(darkMode);

    if (presetHover !== null) {
      this.ctx.save();
      this.ctx.rotate(((Math.PI * 2) / 8) * ((presetHover - 90) / 45));
      this.ctx.fillStyle = colors.presetHover;
      this.ctx.fill(preset);
      this.ctx.restore();
    }
  }

  private drawPresetActive(angleDeg: number = 0, darkMode: boolean) {
    const preset = this.gridPaths.preset;
    const colors = compassGridColors(darkMode);

    const isPreset = (angleDeg + 90) % 45 === 0;

    if (isPreset) {
      this.ctx.save();
      this.ctx.rotate(((Math.PI * 2) / 8) * ((angleDeg - 90) / 45));
      this.ctx.fillStyle = colors.activePreset;
      this.ctx.fill(preset);
      this.ctx.restore();
    }
  }
}

class CompassGridPath {
  private readonly gridProportions = {
    back: 72,
    rim: { size: 72, width: 2, inner: 16 },
    preset: { radius: 6.5, center: 90 },
    ticks: { width: 3, offset: 1.5, inner: 62, lenght: 18 },
  };

  public readonly back: Path2D;
  public readonly rim: Path2D;
  public readonly mark: Path2D;
  public readonly preset: Path2D;

  constructor(radius: number = 100) {
    this.back = this.createGridBack(radius);
    this.rim = this.createGridRim(radius);
    this.mark = this.createGridTicks(radius);
    this.preset = this.createGridPreset(radius);
  }

  private createGridBack(radius: number) {
    const backRadius = redondeo.value((radius * this.gridProportions.back) / 100);

    const back = new Path2D();
    back.arc(0, 0, backRadius, 0, Math.PI * 2);
    back.closePath();

    return back;
  }

  private createGridRim(radius: number) {
    const ratios = this.gridProportions.rim;
    const rimRadius = redondeo.value((radius * ratios.size) / 100);
    const rimOffset = redondeo.value((radius * ratios.width) / 100);
    const innerCircleRadius = redondeo.value((radius * ratios.inner) / 100);

    const rim = new Path2D();
    rim.arc(0, 0, rimRadius, 0, Math.PI * 2);
    rim.arc(0, 0, rimRadius - rimOffset, 0, Math.PI * 2, true);
    rim.arc(0, 0, innerCircleRadius, 0, Math.PI * 2);
    rim.arc(0, 0, innerCircleRadius - rimOffset, 0, Math.PI * 2, true);
    rim.closePath();

    return rim;
  }

  private createGridTicks(radius: number) {
    const ratios = this.gridProportions.ticks;

    const ticksWidth = redondeo.value((radius * ratios.width) / 100);
    const tickOffset = redondeo.value((radius * ratios.offset) / 100);
    const ticksInner = redondeo.value((radius * ratios.inner) / 100);
    const ticksLenght = redondeo.value((radius * ratios.lenght) / 100);

    const mark = new Path2D();
    mark.moveTo(ticksInner, tickOffset);
    mark.rect(ticksInner, -tickOffset, ticksLenght, ticksWidth);
    mark.closePath();

    return mark;
  }

  private createGridPreset(radius: number) {
    const ratios = this.gridProportions.preset;

    const presetRadius = redondeo.value((radius * ratios.radius) / 100);
    const presetCenter = redondeo.value((radius * ratios.center) / 100);

    const preset = new Path2D();
    preset.moveTo(presetCenter, 0);
    preset.arc(presetCenter, 0, presetRadius, 0, Math.PI * 2);
    preset.closePath();
    return preset;
  }
}

class CompassArrowPath {
  private readonly arrowProportions = {
    axis: 1,
  };

  public readonly body: Path2D;
  public readonly tip: Path2D;
  public readonly toe: Path2D;

  constructor(radius: number = 100) {
    const { body, tip, toe } = this.createArrowPaths(radius);
    this.tip = tip;
    this.toe = toe;
    this.body = body;
  }

  private createArrowPaths(radius: number) {
    const ratios = this.arrowProportions;

    let m = new DOMMatrix([1, 0, 0, 1, -6, -3]);

    const fullArrow = new Path2D();
    fullArrow.addPath(
      new Path2D("M7 6v29l5 4-6 16-6-16 5-4V6c-1.2-.4-2-1.7-2-3 0-1.65 1.35-3 3-3s3 1.35 3 3c0 1.3-.85 2.6-2 3"),
      m
    );

    const tipInner = new Path2D();
    tipInner.addPath(new Path2D("m6 36.951 4 3-4 10-4-10z"), m);

    const toeAxis = redondeo.value((ratios.axis * radius) / 100);

    const toe = new Path2D();
    toe.arc(0, 0, toeAxis, 0, Math.PI * 2);
    toe.closePath();

    return {
      body: fullArrow,
      tip: tipInner,
      toe,
    };
  }
}
