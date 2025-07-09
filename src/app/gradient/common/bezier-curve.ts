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
    ouputOffset: number = 0,
    steps: number = 20
  ) => {
    steps = Math.max(1, steps);
    const x0 = 0;
    const x1 = redondeo.value((coords.h1.x / size) * 100) + handlersOffset;
    const x2 = redondeo.value((coords.h2.x / size) * 100) + handlersOffset;
    const x3 = 100;
    const y0 = 0;
    const y1 = redondeo.value((coords.h1.y / size) * 100) + handlersOffset;
    const y2 = redondeo.value((coords.h2.y / size) * 100) + handlersOffset;
    const y3 = 100;
    const values: Point[] = [];
    for (let t = 0; t <= steps; t += 1) {
      const tNorm = t / steps;
      const tInvert = (steps - t) / steps;
      const x =
        Math.pow(tInvert, 3) * x0 +
        3 * Math.pow(tInvert, 2) * tNorm * x1 +
        3 * tInvert * Math.pow(tNorm, 2) * x2 +
        Math.pow(tNorm, 3) * x3;

      const y =
        Math.pow(tInvert, 3) * y0 +
        3 * Math.pow(tInvert, 2) * tNorm * y1 +
        3 * (1 - tNorm) * Math.pow(tNorm, 2) * y2 +
        Math.pow(tNorm, 3) * y3;

      values.push({
        x: redondeo.bezierCoord(x * outputScale) + ouputOffset,
        y: redondeo.bezierCoord(y * outputScale) + ouputOffset,
      });
    }

    return values;
  },

  doublePoints: (coords: DoubleHandlers, virtualSize: number) => {
    return bezierCurve
      .points({ h1: coords.h1, h2: coords.h2 }, virtualSize / 2, 0, 0.5, 0, 10)
      .concat(bezierCurve.points({ h1: coords.h3!, h2: coords.h4! }, virtualSize / 2, -100, 0.5, 50, 10).slice(1));
  },
};
