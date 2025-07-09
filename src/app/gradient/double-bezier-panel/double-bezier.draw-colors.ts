export function doubleBezierHandleColors(darkMode: boolean): DoubleHandlerColors {
  return {
    h1: !darkMode ? "oklch(0.355 0.146 29)" : "oklch(0.634 0.254 18)",
    h2: !darkMode ? "oklch(0.377 0.1 247)" : "oklch(0.858 0.146 197)",
    h3: !darkMode ? "oklch(0.355 0.146 29)" : "oklch(0.634 0.254 18)",
    h4: !darkMode ? "oklch(0.377 0.1 247)" : "oklch(0.858 0.146 197)",
    line: !darkMode ? "#305030" : "#E0FFE0",
    activeline: !darkMode ? "#008000" : "#80FF80",
    shadow: !darkMode ? "#202020" : "#202020",
  };
}

export function doubleBezierCurveColor(darkMode: boolean): string {
  return !darkMode ? "#303030" : "#D0D0D0";
}

export function doubleBezierGridColors(darkMode: boolean): DoubleBezierGridColors {
  return {
    lines: !darkMode ? "#606060" : "#C0C0C0",
    border: !darkMode ? "#101010" : "#F0F0F0",
  };
}

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
