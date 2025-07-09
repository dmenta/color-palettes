export type Point = {
  x: number;
  y: number;
};

export function pointsMatch(a: Point, b: Point, tolerance: number = 9) {
  return b.x + tolerance > a.x && b.x - tolerance < a.x && b.y + tolerance > a.y && b.y - tolerance < a.y;
}
