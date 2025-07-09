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
import { Point, pointsMatch } from "../models/bezier-curve";
import { debounceTime, filter, fromEvent, map, merge, Subscription, tap } from "rxjs";
import { DoubleGradientStateService } from "../services/double-gradient-state.service";
import { DoubleHandler, DoubleHandlers } from "./double-bezier-curve";
import { drawDoubleBezierPanel, pointFromCanvas, pointToCanvas, virtualSize } from "./double-bezier-panel-drawing";

@Component({
  selector: "zz-double-bezier-panel",
  imports: [],
  templateUrl: "./double-bezier-panel.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoubleBezierPanelComponent implements AfterViewInit, OnDestroy {
  private mouseMoveSubscription: Subscription | null = null;
  private moveSubscription: Subscription | null = null;
  private startSubscription: Subscription | null = null;
  private removeDocumentClickListenerFn: (() => void) | null = null;
  private removeDocumentTouchEndListenerFn: (() => void) | null = null;

  private state = inject(DoubleGradientStateService);

  overHandler = signal<DoubleHandler | null>(null);
  currentHandler = signal<DoubleHandler | null>(null);
  size = input(200);
  darkMode = input(false);

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;
  canvasContext: ImageBitmapRenderingContext | null = null;

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

    this.dibujar(this.handlersToCanvas(this.state.handlers()));
  }

  onDoubleClick(_event: MouseEvent) {
    const overHandler = this.overHandler();
    if (overHandler === null) {
      return;
    }
    if (overHandler === "h3" || overHandler === "h4") {
      this.state.onHandlersChange({ ...this.state.handlers(), [overHandler]: { x: 150, y: 150 } });
    } else {
      this.state.onHandlersChange({ ...this.state.handlers(), [overHandler]: { x: 50, y: 50 } });
    }
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

  private setHandlerSelected(handler: DoubleHandler) {
    this.setListeners();

    this.currentHandler.set(handler);
  }

  private updateHandlerCoords(point: Point): void {
    const handler = this.currentHandler();
    if (handler === null) {
      return;
    }
    if (handler === "h1" || handler === "h4") {
      this.state.onHandlersChange({ ...this.state.handlers(), [handler]: point });
    } else {
      const halfVirtualSize = virtualSize / 2;
      let deltaY = halfVirtualSize - point.y;
      let deltaX = halfVirtualSize - point.x;

      deltaY = Math.abs(deltaY) < 0.25 ? Math.sign(deltaY) * 0.25 : deltaY;
      deltaX = Math.abs(deltaX) < 0.25 ? Math.sign(deltaX) * 0.25 : deltaX;

      const hMoving = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

      const opposite = handler === "h2" ? "h3" : "h2";

      const hOpposite = Math.sqrt(
        Math.pow(this.state.handlers()[opposite].x - halfVirtualSize, 2) +
          Math.pow(this.state.handlers()[opposite].y - halfVirtualSize, 2)
      );

      const normalizedX = -Math.round((deltaX / hMoving) * hOpposite);
      const normalizedY = -Math.round((deltaY / hMoving) * hOpposite);

      this.state.onHandlersChange({
        ...this.state.handlers(),
        [handler]: { x: Math.round(point.x), y: Math.round(point.y) },
        [opposite]: { x: halfVirtualSize - normalizedX, y: halfVirtualSize - normalizedY },
      });
    }
  }

  private isOverHandler(point: Point): DoubleHandler | null {
    const coords = this.state.handlers();

    if (pointsMatch(point, coords.h1, (12 / 200) * virtualSize)) {
      return "h1";
    } else if (pointsMatch(point, coords.h2, (12 / 200) * virtualSize)) {
      return "h2";
    }
    if (pointsMatch(point, coords.h3, (12 / 200) * virtualSize)) {
      return "h3";
    } else if (pointsMatch(point, coords.h4, (12 / 200) * virtualSize)) {
      return "h4";
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
    coords: DoubleHandlers,
    active: DoubleHandler | null = this.currentHandler(),
    size: number = this.size(),
    mode: boolean = this.darkMode()
  ) {
    if (!this.canvas) {
      return;
    }
    if (this.canvasContext === null) {
      this.canvasContext = this.canvas.nativeElement.getContext("bitmaprenderer");
    }

    const ctx = this.canvasContext!;

    requestAnimationFrame(() => {
      drawDoubleBezierPanel(ctx, coords, size, active, mode);
    });
  }

  private handlersToCanvas(handlers: DoubleHandlers): DoubleHandlers {
    return {
      h1: pointToCanvas(handlers.h1, this.size()),
      h2: pointToCanvas(handlers.h2, this.size()),
      h3: pointToCanvas(handlers.h3, this.size()),
      h4: pointToCanvas(handlers.h4, this.size()),
    } as DoubleHandlers;
  }

  private pointFromEvent(event: MouseEvent | TouchEvent): Point {
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
    if (event instanceof TouchEvent) {
      if (event.touches.length === 0) {
        return { x: 0, y: 0 };
      }
      const touch = event.touches[0];
      return pointFromCanvas(
        { x: touch!.clientX - rect.left - padingLeft, y: touch!.clientY - rect.top - padingTop },
        size
      );
    } else {
      return pointFromCanvas(
        { x: event.clientX - rect.left - padingLeft, y: event.clientY - rect.top - padingTop },
        size
      );
    }
  }

  ngOnDestroy() {
    this.removeDocumentClickListenerFn?.();
    this.removeDocumentTouchEndListenerFn?.();

    this.mouseMoveSubscription?.unsubscribe();
    this.moveSubscription?.unsubscribe();
    this.startSubscription?.unsubscribe();
  }
}
