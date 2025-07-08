import { Point } from "../models/bezier-curve";

/**
 *
 * @param radio
 * @param point
 * @param tolerance
 * @returns a boolean indicating if the point is inside the circle defined by the radio and center at (0,0).
 * The tolerance is used to allow a small margin of error when checking if the point is inside the circle.
 * The point is considered inside the circle if the distance from the center to the point is less than or equal to the radio minus the tolerance.
 */
export function isInsideCircle(radio: number, point: Point, tolerance: number = 3): boolean {
  const realRadio = Math.round(radio);
  const deltaX = Math.abs(point.x);
  const deltaY = Math.abs(point.y);
  const hypotenuse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const inside = hypotenuse - tolerance <= realRadio;

  return inside;
}

export function ensureAngleInRange(angleInDegrees: number): number {
  return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees >= 360 ? angleInDegrees - 360 : angleInDegrees;
}
