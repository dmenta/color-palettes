const doubleBezierHandlerColors: { light: DoubleHandlerColors; dark: DoubleHandlerColors } = {
  light: {
    h1: "oklch(0.355 0.146 29)",
    h2: "oklch(0.377 0.1 247)",
    h3: "oklch(0.355 0.146 29)",
    h4: "oklch(0.377 0.1 247)",
    line: "#305030",
    activeline: "#008000",
    shadow: "#202020",
  } as DoubleHandlerColors,
  dark: {
    h1: "oklch(0.634 0.254 18)",
    h2: "oklch(0.858 0.146 197)",
    h3: "oklch(0.634 0.254 18)",
    h4: "oklch(0.858 0.146 197)",
    line: "#E0FFE0",
    activeline: "#80FF80",
    shadow: "#202020",
  } as DoubleHandlerColors,
};

const doubleBezierCurveColor: { light: string; dark: string } = {
  light: "#303030",
  dark: "#D0D0D0",
};

const doubleBezierGridColors: { light: DoubleBezierGridColors; dark: DoubleBezierGridColors } = {
  light: {
    lines: "#606060",
    border: "#101010",
  } as DoubleBezierGridColors,
  dark: {
    lines: "#C0C0C0",
    border: "#F0F0F0",
  } as DoubleBezierGridColors,
};

export const doubleBezierColorConfig = {
  handlerColors: doubleBezierHandlerColors,
  curveColor: doubleBezierCurveColor,
  gridColors: doubleBezierGridColors,
};

export type DoubleBezierColorConfig = {
  handlerColors: typeof doubleBezierHandlerColors;
  curveColor: typeof doubleBezierCurveColor;
  gridColors: typeof doubleBezierGridColors;
};
export type DoubleHandlerColors = {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  line: string;
  activeline: string;
  shadow: string;
};

export type DoubleBezierGridColors = {
  lines: string;
  border: string;
};
