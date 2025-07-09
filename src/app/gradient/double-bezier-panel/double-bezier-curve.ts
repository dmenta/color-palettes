export function doubleBezierPoints(coords: DoubleHandlers, virtualSize: number) {
  return firstbezierPoints(coords, virtualSize).concat(secondBezierPoints(coords, virtualSize));
}
export function firstbezierPoints(coords: DoubleHandlers, virtualSize: number) {
  // P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
  const x0 = 0;
  const x1 = redondear((coords.h1.x / virtualSize) * 200);
  const x2 = redondear((coords.h2.x / virtualSize) * 200);
  const x3 = 100;
  const y0 = 0;
  const y1 = redondear((coords.h1.y / virtualSize) * 200);
  const y2 = redondear((coords.h2.y / virtualSize) * 200);
  const y3 = 100;
  const values: Point[] = [];
  for (let t = 0; t <= 1; t += 0.1) {
    const x =
      Math.pow(1 - t, 3) * x0 +
      3 * Math.pow(1 - t, 2) * t * x1 +
      3 * (1 - t) * Math.pow(t, 2) * x2 +
      Math.pow(t, 3) * x3;

    const y =
      Math.pow(1 - t, 3) * y0 +
      3 * Math.pow(1 - t, 2) * t * y1 +
      3 * (1 - t) * Math.pow(t, 2) * y2 +
      Math.pow(t, 3) * y3;

    values.push({ x: redondearBezier(x * 0.5), y: redondearBezier(y * 0.5) });
  }
  // values.push({ x: 100, y: 100 });

  return values;
}

export function secondBezierPoints(coords: DoubleHandlers, virtualSize: number) {
  // P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
  const x0 = 0;
  const x1 = redondear((coords.h3.x / virtualSize) * 200) - 100;
  const x2 = redondear((coords.h4.x / virtualSize) * 200) - 100;
  const x3 = 100;
  const y0 = 0;
  const y1 = redondear((coords.h3.y / virtualSize) * 200) - 100;
  const y2 = redondear((coords.h4.y / virtualSize) * 200) - 100;
  const y3 = 100;
  const values: Point[] = [];
  for (let t = 0; t <= 1; t += 0.1) {
    const x =
      Math.pow(1 - t, 3) * x0 +
      3 * Math.pow(1 - t, 2) * t * x1 +
      3 * (1 - t) * Math.pow(t, 2) * x2 +
      Math.pow(t, 3) * x3;

    const y =
      Math.pow(1 - t, 3) * y0 +
      3 * Math.pow(1 - t, 2) * t * y1 +
      3 * (1 - t) * Math.pow(t, 2) * y2 +
      Math.pow(t, 3) * y3;

    values.push({ x: redondearBezier(x * 0.5) + 50, y: redondearBezier(y * 0.5) + 50 });
  }
  values.push({ x: 100, y: 100 });

  return values;
}

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

export type DoubleHandlers = {
  h1: Point;
  h2: Point;
  h3: Point;
  h4: Point;
};

export type Point = {
  x: number;
  y: number;
};

export type DoubleHandler = keyof DoubleHandlers;

export function pointsMatch(a: Point, b: Point, tolerance: number = 9) {
  return b.x + tolerance > a.x && b.x - tolerance < a.x && b.y + tolerance > a.y && b.y - tolerance < a.y;
}

function redondearBezier(value: number): number {
  return Math.round(value * 100) / 100;
}
function redondear(value: number): number {
  return Math.round(value);
}
