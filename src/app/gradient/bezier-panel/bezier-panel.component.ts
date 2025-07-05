import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  ViewChild,
} from "@angular/core";
import { Handler, Handlers, Point, pointsMatch } from "../models/bezier-curve";
import { drawBezierPanel, pointFromCanvas, pointToCanvas } from "./bezier-panel-drawing";
import { GradientStateService } from "../services/gradient-state.service";

@Component({
  selector: "zz-bezier-panel",
  imports: [],
  templateUrl: "./bezier-panel.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BezierPanelComponent {
  private lastTimeoutId: number | null = null;
  private state = inject(GradientStateService);

  overHandler = signal(false);
  currentHandler = signal<Handler | null>(null);
  size = input(200);
  color = input<string>("black");

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;

  @HostListener("document:mouseup")
  onDocumentMouseUp(): void {
    if (this.currentHandler()) {
      this.stopTracking();
    }
  }

  constructor() {
    effect(() => {
      const coords = this.handlersToCanvas(this.state.handlers());

      this.dibujar(coords, this.currentHandler(), this.size(), this.color());
    });
  }

  ngAfterViewInit() {
    this.dibujar(this.handlersToCanvas(this.state.handlers()));
  }

  onMouseDown(event: MouseEvent): void {
    const canvas = this.canvas?.nativeElement;
    if (!canvas) {
      return;
    }

    this.setHandlerSelected(this.pointFromEvent(event));
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.currentHandler()) {
      const isOverHandler = this.isOverHandler(this.pointFromEvent(event));
      this.overHandler.set(isOverHandler !== null);
      return;
    }

    const canvas = this.canvas?.nativeElement;
    if (!canvas) {
      return;
    }

    this.updateHandlerCoords(this.pointFromEvent(event));
  }

  onMouseUp(): void {
    if (this.currentHandler() === null) {
      return;
    }
    this.stopTracking();
  }

  onMouseLeave(): void {
    if (this.currentHandler() === null) {
      return;
    }
    this.setStopTimeout();
  }

  onMouseEnter(): void {
    if (this.currentHandler() !== null) {
      this.clearStopTimeout();
    }
  }

  private setStopTimeout() {
    this.clearStopTimeout();
    this.lastTimeoutId = window.setTimeout(() => this.stopTracking(), 1000);
  }

  private clearStopTimeout() {
    if (this.lastTimeoutId) {
      window.clearTimeout(this.lastTimeoutId);
      this.lastTimeoutId = null;
    }
  }

  private stopTracking() {
    if (this.currentHandler() !== null) {
      this.currentHandler.set(null);
      this.clearStopTimeout();
    }
  }

  private setHandlerSelected(point: Point) {
    this.currentHandler.set(this.isOverHandler(point));
  }

  private updateHandlerCoords(point: Point): void {
    const handler = this.currentHandler();
    if (handler === null) {
      return;
    }

    this.state.onHandlersChange({ ...this.state.handlers(), [handler]: point });
  }

  private isOverHandler(point: Point): Handler | null {
    const coords = this.state.handlers();

    if (pointsMatch(point, coords.h1)) {
      return "h1";
    } else if (pointsMatch(point, coords.h2)) {
      return "h2";
    }
    return null;
  }
  private dibujar(
    coords: Handlers,
    active: Handler | null = this.currentHandler(),
    size: number = this.size(),
    mode: string = this.color()
  ) {
    const ctx = this.canvas?.nativeElement.getContext("bitmaprenderer");
    if (ctx) {
      requestAnimationFrame(() => {
        drawBezierPanel(ctx, coords, size, active, mode);
      });
    }
  }

  private handlersToCanvas(handlers: Handlers): Handlers {
    return {
      h1: pointToCanvas(handlers.h1, this.size()),
      h2: pointToCanvas(handlers.h2, this.size()),
    } as Handlers;
  }

  private pointFromEvent(event: MouseEvent): Point {
    const el = this.canvas?.nativeElement;
    if (!el) {
      return { x: 0, y: 0 };
    }

    const style = window.getComputedStyle(el);

    const padingLeft = parseFloat(style.paddingLeft.replace("px", "")) || 0;
    const padingTop = parseFloat(style.paddingTop.replace("px", "")) || 0;
    const paddingBottom = parseFloat(style.paddingBottom.replace("px", "")) || 0;
    const canvasPadding = paddingBottom + padingTop;

    const rect = el.getBoundingClientRect();
    const size = rect.bottom - rect.top - canvasPadding;

    return pointFromCanvas(
      { x: event.clientX - rect.left - padingLeft, y: event.clientY - rect.top - padingTop },
      size
    );
  }
}
