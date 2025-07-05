export function bezierPoints(coords: Coordenates) {
  // P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
  // calcular solo X
  const x0 = 0;
  const x1 = coords.x1;
  const x2 = coords.x2;
  const x3 = 100; // Punto final en x
  const y0 = 0;
  const y1 = coords.y1;
  const y2 = coords.y2;
  const y3 = 100; // Punto final en x
  const xValues = [];
  const yValues = [];
  for (let t = 0; t <= 1; t += 0.05) {
    const x =
      Math.pow(1 - t, 3) * x0 +
      3 * Math.pow(1 - t, 2) * t * x1 +
      3 * (1 - t) * Math.pow(t, 2) * x2 +
      Math.pow(t, 3) * x3;
    xValues.push(x);

    const y =
      Math.pow(1 - t, 3) * y0 +
      3 * Math.pow(1 - t, 2) * t * y1 +
      3 * (1 - t) * Math.pow(t, 2) * y2 +
      Math.pow(t, 3) * y3;
    yValues.push(y);
  }
  xValues.push(100); // Asegurar que el último punto es 100
  yValues.push(100); // Asegurar que el último punto es 0
  return { x: xValues, y: yValues };
}

export type Coordenates = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
