import { Point } from "./models/point.model";

export const redondeo = {
  value: (value: number) => Math.round(value),

  point: (point: Point) => ({ x: redondeo.value(point.x), y: redondeo.value(point.y) }),

  bezierCoord: (value: number): number => Math.round(value * 100) / 100,
};

export const domCommon = {
  pointFromEvent,
};

function pointFromEvent(element: HTMLElement, event: MouseEvent | TouchEvent): Point {
  if (!element) {
    return { x: 0, y: 0 };
  }

  const style = window.getComputedStyle(element);

  const padingLeft = parseFloat(style.paddingLeft.replace("px", "")) || 0;
  const padingTop = parseFloat(style.paddingTop.replace("px", "")) || 0;

  const rect = element.getBoundingClientRect();

  if (event instanceof TouchEvent) {
    if (event.touches.length === 0) {
      return { x: 0, y: 0 };
    }
    const touch = event.touches[0];
    return { x: touch!.clientX - rect.left - padingLeft, y: touch!.clientY - rect.top - padingTop };
  } else {
    return { x: event.clientX - rect.left - padingLeft, y: event.clientY - rect.top - padingTop };
  }
}
