import { Context2D } from "../../models/context-2d";
import { Point } from "../../models/point.model";
import { redondeo } from "../../common-funcs";
import { compassArrowColors, compassGridColors } from "./compass-colors";

export class compassDrawing {
  private readonly gridProportions = {
    rimSize: 72,
    rimWidth: 2,
    innerCircleRadius: 16,
    presetRadius: 6.5,
    ticksWidth: 3,
    ticksOffset: 1.5,
    ticksInner: 62,
    ticksLenght: 18,
    presetCenter: 90,
  };

  private readonly arrowProportions = {
    bodyWitdh: 3,
    bodyLenght: 48,
    toeSize: 4.5,
    toeAxis: 1,
    tipLenght: 32,
    tipWide: 18,
    tipAxis: 6,
    innerTipBase: 3,
    innerTipLenght: 23,
    innerTipWide: 12,
    innerTipAxis: 2,
  };

  private readonly ctx: Context2D;
  private readonly canvas: OffscreenCanvas;
  readonly gridPaths: { back: Path2D; rim: Path2D; mark: Path2D; preset: Path2D };
  readonly arrowPaths: { body: Path2D; tip: Path2D; toe: Path2D };

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

    this.gridPaths = this.createGridPaths();
    this.arrowPaths = this.createArrowPaths();
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

  private createGridPaths() {
    const radius = this.diameter / 2;
    const rimRadius = redondeo.value((radius * this.gridProportions.rimSize) / 100);
    const rimOffset = redondeo.value((radius * this.gridProportions.rimWidth) / 100);
    const innerCircleRadius = redondeo.value((radius * this.gridProportions.innerCircleRadius) / 100);
    const presetRadius = redondeo.value((radius * this.gridProportions.presetRadius) / 100);
    const ticksWidth = redondeo.value((radius * this.gridProportions.ticksWidth) / 100);
    const tickOffset = redondeo.value((radius * this.gridProportions.ticksOffset) / 100);
    const ticksInner = redondeo.value((radius * this.gridProportions.ticksInner) / 100);
    const ticksLenght = redondeo.value((radius * this.gridProportions.ticksLenght) / 100);
    const presetCenter = redondeo.value((radius * this.gridProportions.presetCenter) / 100);

    const back = new Path2D();
    back.arc(0, 0, rimRadius, 0, Math.PI * 2);
    back.closePath();

    const rim = new Path2D();
    rim.arc(0, 0, rimRadius, 0, Math.PI * 2);
    rim.arc(0, 0, rimRadius - rimOffset, 0, Math.PI * 2, true);
    rim.arc(0, 0, innerCircleRadius, 0, Math.PI * 2);
    rim.arc(0, 0, innerCircleRadius - rimOffset, 0, Math.PI * 2, true);
    rim.closePath();

    const mark = new Path2D();
    mark.moveTo(ticksInner, tickOffset);
    mark.rect(ticksInner, -tickOffset, ticksLenght, ticksWidth);
    rim.closePath();

    const preset = new Path2D();
    preset.moveTo(presetCenter, 0);
    preset.arc(presetCenter, 0, presetRadius, 0, Math.PI * 2);
    preset.closePath();

    return {
      back: back,
      rim: rim,
      mark: mark,
      preset: preset,
    };
  }

  private createArrowPaths() {
    const radius = this.diameter / 2;
    const halfBodyWidth = redondeo.value((this.arrowProportions.bodyWitdh * radius) / 2 / 100);
    const bodyLenght = redondeo.value((this.arrowProportions.bodyLenght * radius) / 100);
    const tipLenght = redondeo.value((this.arrowProportions.tipLenght * radius) / 100);
    const tipAxis = redondeo.value((this.arrowProportions.tipAxis * radius) / 100);
    const tipHalfWide = redondeo.value((this.arrowProportions.tipWide * radius) / 2 / 100);

    const innerTipLenght = redondeo.value((this.arrowProportions.innerTipLenght * radius) / 100);
    const innerTipAxis = redondeo.value((this.arrowProportions.innerTipAxis * radius) / 100);
    const innerTipBase = redondeo.value((this.arrowProportions.innerTipBase * radius) / 100);
    const innerTipHalfWide = redondeo.value((this.arrowProportions.innerTipWide * radius) / 2 / 100);

    const body = new Path2D();
    body.rect(-halfBodyWidth, 0, halfBodyWidth * 2, bodyLenght);
    body.arc(0, 0, this.arrowProportions.toeSize, 0, Math.PI * 2);

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

    const toeRadius = redondeo.value((this.arrowProportions.toeSize * radius) / 100);

    const toe = new Path2D();
    toe.arc(0, 0, toeRadius, 0, Math.PI * 2);
    toe.closePath();

    return {
      body,
      tip,
      toe,
    };
  }
}
