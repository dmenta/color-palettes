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
    const { body, tip, toe } = this.arrowPaths;
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
    this.ctx.fill(body);
    this.ctx.restore();

    this.ctx.fillStyle = colors.tip;
    this.ctx.fill(tip);
    this.ctx.restore();

    this.ctx.fillStyle = colors.toe;
    this.ctx.fill(toe);
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
    body: { witdh: 3, lenght: 48 },
    toe: { size: 4.5, axis: 1 },
    tip: { outer: { lenght: 32, wide: 18, axis: 6 }, inner: { base: 3, lenght: 23, wide: 12, axis: 2 } },
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

    const halfBodyWidth = redondeo.value((ratios.body.witdh * radius) / 2 / 100);
    const bodyLenght = redondeo.value((ratios.body.lenght * radius) / 100);

    const tipLenght = redondeo.value((ratios.tip.outer.lenght * radius) / 100);
    const tipAxis = redondeo.value((ratios.tip.outer.axis * radius) / 100);
    const tipHalfWide = redondeo.value((ratios.tip.outer.wide * radius) / 2 / 100);

    const innerTipLenght = redondeo.value((ratios.tip.inner.lenght * radius) / 100);
    const innerTipAxis = redondeo.value((ratios.tip.inner.axis * radius) / 100);
    const innerTipBase = redondeo.value((ratios.tip.inner.base * radius) / 100);
    const innerTipHalfWide = redondeo.value((ratios.tip.inner.wide * radius) / 2 / 100);

    const toeRadius = redondeo.value((ratios.toe.size * radius) / 100);
    const toeAxis = redondeo.value((ratios.toe.axis * radius) / 100);

    const body = new Path2D();
    body.rect(-halfBodyWidth, 0, halfBodyWidth * 2, bodyLenght);
    body.arc(0, 0, toeRadius, 0, Math.PI * 2);

    body.moveTo(0, bodyLenght);
    body.lineTo(tipHalfWide, bodyLenght + tipAxis);
    body.lineTo(0, bodyLenght + tipLenght);
    body.lineTo(-tipHalfWide, bodyLenght + tipAxis);
    body.closePath();

    const tip = new Path2D();
    tip.moveTo(0, bodyLenght + innerTipBase);
    tip.lineTo(innerTipHalfWide, bodyLenght + tipAxis + innerTipAxis);
    tip.lineTo(0, bodyLenght + innerTipLenght);
    tip.lineTo(-innerTipHalfWide, bodyLenght + tipAxis + innerTipAxis);
    tip.closePath();

    const toe = new Path2D();
    toe.arc(0, 0, toeAxis, 0, Math.PI * 2);
    toe.closePath();

    return {
      body,
      tip,
      toe,
    };
  }
}
