import { redondeo } from "../common/common-funcs";
import { DoubleHandlers } from "../models/double-handlers.model";
import { Handlers } from "../models/handlers.model";
import { Point } from "../models/point.model";

export const bezierCurve = {
  points: (
    coords: Handlers,
    size: number,
    handlersOffset: number = 0,
    outputScale: number = 1,
    ouputOffset: number = 0
  ) => {
    // P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
    const x0 = 0;
    const x1 = redondeo.value((coords.h1.x / size) * 100) + handlersOffset;
    const x2 = redondeo.value((coords.h2.x / size) * 100) + handlersOffset;
    const x3 = 100;
    const y0 = 0;
    const y1 = redondeo.value((coords.h1.y / size) * 100) + handlersOffset;
    const y2 = redondeo.value((coords.h2.y / size) * 100) + handlersOffset;
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

      values.push({
        x: redondeo.bezierCoord(x * outputScale) + ouputOffset,
        y: redondeo.bezierCoord(y * outputScale) + ouputOffset,
      });
    }

    return values;
  },

  doublePoints: (coords: DoubleHandlers, virtualSize: number) => {
    return bezierCurve
      .points({ h1: coords.h1, h2: coords.h2 }, virtualSize / 2, 0, 0.5)
      .concat(bezierCurve.points({ h1: coords.h3, h2: coords.h4 }, virtualSize / 2, -100, 0.5, 50).slice(1));
  },
};
