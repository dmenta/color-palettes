import { Handler } from "../models/handlers.model";

const bezierHandleColors: { light: HandlersColors; dark: HandlersColors } = {
  light: {
    h1: "oklch(0.355 0.146 29)",
    h2: "oklch(0.377 0.1 247)",
    common: { line: "#305030", activeline: "#008000", shadow: "#202020" },
  },
  dark: {
    h1: "oklch(0.634 0.254 18)",
    h2: "oklch(0.858 0.146 197)",
    common: { line: "#d0d0d0", activeline: "#80FF80", shadow: "#000000" },
  },
};

const bezierCurveColor: { light: string; dark: string } = {
  light: "#303030",
  dark: "#D0D0D0",
};

const bezierGridColors: { light: BezierGridColors; dark: BezierGridColors } = {
  light: {
    lines: "#606060",
    border: "#101010",
  },
  dark: {
    lines: "#C0C0C0",
    border: "#F0F0F0",
  },
};

type HandlersColors = {
  h1: string;
  h2: string;
  common: {
    line: string;
    activeline: string;
    shadow: string;
  };
};

type HandlerColors = {
  main: string;
  common: {
    line: string;
    activeline: string;
    shadow: string;
  };
};

type BezierGridColors = {
  lines: string;
  border: string;
};

const simpleBezierColorConfig: SimpleBezierColorConfig = {
  handlerColors: bezierHandleColors,
  curveColor: bezierCurveColor,
  gridColors: bezierGridColors,
};

export type SimpleBezierColorConfig = {
  handlerColors: { light: HandlersColors; dark: HandlersColors };
  curveColor: { light: string; dark: string };
  gridColors: { light: BezierGridColors; dark: BezierGridColors };
};

export class SimpleBezierColors {
  private colors: SimpleBezierColorConfig = simpleBezierColorConfig;

  public handler(handler: Handler, darkMode: boolean): HandlerColors {
    const handlerColors = darkMode ? this.colors.handlerColors.dark : this.colors.handlerColors.light;
    return {
      main: handlerColors[handler],
      common: handlerColors.common,
    };
  }

  public curve(darkMode: boolean): string {
    return darkMode ? this.colors.curveColor.dark : this.colors.curveColor.light;
  }

  public grid(darkMode: boolean): BezierGridColors {
    return darkMode ? this.colors.gridColors.dark : this.colors.gridColors.light;
  }
}
