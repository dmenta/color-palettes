import { redondeo } from "../common/common-funcs";
import { DoubleHandlers } from "../models/double-handlers.model";
import { Handlers } from "../models/handlers.model";
import { Point } from "../models/point.model";

export const bezierCurve = {
  points: (
    coords: Handlers,
    sizeX: number,
    sizeY: number,
    handlersOffsetX: number = 0,
    handlersOffsetY: number = 0,
    outputScaleX: number = 1,
    outputScaleY: number = 1,
    ouputOffsetX: number = 0,
    ouputOffsetY: number = 0,
    steps: number = 20
  ) => {
    steps = Math.max(1, steps);

    const x0 = 0;
    const x1 = redondeo.value(((coords.h1.x + handlersOffsetX) / sizeX) * 100);
    const x2 = redondeo.value(((coords.h2.x + handlersOffsetX) / sizeX) * 100);
    const x3 = 100;
    const y0 = 0;
    const y1 = redondeo.value(((coords.h1.y + handlersOffsetY) / sizeY) * 100);
    const y2 = redondeo.value(((coords.h2.y + handlersOffsetY) / sizeY) * 100);
    const y3 = 100;
    const values: Point[] = [];
    for (let t = 0; t <= steps; t += 1) {
      const tNorm = t / steps;
      const tInvert = (steps - t) / steps;

      const factorVal0 = Math.pow(tInvert, 3);
      const factorVal1 = 3 * Math.pow(tInvert, 2) * tNorm;
      const factorVal2 = 3 * tInvert * Math.pow(tNorm, 2);
      const factorVal3 = Math.pow(tNorm, 3);

      const x = factorVal0 * x0 + factorVal1 * x1 + factorVal2 * x2 + factorVal3 * x3;
      const y = factorVal0 * y0 + factorVal1 * y1 + factorVal2 * y2 + factorVal3 * y3;

      values.push({
        x: redondeo.bezierCoord(x * outputScaleX) + ouputOffsetX,
        y: redondeo.bezierCoord(y * outputScaleY) + ouputOffsetY,
      });
    }

    return values;
  },

  doublePoints: (coords: DoubleHandlers, center: Point, virtualSize: number) => {
    const virtualCenterX = redondeo.value(center.x);
    const virtualCenterY = redondeo.value(center.y);

    const scaleAX = virtualCenterX / virtualSize;

    return bezierCurve
      .points({ h1: coords.h1, h2: coords.h2 }, virtualCenterX, virtualCenterY, 0, 0, scaleAX, 1, 0, 0, 10)
      .concat(
        bezierCurve.points(
          { h1: coords.h3!, h2: coords.h4! },
          virtualSize - virtualCenterX,
          virtualSize - virtualCenterY,
          -virtualCenterX,
          -virtualCenterY,
          1 - scaleAX,
          1,
          (virtualCenterX / virtualSize) * 100,
          0,
          10
        )
      );
  },
};
