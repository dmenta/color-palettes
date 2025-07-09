import { Point } from "./point.model";

export function pointFromEvent(event: MouseEvent | TouchEvent, el: HTMLElement): Point {
  if (!el) {
    return { x: 0, y: 0 };
  }

  const style = window.getComputedStyle(el);

  const padding = parseFloat(style.paddingLeft.replace("px", "")) || 0;
  const canvasPadding = padding * 2;

  const rect = el.getBoundingClientRect();
  const size = rect.bottom - rect.top - canvasPadding;

  if (event instanceof TouchEvent) {
    if (event.touches.length === 0) {
      return { x: 0, y: 0 };
    }
    const touch = event.touches[0];
    return {
      x: touch!.clientX - rect.left - padding,
      y: size - (touch!.clientY - rect.top - padding),
    };
  } else {
    return {
      x: event.clientX - rect.left - padding,
      y: size - (event.clientY - rect.top - padding),
    };
  }
}
