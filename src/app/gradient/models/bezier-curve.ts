export function bezierPoints(coords: Coordenates) {
  // P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
  const x0 = 0;
  const x1 = coords.point1.x;
  const x2 = coords.point2.x;
  const x3 = 100;
  const y0 = 0;
  const y1 = coords.point1.y;
  const y2 = coords.point2.y;
  const y3 = 100;
  const values: Point[] = [];
  for (let t = 0; t <= 1; t += 0.05) {
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

    values.push({ x, y });
  }
  values.push({ x: 100, y: 100 });

  return values;
}

export type Coordenates = {
  point1: Point;
  point2: Point;
};

export type Point = {
  x: number;
  y: number;
};
