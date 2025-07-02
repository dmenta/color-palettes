const FLOAT_EPSILON = 0.001;
export type ColorModelName = "rgb" | "hsl" | "oklch" | "hex";

type Triple<T> = [T, T, T];
type Tuple<T> = [T, T];

export type ColorValues = Triple<number>;
export type ColorParts = Triple<string>;

export type MinMax = Tuple<number>;

export class ColorComponent {
  readonly templateFn = this.template;
  readonly defaultValue: number;
  readonly stepSize: number;
  readonly axisValues: number[];

  constructor(
    public name: string,
    public label: string,
    public max: number,
    public unit: string = "",
    public precision: number = 0,
    public autoSteps: number = 100,
    public min: number = 0,
    public axisSteps: number = 3,
    templateFn?: (value: number) => string
  ) {
    this.templateFn = templateFn?.bind(this) || this.templateFn;

    this.defaultValue = this.average(min, max);

    this.axisValues = this.calcAxisValues(min, max, this.axisSteps);
    this.stepSize = (max - min) / (this.axisSteps - 1);
  }

  private calcAxisValues(min: number, max: number, steps: number = 50): number[] {
    const stepSize = (max - min) / (steps - 1);
    return Array.from({ length: steps }, (_, i) => min + i * stepSize);
  }

  convertAverage(min: number, max: number) {
    return this.convert(this.internalAverage(min, max));
  }

  convert(value: number) {
    return this.templateFn(this.clampValue(value));
  }

  template(value: number): string {
    return `${value.toFixed(this.precision)}${this.unit}`;
  }
  average(min: number, max: number) {
    return Number.parseFloat(this.internalAverage(min, max).toFixed(this.precision));
  }

  clampValue(value?: number): number {
    return value === undefined ? this.defaultValue : Math.max(this.min, Math.min(this.max, value));
  }

  minMax(value: number) {
    const middle = (this.max + this.min) / 2;
    const max = value > middle ? this.max : value * 2 - this.min;
    const min = value < middle ? this.min : value * 2 - this.max;

    return [min, max] as MinMax;
  }

  private internalAverage(min: number, max: number): number {
    return (Math.max(this.min, min) + Math.min(this.max, max)) / 2;
  }
}

export class ColorModel {
  readonly templateFn = this.template;

  constructor(
    public name: ColorModelName,
    public components: Triple<ColorComponent>,
    public defaultVariableIndex: 0 | 1 | 2 = 0,

    templateFn?: (parts: ColorParts) => string
  ) {
    this.templateFn = templateFn?.bind(this) || this.templateFn;
  }

  private template(parts: ColorParts): string {
    return `${this.name}(${parts[0]} ${parts[1]} ${parts[2]})`;
  }

  defaultValues() {
    return [
      this.components[0].defaultValue,
      this.components[1].defaultValue,
      this.components[2].defaultValue,
    ] as ColorValues;
  }

  convert(values: ColorValues) {
    return this.templateFn([
      this.components[0].convert(values[0]),
      this.components[1].convert(values[1]),
      this.components[2].convert(values[2]),
    ]);
  }
}

export type VariableConfig = {
  variable: ColorComponent;
  variableIndex: 0 | 1 | 2;
};

export type ColorConfig = {
  colorModel: ColorModel;
} & VariableConfig & {
    color: ColorValues;
    minmax: MinMax;
  };

export type ColorConfigState = {
  colorModelName: ColorModelName;
} & VariableConfig & {
    color: ColorValues;
    minmax: MinMax;
  };

export function colorConfigStateEquals(current: ColorConfigState, next: ColorConfigState) {
  if (current.colorModelName !== next.colorModelName) {
    return false;
  }

  if (current.variable.name !== next.variable.name) {
    return false;
  }

  if (!colorValuesEquals(current.color, next.color)) {
    return false;
  }

  if (
    Math.abs(current.minmax[0] - next.minmax[0]) >= FLOAT_EPSILON ||
    Math.abs(current.minmax[1] - next.minmax[1]) >= FLOAT_EPSILON
  ) {
    return false;
  }

  return true;
}

export function colorValuesEquals(current: ColorValues, next: ColorValues) {
  return (
    Math.abs(current[0] - next[0]) < FLOAT_EPSILON &&
    Math.abs(current[1] - next[1]) < FLOAT_EPSILON &&
    Math.abs(current[2] - next[2]) < FLOAT_EPSILON
  );
}
