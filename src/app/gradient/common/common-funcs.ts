import { Point } from "../double-bezier-panel/double-bezier-curve";

export const redondeo = {
  point: (point: Point): Point => {
    return {
      x: redondeo.value(point.x),
      y: redondeo.value(point.y),
    };
  },

  value: (value: number): number => {
    return Math.round(value);
  },

  bezierCoord: (value: number): number => {
    return Math.round(value * 100) / 100;
  },
};
