import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
  signal,
  ViewChild,
} from "@angular/core";
import { drawBezierPanel, handlerRadius, pointFromCanvas, pointToCanvas, virtualSize } from "./bezier-panel-drawing";
import { debounceTime, filter, fromEvent, map, merge, Subscription, tap } from "rxjs";
import { GRADIENT_STATE_TOKEN, GradientHandlersState } from "../services/gradient-state.model";
import { Handler, Handlers } from "../models/handlers.model";
import { Point, pointsMatch } from "../models/point.model";
import { domCommon } from "../common/common-funcs";

@Component({
  selector: "zz-bezier-panel",
  imports: [],
  templateUrl: "./bezier-panel.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BezierPanelComponent implements AfterViewInit, OnDestroy {
  private mouseMoveSubscription: Subscription | null = null;
  private moveSubscription: Subscription | null = null;
  private startSubscription: Subscription | null = null;
  private removeDocumentClickListenerFn: (() => void) | null = null;
  private removeDocumentTouchEndListenerFn: (() => void) | null = null;

  private state: GradientHandlersState = inject(GRADIENT_STATE_TOKEN);

  overHandler = signal<Handler | null>(null);
  currentHandler = signal<Handler | null>(null);
  size = input(200);
  darkMode = input(false);

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;
  canvasContext: ImageBitmapRenderingContext | null = null;
  private canvasRealSize = 0;

  constructor(private renderer: Renderer2) {
    effect(() => {
      const coords = this.handlersToCanvas(this.state.handlers());

      this.dibujar(coords, this.currentHandler(), this.size(), this.darkMode());
    });
  }

  ngAfterViewInit() {
    this.mouseMoveSubscription = fromEvent(this.canvas!.nativeElement, "mousemove")
      .pipe(
        filter(() => this.currentHandler() === null),
        debounceTime(5),
        map((event) => event as MouseEvent)
      )
      .subscribe((event) => {
        this.onMouseMove(event);
      });

    this.moveSubscription = merge(
      fromEvent(document, "mousemove"),
      fromEvent(document, "touchmove", { passive: false })
    )
      .pipe(
        filter(() => this.currentHandler() !== null),
        tap((event) => event.preventDefault()),
        debounceTime(1),
        map((event) => event as MouseEvent | TouchEvent)
      )
      .subscribe((event) => {
        this.onMoveHandler(event);
      });

    this.startSubscription = merge(
      fromEvent(this.canvas?.nativeElement!, "mousedown").pipe(map((ev) => ev as MouseEvent)),
      fromEvent(this.canvas?.nativeElement!, "touchstart", { passive: false }).pipe(
        map((event) => {
          const point = this.pointFromEvent(event as TouchEvent);
          const over = this.isOverHandler(point);
          return over !== null ? event : null;
        }),
        filter((event): event is TouchEvent => event !== null),
        tap((event) => event.preventDefault())
      )
    )
      .pipe(
        filter(() => this.currentHandler() === null),
        debounceTime(1)
      )
      .subscribe((event) => {
        this.onGrabHandler(event);
      });

    this.canvas!.nativeElement.oncontextlost = (event: Event) => {
      console.warn("Context lost", event);
    };

    this.canvasRealSize = this.realSize();

    this.dibujar(this.handlersToCanvas(this.state.handlers()));
  }

  onDoubleClick(_event: MouseEvent) {
    const overHandler = this.overHandler();
    if (overHandler === null) {
      return;
    }
    this.state.onHandlersChange({
      ...this.state.handlers(),
      [overHandler]: { x: virtualSize / 2, y: virtualSize / 2 },
    });
  }

  onGrabHandler(event: TouchEvent | MouseEvent) {
    const point = this.pointFromEvent(event);
    const over = this.isOverHandler(point);
    if (over !== null) {
      this.setHandlerSelected(over);
    }
  }

  onMoveHandler(event: MouseEvent | TouchEvent): void {
    const point = this.pointFromEvent(event);

    this.updateHandlerCoords(point);
  }

  onMouseMove(event: MouseEvent): void {
    const point = this.pointFromEvent(event);
    const overHandler = this.overHandler();
    const isOverHandler = this.isOverHandler(point);
    if (overHandler === isOverHandler) {
      return;
    }

    this.overHandler.set(isOverHandler);
  }

  private stopTracking() {
    if (this.currentHandler() !== null) {
      this.removeDocumentClickListenerFn?.();
      this.removeDocumentTouchEndListenerFn?.();

      this.currentHandler.set(null);
    }
  }

  private setHandlerSelected(handler: Handler) {
    this.setListeners();

    this.currentHandler.set(handler);
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
    const toleranciaBase = (handlerRadius / this.size()) * virtualSize;

    for (let i = 1; i <= 8; i++) {
      if (pointsMatch(point, coords.h1, toleranciaBase * i)) {
        return "h1";
      } else if (pointsMatch(point, coords.h2, toleranciaBase * i)) {
        return "h2";
      }
    }
    return null;
  }

  private setListeners() {
    this.removeDocumentClickListenerFn = this.renderer.listen("document", "mouseup", () => this.stopTracking());
    this.removeDocumentTouchEndListenerFn = this.renderer.listen("document", "touchend", () => this.stopTracking(), {
      passive: true,
    });
  }

  private dibujar(
    coords: Handlers,
    active: Handler | null = this.currentHandler(),
    size: number = this.size(),
    mode: boolean = this.darkMode()
  ) {
    if (!this.canvas) {
      return;
    } else {
    }
    if (this.canvasContext === null) {
      this.canvasContext = this.canvas.nativeElement.getContext("bitmaprenderer");
    }

    const ctx = this.canvasContext!;

    requestAnimationFrame(() => {
      drawBezierPanel(ctx, coords, size, active, mode);
    });
  }

  private handlersToCanvas(handlers: Handlers): Handlers {
    return {
      h1: pointToCanvas(handlers.h1, this.size()),
      h2: pointToCanvas(handlers.h2, this.size()),
    } as Handlers;
  }

  private pointFromEvent(event: MouseEvent | TouchEvent): Point {
    const canvasPoint = domCommon.pointFromEvent(this.canvas!.nativeElement, event);

    return pointFromCanvas(canvasPoint, this.canvasRealSize);
  }

  private realSize(): number {
    const el = this.canvas?.nativeElement!;
    const style = window.getComputedStyle(el);
    const padding = parseFloat(style.paddingBottom.replace("px", "")) || 0;
    const canvasPadding = 2 * padding;
    const rect = el.getBoundingClientRect();

    return rect.bottom - rect.top - canvasPadding;
  }

  ngOnDestroy() {
    this.removeDocumentClickListenerFn?.();
    this.removeDocumentTouchEndListenerFn?.();

    this.mouseMoveSubscription?.unsubscribe();
    this.moveSubscription?.unsubscribe();
    this.startSubscription?.unsubscribe();
  }
}
