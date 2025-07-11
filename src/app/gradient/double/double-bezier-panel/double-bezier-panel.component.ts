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
import { debounceTime, filter, fromEvent, map, merge, Subscription, tap } from "rxjs";
import { ActiveHandler, doubleBezierDrawing } from "./double-bezier-panel-drawing";
import { doubleGradientConfig } from "./double-bezier-config";
import { DoubleBezierColors } from "./double-bezier.draw-colors";
import { DoubleGradientState, GRADIENT_STATE_TOKEN } from "../../models/gradient-state.model";
import { domCommon, redondeo } from "../../common/common-funcs";
import { Point, pointsMatch } from "../../models/point.model";
import { DoubleHandler, DoubleHandlers } from "../models/double-handlers.model";

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

  private state: DoubleGradientState = inject(GRADIENT_STATE_TOKEN);

  overHandler = signal<ActiveHandler>(null);
  currentHandler = signal<ActiveHandler>(null);
  size = input(200);
  darkMode = input(false);

  @ViewChild("canvas") canvas?: ElementRef<HTMLCanvasElement>;
  private doubleBezier: doubleBezierDrawing | null = null;

  constructor(private renderer: Renderer2) {
    effect(() => {
      this.dibujar(this.state.handlers(), this.state.center(), this.currentHandler(), this.darkMode());
    });
  }

  ngAfterViewInit() {
    this.doubleBezier = new doubleBezierDrawing(
      this.canvas!.nativeElement.getContext("bitmaprenderer") as ImageBitmapRenderingContext,
      this.size(),
      new DoubleBezierColors(),
      doubleGradientConfig
    );

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

    this.dibujar(this.state.handlers());
  }

  onDoubleClick(_event: MouseEvent) {
    const overHandler = this.overHandler();
    if (overHandler === null || overHandler === "center") {
      return;
    }

    const multiplierBase = {
      h1: 1,
      h2: 2,
      h3: 4,
      h4: 5,
    };

    const multipler = redondeo.value((multiplierBase[overHandler] / 6) * doubleGradientConfig.virtualSize);

    if (overHandler === "h3" || overHandler === "h4") {
      this.state.onHandlersChange({
        ...this.state.handlers(),
        [overHandler]: { x: multipler, y: multipler },
      });
    } else {
      this.state.onHandlersChange({
        ...this.state.handlers(),
        [overHandler]: { x: multipler, y: multipler },
      });
    }
  }

  private onGrabHandler(event: TouchEvent | MouseEvent) {
    const point = this.pointFromEvent(event);
    const over = this.isOverHandler(point);
    if (over !== null) {
      this.setHandlerSelected(over);
    }
  }

  private onMoveHandler(event: MouseEvent | TouchEvent): void {
    const point = this.pointFromEvent(event);

    this.updateHandlerCoords(point);
  }

  private onMouseMove(event: MouseEvent): void {
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

  private setHandlerSelected(handler: ActiveHandler) {
    this.setListeners();

    this.currentHandler.set(handler);
  }

  private updateHandlerCoords(point: Point): void {
    const handler = this.currentHandler();
    if (handler === null) {
      return;
    }

    if (handler === "center") {
      const deltaX = point.x - this.state.center().x;
      const deltaY = point.y - this.state.center().y;
      const h2 = this.state.handlers().h2!;
      const h3 = this.state.handlers().h3!;
      const newH2 = redondeo.point({ x: h2.x + deltaX, y: h2.y + deltaY });
      const newH3 = redondeo.point({ x: h3.x + deltaX, y: h3.y + deltaY });

      this.state.onCenterChange(redondeo.point(point));

      this.state.onHandlersChange({ ...this.state.handlers(), h2: newH2, h3: newH3 });
      return;
    }
    if (handler === "h1" || handler === "h4") {
      this.state.onHandlersChange({ ...this.state.handlers(), [handler]: point });
    } else {
      const oppositeHandler = handler === "h2" ? "h3" : "h2";
      const opposite = this.doubleBezier?.oppositeHandler(
        this.state.center(),
        point,
        this.state.handlers()[oppositeHandler]!
      )!;

      this.state.onHandlersChange({
        ...this.state.handlers(),
        [handler]: { x: Math.round(point.x), y: Math.round(point.y) },
        [oppositeHandler]: { x: opposite.x, y: opposite.y },
      });
    }
  }

  private isOverHandler(point: Point): ActiveHandler {
    const coords = this.state.handlers();
    const handlersKeys: DoubleHandler[] = ["h1", "h2", "h3", "h4"];

    const toleranciaBase = (doubleGradientConfig.handlerRadius / this.size()) * doubleGradientConfig.virtualSize;

    for (let i = 1; i <= 8; i++) {
      if (pointsMatch(point, this.state.center(), toleranciaBase * i)) {
        return "center";
      }
      for (let j = 0; j < handlersKeys.length; j++) {
        const handlerKey = handlersKeys[j]!;
        if (pointsMatch(point, coords[handlerKey]!, toleranciaBase * i)) {
          return handlerKey;
        }
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
    coords: DoubleHandlers,
    center: Point = this.state.center(),
    active: DoubleHandler | "center" | null = this.currentHandler(),
    mode: boolean = this.darkMode()
  ) {
    if (!this.doubleBezier) {
      return;
    }

    const dibujador = this.doubleBezier;
    requestAnimationFrame(() => {
      dibujador.draw(coords as DoubleHandlers, active, mode, center);
    });
  }

  private pointFromEvent(event: MouseEvent | TouchEvent): Point {
    if (!this.doubleBezier) {
      return { x: 0, y: 0 };
    }
    const canvasPoint = domCommon.pointFromEvent(this.canvas!.nativeElement, event);
    return this.doubleBezier!.pointFromCanvas(canvasPoint);
  }

  ngOnDestroy() {
    this.removeDocumentClickListenerFn?.();
    this.removeDocumentTouchEndListenerFn?.();

    this.mouseMoveSubscription?.unsubscribe();
    this.moveSubscription?.unsubscribe();
    this.startSubscription?.unsubscribe();
  }
}
