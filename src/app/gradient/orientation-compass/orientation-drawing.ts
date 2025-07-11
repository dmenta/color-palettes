import { redondeo } from "../common/common-funcs";
import { Context2D } from "../models/context-2d";
import { Point } from "../models/point.model";
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
    size: 34,
    bodyWitdh: 1,
    toeSize: 5,
    toeCenter: 3,
    tipLenght: 14,
    inset: -3,
    overflow: 4,
    wide: 5,
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

    this.gridPaths = this.createGridPaths();
    this.arrowPaths = this.createArrowPaths();
  }

  public draw(
    presetHover: number | null = null,
    angleDegrees: number = 0,
    _active: boolean = false,
    darkMode: boolean = false
  ) {
    this.drawGridSlim(darkMode);
    this.drawPresetHover(presetHover, darkMode);
    this.drawPresetActive(angleDegrees, darkMode);
    this.drawArrow(angleDegrees, _active, darkMode);

    const image = this.canvas.transferToImageBitmap();
    this.imageContext.transferFromImageBitmap(image);
  }

  private drawArrow(angleDegress: number, active: boolean, darkMode: boolean) {
    const { body, tip, toe } = this.arrowPaths;
    const colors = compassArrowColors(darkMode);

    this.ctx.save();

    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.rotate(((angleDegress - 90) * Math.PI) / 180);
    this.ctx.save();

    if (active) {
      this.ctx.shadowColor = darkMode ? "#000000" : "#303030";
      this.ctx.shadowBlur = 7;
      this.ctx.shadowOffsetX = 3;
      this.ctx.shadowOffsetY = 3;
    }

    this.ctx.fillStyle = colors.lines;
    this.ctx.fill(body);
    this.ctx.strokeStyle = colors.lines;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "butt";
    this.ctx.lineJoin = "round";
    this.ctx.stroke(body);
    this.ctx.restore();

    this.ctx.fillStyle = colors.toe;
    this.ctx.fill(toe);
    this.ctx.fillStyle = colors.tip;
    this.ctx.fill(tip);

    this.ctx.restore();
  }

  private drawGridSlim(darkMode: boolean) {
    const { mark, preset } = this.gridPaths;
    const colors = compassGridColors(darkMode);

    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y);

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

    this.ctx.restore();
  }

  private drawPresetHover(presetHover: number | null, darkMode: boolean) {
    const preset = this.gridPaths.preset;
    const colors = compassGridColors(darkMode);

    if (presetHover !== null) {
      this.ctx.save();
      this.ctx.translate(this.center.x, this.center.y);
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
      this.ctx.translate(this.center.x, this.center.y);
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
    const size = redondeo.value((this.arrowProportions.size * this.diameter) / 100);
    const width = redondeo.value((this.arrowProportions.bodyWitdh * this.diameter) / 100);
    const arrowInsetValue = redondeo.value((this.arrowProportions.inset * this.diameter) / 100);
    const arrowOverflowValue = redondeo.value((this.arrowProportions.overflow * this.diameter) / 100);
    const arrowWideValue = redondeo.value((this.arrowProportions.wide * this.diameter) / 100);
    const arrowTipBase = redondeo.value(
      size - (this.arrowProportions.tipLenght * this.diameter) / 100 + arrowOverflowValue
    );
    const arrowTip = redondeo.value(size + arrowOverflowValue);

    const body = new Path2D();
    body.rect(-(width / 2), 0, width, size);
    body.arc(0, 0, this.arrowProportions.toeSize, 0, Math.PI * 2);

    body.moveTo(0, arrowTip);
    body.lineTo(arrowWideValue, arrowTipBase);
    body.lineTo(0, arrowTipBase + arrowInsetValue);
    body.lineTo(-arrowWideValue, arrowTipBase);
    body.moveTo(0, size);
    body.lineTo(0, 0);
    body.closePath();

    const tip = new Path2D();
    tip.moveTo(0, arrowTip - arrowOverflowValue / 2);
    tip.lineTo(arrowWideValue / 2, arrowTipBase);
    tip.lineTo(0, arrowTipBase + arrowInsetValue);
    tip.lineTo(-arrowWideValue / 2, arrowTipBase);
    tip.closePath();

    const toe = new Path2D();
    toe.arc(0, 0, 3, 0, Math.PI * 2);
    toe.closePath();

    return {
      body,
      tip,
      toe,
    };
  }
}
