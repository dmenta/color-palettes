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
import { Handler, Handlers, Point, pointsMatch } from "../models/bezier-curve";
import { drawBezierPanel, pointFromCanvas, pointToCanvas } from "./bezier-panel-drawing";
import { GradientStateService } from "../services/gradient-state.service";
import { debounceTime, filter, fromEvent, map, Subscription } from "rxjs";

@Component({
  selector: "zz-bezier-panel",
  imports: [],
  templateUrl: "./bezier-panel.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BezierPanelComponent implements AfterViewInit, OnDestroy {
  private mouseMoveSubscription: Subscription | null = null;
  private mouseMoveDocumentSubscription: Subscription | null = null;
  private touchStartSubscription: Subscription | null = null;
  private touchStartDocumentSubscription: Subscription | null = null;
  private removeDocumentClickListenerFn: (() => void) | null = null;
  private removeDocumentTouchEndListenerFn: (() => void) | null = null;

  private state = inject(GradientStateService);

  overHandler = signal<Handler | null>(null);
  currentHandler = signal<Handler | null>(null);
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
        debounceTime(1),
        map((event) => event as MouseEvent)
      )
      .subscribe((event) => {
        this.onMouseMove(event);
      });

    this.mouseMoveDocumentSubscription = fromEvent(document, "mousemove")
      .pipe(
        filter(() => this.currentHandler() !== null),
        debounceTime(1),
        map((event) => event as TouchEvent)
      )
      .subscribe((event) => {
        this.onMouseMove(event);
      });

    this.touchStartSubscription = fromEvent(this.canvas!.nativeElement, "touchmove")
      .pipe(
        debounceTime(1),
        map((event) => event as MouseEvent)
      )
      .subscribe((event) => {
        this.onMouseMove(event);
      });

    this.touchStartDocumentSubscription = fromEvent(document, "touchmove")
      .pipe(
        filter(() => this.currentHandler() !== null),
        debounceTime(1),
        map((event) => event as TouchEvent)
      )
      .subscribe((event) => {
        this.onMouseMove(event);
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
    this.state.onHandlersChange({ ...this.state.handlers(), [overHandler]: { x: 50, y: 50 } });
  }

  onTouchStart(event: TouchEvent) {
    const point = this.pointFromEvent(event);
    const over = this.isOverHandler(point);
    if (over !== null) {
      this.setHandlerSelected(over);
    }
  }

  onMouseDown(_event: MouseEvent): void {
    const overHandler = this.overHandler();
    if (overHandler === null) {
      return;
    }

    this.setHandlerSelected(overHandler);
  }

  onMouseMove(event: MouseEvent | TouchEvent): void {
    const point = this.pointFromEvent(event);
    if (!this.currentHandler()) {
      const overHandler = this.overHandler();
      const isOverHandler = this.isOverHandler(point);
      if (overHandler === isOverHandler) {
        return;
      } else {
        this.overHandler.set(isOverHandler);
      }
    }

    this.updateHandlerCoords(point);
  }

  private stopTracking() {
    if (this.currentHandler() !== null) {
      this.removeDocumentClickListenerFn?.();

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

    if (pointsMatch(point, coords.h1)) {
      return "h1";
    } else if (pointsMatch(point, coords.h2)) {
      return "h2";
    }
    return null;
  }

  private setListeners() {
    this.removeDocumentClickListenerFn = this.renderer.listen("document", "mouseup", () => {
      if (this.currentHandler()) {
        this.stopTracking();
      }
    });
    this.removeDocumentTouchEndListenerFn = this.renderer.listen("document", "touchend", () => {
      if (this.currentHandler()) {
        this.stopTracking();
      }
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
    this.mouseMoveDocumentSubscription?.unsubscribe();
    this.touchStartSubscription?.unsubscribe();
    this.touchStartDocumentSubscription?.unsubscribe();
  }
}
