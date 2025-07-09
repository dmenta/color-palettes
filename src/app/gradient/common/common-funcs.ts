import { Point } from "../models/point.model";

export const redondeo = {
  value: (value: number) => Math.round(value),

  point: (point: Point) => ({ x: redondeo.value(point.x), y: redondeo.value(point.y) }),

  bezierCoord: (value: number): number => Math.round(value * 100) / 100,
};
