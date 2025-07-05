import { Component, ElementRef, HostListener, inject, input, ViewChild } from "@angular/core";
import { Coordenates, Point } from "../models/bezier-curve";
import { drawBezierPanel } from "./bezier-panel-drawing";
import { GradientStateService } from "../services/gradient-state.service";

@Component({
  selector: "zz-bezier-panel",
  imports: [],
  templateUrl: "./bezier-panel.component.html",
})
export class BezierPanelComponent {
  private currentHandler: "H1" | "H2" | null = null;
  private lastTimeoutId: number | null = null;

  canvasOffset = 30;

  state = inject(GradientStateService);
  size = input(200);

  color = input<string>("black");

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;

  @HostListener("document:mouseup")
  onDocumentMouseUp(): void {
    if (this.currentHandler) {
      this.stopTracking();
    }
  }

  ngAfterViewInit() {
    this.dibujar(this.state.handlers(), this.size());
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
      this.state.onHandlersChange({ ...this.state.handlers(), point1: { x, y } });
    } else if (this.currentHandler === "H2") {
      this.state.onHandlersChange({ ...this.state.handlers(), point2: { x, y } });
    }
    this.dibujar(this.state.handlers(), this.size());
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
    }
  }

  private setHandlerSelected(rawX: number, rawY: number) {
    const x = this.convertXFromCanvas(rawX);
    const y = this.convertYFromCanvas(rawY);

    const test = { x, y };

    const coords = this.state.handlers();
    if (this.checkCoordsMatch(test, coords.point1)) {
      this.currentHandler = "H1";
      return;
    }

    if (this.checkCoordsMatch(test, coords.point2)) {
      this.currentHandler = "H2";
      return;
    }
  }

  private checkCoordsMatch(test: Point, pos: Point) {
    const offset = 6;
    return pos.x + offset > test.x && pos.x - offset < test.x && pos.y + offset > test.y && pos.y - offset < test.y;
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
      point1: { x: this.convertXToCanvas(coordsRaw.point1.x), y: this.convertYToCanvas(coordsRaw.point1.y) },
      point2: { x: this.convertXToCanvas(coordsRaw.point2.x), y: this.convertYToCanvas(coordsRaw.point2.y) },
    };
    const ctx = this.canvas?.nativeElement.getContext("bitmaprenderer");
    if (ctx) {
      requestAnimationFrame(() => {
        drawBezierPanel(ctx, coords, size, this.currentHandler, this.color());
      });
    }
  }
}
