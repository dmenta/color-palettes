import { formatNumber } from "@angular/common";

const FLOAT_EPSILON = 0.001;
export type ColorModelName = "rgb" | "hsl" | "oklch" | "hex";
export type ColorValues = { 0: number; 1: number; 2: number };
export type ColorValueKey = keyof ColorValues;
export type ColorComponents = [ColorComponent, ColorComponent, ColorComponent];
export type ColorParts = [string, string, string];
export type Range = { min: number; max: number };

export class ColorComponent {
  readonly templateFn = this.template;
  readonly defaultValue: number;
  readonly axisValues: number[];

  private readonly precision: number = 0;

  constructor(
    public name: { caption: string; label: string },
    public range: Range,
    public valueStep: number = 1,
    public unit: string = "",
    public autoSteps: number = 100,

    axisSteps: number = 2,

    templateFn?: (value: number) => string
  ) {
    this.templateFn = templateFn?.bind(this) || this.templateFn;

    if (valueStep < 1) {
      this.precision = Math.ceil(Math.log10(1 / valueStep));
    }
    this.defaultValue = this.average(range);

    this.axisValues = this.calcAxisValues(range, axisSteps);
  }

  convert(value: number) {
    return this.templateFn(this.clampValue(value));
  }

  bestRange(value: number) {
    const middle = rangeCenter(this.range);
    const max = value > middle ? this.range.max : value * 2 - this.range.min;
    const min = value < middle ? this.range.min : value * 2 - this.range.max;

    return { min, max } as Range;
  }

  private calcAxisValues(range: Range, steps: number): number[] {
    // compensate for the valueStep to smooth gradient
    const stepSize = (rangeTotal(range) - 2 * this.valueStep) / (steps - 1);

    return Array.from({ length: steps }, (_, i) => this.valueStep + range.min + i * stepSize);
  }

  private template(value: number): string {
    return `${formatNumber(value, "en-US", `1.0-${this.precision}`)}${this.unit}`;
  }

  private average(range: Range) {
    const center = rangeCenter(range);
    return Number.parseFloat(center.toFixed(this.precision));
  }

  private clampValue(value?: number): number {
    return value === undefined ? this.defaultValue : Math.max(this.range.min, Math.min(this.range.max, value));
  }
}

export class ColorModel {
  readonly templateFn = this.template;

  constructor(
    public name: ColorModelName,
    public components: ColorComponents,
    public defaultVariableIndex: ColorValueKey = 0,

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

  displayValues(values: ColorValues) {
    return this.components.map((component, index) => {
      return {
        label: component.name.label,
        value: component.convert(values[index as ColorValueKey]!),
      };
    });
  }
}

export function rangeTotal(range: Range): number {
  return range.max - range.min;
}

export function rangeCenter(range: Range): number {
  return (range.max + range.min) / 2;
}

export type VariableConfig = {
  variable: ColorComponent;
  variableIndex: ColorValueKey;
};

export type ColorConfig = {
  colorModel: ColorModel;
} & VariableConfig & {
    color: ColorValues;
    range: Range;
  };

export type ColorConfigState = {
  colorModelName: ColorModelName;
} & VariableConfig & {
    color: ColorValues;
    range: Range;
  };

export function colorConfigStateEquals(current: ColorConfigState, next: ColorConfigState) {
  if (current.colorModelName !== next.colorModelName) {
    return false;
  }

  if (current.variable.name.caption !== next.variable.name.caption) {
    return false;
  }

  if (current.variable.name.label !== next.variable.name.label) {
    return false;
  }

  if (!colorValuesEquals(current.color, next.color)) {
    return false;
  }

  if (
    Math.abs(current.range.min - next.range.min) >= FLOAT_EPSILON ||
    Math.abs(current.range.max - next.range.max) >= FLOAT_EPSILON
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
