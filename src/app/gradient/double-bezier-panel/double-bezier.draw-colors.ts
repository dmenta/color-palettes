import { DoubleHandler } from "../models/double-handlers.model";

const doubleBezierHandlerColors: { light: DoubleHandlersColors; dark: DoubleHandlersColors } = {
  light: {
    h1: { main: "oklch(0.355 0.146 29)" },
    h2: { main: "oklch(0.377 0.1 247)" },
    h3: { main: "oklch(0.355 0.146 29)" },
    h4: { main: "oklch(0.377 0.1 247)" },
    common: { line: "#305030", activeline: "#008000", shadow: "#202020" },
  } as DoubleHandlersColors,
  dark: {
    h1: { main: "oklch(0.634 0.254 18)" },
    h2: { main: "oklch(0.858 0.146 197)" },
    h3: { main: "oklch(0.634 0.254 18)" },
    h4: { main: "oklch(0.858 0.146 197)" },
    common: { line: "#E0FFE0", activeline: "#80FF80", shadow: "#202020" },
  } as DoubleHandlersColors,
};

const doubleBezierCurveColor: { light: string; dark: string } = {
  light: "#303030",
  dark: "#D0D0D0",
};

const doubleBezierCenterColors: { light: DoubleBezierCenterColors; dark: DoubleBezierCenterColors } = {
  light: {
    main: "#606060",
    active: "#202020",
    activeBorder: "#FF5000",
    shadow: "#404040",
  } as DoubleBezierCenterColors,
  dark: {
    main: "#A0A0A0",
    active: "#b0b0b0",
    activeBorder: "#C0CC00",
    shadow: "#202020",
  } as DoubleBezierCenterColors,
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

const doubleBezierColorConfig = {
  handlerColors: doubleBezierHandlerColors,
  curveColor: doubleBezierCurveColor,
  gridColors: doubleBezierGridColors,
  centerColors: doubleBezierCenterColors,
};

type DoubleBezierColorConfig = {
  handlerColors: typeof doubleBezierHandlerColors;
  curveColor: typeof doubleBezierCurveColor;
  gridColors: typeof doubleBezierGridColors;
  centerColors: typeof doubleBezierCenterColors;
};

type DoubleHandlersColors = {
  h1: { main: string };
  h2: { main: string };
  h3: { main: string };
  h4: { main: string };
  common: { line: string; activeline: string; shadow: string };
};

export type DoubleHandlerColors = {
  main: string;
  common: { line: string; activeline: string; shadow: string };
};

type DoubleBezierGridColors = {
  lines: string;
  border: string;
};

export type DoubleBezierCenterColors = {
  main: string;
  active: string;
  activeBorder: string;
  shadow: string;
};

export class DoubleBezierColors {
  private colors: DoubleBezierColorConfig = doubleBezierColorConfig;

  public handler(handler: DoubleHandler, darkMode: boolean): DoubleHandlerColors {
    const handlerColors = darkMode ? this.colors.handlerColors.dark : this.colors.handlerColors.light;
    return {
      main: handlerColors[handler].main,
      common: handlerColors.common,
    };
  }

  public curve(darkMode: boolean): string {
    return darkMode ? this.colors.curveColor.dark : this.colors.curveColor.light;
  }

  public grid(darkMode: boolean): DoubleBezierGridColors {
    return darkMode ? this.colors.gridColors.dark : this.colors.gridColors.light;
  }

  public center(darkMode: boolean): DoubleBezierCenterColors {
    return darkMode ? this.colors.centerColors.dark : this.colors.centerColors.light;
  }
}
