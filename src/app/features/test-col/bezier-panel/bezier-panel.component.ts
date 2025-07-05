import { Component, effect, ElementRef, HostListener, input, output, ViewChild } from "@angular/core";
import { Coordenates } from "../bezier-curve";

@Component({
  selector: "zz-bezier-panel",
  imports: [],
  templateUrl: "./bezier-panel.component.html",
})
export class BezierPanelComponent {
  private currentHandler: "H1" | "H2" | null = null;
  private lastTimeoutId: number | null = null;

  canvasOffset = 30;
  size = input(200);

  color = input<string>("black");
  coords = input({
    x1: 50,
    y1: 50,
    x2: 50,
    y2: 50,
  });

  coordsChanging = output<Coordenates>();
  coordsChanged = output<Coordenates>();

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;

  @HostListener("document:mouseup")
  onDocumentMouseUp(): void {
    if (this.currentHandler) {
      this.stopTracking();
    }
  }

  constructor() {
    effect(() => {
      const coords = this.coords();
      this.dibujar(coords);
    });
  }

  ngAfterViewInit() {
    this.dibujar(this.coords(), this.size());
  }

  onMouseDown(event: MouseEvent): void {
    const canvas = this.canvas?.nativeElement;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    this.setHandlerSelected(event.clientX - rect.left, event.clientY - rect.top);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.currentHandler) {
      return;
    }
    const canvas = this.canvas?.nativeElement;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    this.updateHandlerCoords(event.clientX - rect.left, event.clientY - rect.top);
  }

  private updateHandlerCoords(rawX: number, rawY: number): void {
    const x = this.convertXFromCanvas(rawX);
    const y = this.convertYFromCanvas(rawY);

    if (this.currentHandler === "H1") {
      this.coordsChanging.emit({ ...this.coords(), x1: x, y1: y });
    } else if (this.currentHandler === "H2") {
      this.coordsChanging.emit({ ...this.coords(), x2: x, y2: y });
    }
  }

  onMouseUp(): void {
    this.stopTracking();
  }

  onMouseLeave(): void {
    this.setStopTimeout();
  }
  onMouseEnter(): void {
    if (this.currentHandler !== null) {
      this.clearStopTimeout();
    }
  }

  private setStopTimeout() {
    if (this.currentHandler !== null) {
      this.clearStopTimeout();
      this.lastTimeoutId = window.setTimeout(() => this.stopTracking(), 1000);
    }
  }

  private clearStopTimeout() {
    if (this.lastTimeoutId) {
      window.clearTimeout(this.lastTimeoutId);
      this.lastTimeoutId = null;
    }
  }

  private stopTracking() {
    if (this.currentHandler !== null) {
      this.currentHandler = null;
      this.clearStopTimeout();
      this.coordsChanged.emit(this.coords());
    }
  }

  private setHandlerSelected(rawX: number, rawY: number) {
    const x = this.convertXFromCanvas(rawX);
    const y = this.convertYFromCanvas(rawY);

    const coords = this.coords();
    if (this.checkCoordsMatch(x, y, coords.x1, coords.y1)) {
      this.currentHandler = "H1";
      return;
    }

    if (this.checkCoordsMatch(x, y, coords.x2, coords.y2)) {
      this.currentHandler = "H2";
      return;
    }
  }

  private checkCoordsMatch(testX: number, testY: number, x: number, y: number) {
    const offset = 6;
    return x + offset > testX && x - offset < testX && y + offset > testY && y - offset < testY;
  }

  private convertXFromCanvas(value: number): number {
    const size = this.size();
    return (Math.max(0, Math.min(value - this.canvasOffset, size)) / size) * 100;
  }

  private convertYFromCanvas(value: number): number {
    const size = this.size();
    return (Math.max(0, Math.min(size - value + this.canvasOffset, size)) / size) * 100;
  }

  private convertXToCanvas(value: number): number {
    const size = this.size();
    return (Math.max(0, Math.min(value, 100)) * size) / 100;
  }

  private convertYToCanvas(value: number): number {
    const size = this.size();
    return size - (Math.max(0, Math.min(value, size)) * size) / 100;
  }

  private dibujar(coordsRaw: Coordenates, size: number = this.size()) {
    const coords = {
      x1: this.convertXToCanvas(coordsRaw.x1),
      y1: this.convertYToCanvas(coordsRaw.y1),
      x2: this.convertXToCanvas(coordsRaw.x2),
      y2: this.convertYToCanvas(coordsRaw.y2),
    };
    const ctx = this.canvas?.nativeElement.getContext("bitmaprenderer");
    if (ctx) {
      requestAnimationFrame(() => {
        drawBezier(ctx, coords, size, this.currentHandler, this.color());
      });
    }
  }
}

function drawBase(ctx: OffscreenCanvasRenderingContext2D, size: number, color: string) {
  const lineColor = color === "black" ? "#606060" : "#C0C0C0";
  ctx.beginPath();
  ctx.rect(0, 0, size, size);
  ctx.strokeStyle = color === "black" ? "#101010" : "#F0F0F0";
  ctx.lineWidth = 1;
  ctx.stroke();

  const ratio = size / 100;

  for (let i = 10; i <= 90; i += 10) {
    ctx.beginPath();
    ctx.moveTo(0, i * ratio);
    ctx.lineTo(size, i * ratio);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i * ratio, 0);
    ctx.lineTo(i * ratio, size);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}
function drawBezier(
  ctx: ImageBitmapRenderingContext,
  coords: Coordenates,
  size: number,
  active: "H1" | "H2" | null,
  color: string
) {
  const offscreen = new OffscreenCanvas(size, size);
  const offCtx = offscreen.getContext("2d")!;

  drawBase(offCtx, size, color);

  const colorH1 = color === "black" ? "darkred" : "red";
  const colorH2 = color === "black" ? "navy" : "blue";
  const colorCurve = color === "black" ? "#303030" : "#D0D0D0";
  const colorHandlerLine = color === "black" ? "#505050" : "#B0B0B0";

  drawHandlerLine(offCtx, 0, size, coords.x1, coords.y1, colorHandlerLine);

  drawHandler(offCtx, coords.x1, coords.y1, colorH1);

  drawHandlerLine(offCtx, size, 0, coords.x2, coords.y2, colorHandlerLine);

  drawHandler(offCtx, coords.x2, coords.y2, colorH2);

  if (active === "H1") {
    drawHandlerActive(offCtx, coords.x1, coords.y1, colorH1);
  } else if (active === "H2") {
    drawHandlerActive(offCtx, coords.x2, coords.y2, colorH2);
  }

  offCtx.beginPath();
  offCtx.moveTo(0, size);
  offCtx.strokeStyle = colorCurve;

  offCtx.bezierCurveTo(coords.x1, coords.y1, coords.x2, coords.y2, size, 0);
  offCtx.lineWidth = 2;
  offCtx.stroke();

  const bitmapOne = offscreen.transferToImageBitmap();
  ctx.transferFromImageBitmap(bitmapOne);
}

function drawHandler(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawHandlerActive(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawHandlerLine(
  ctx: OffscreenCanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.stroke();
}
