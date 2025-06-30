export type ColorModelName = "rgb" | "hsl" | "oklch";

export type Triple<T> = [T, T, T];
export type Tuple<T> = [T, T];

export class ColorComponent {
  private static readonly axisSteps: number = 50;
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
    public min: number = 0
  ) {
    this.defaultValue = this.average(min, max);

    this.axisValues = this.calcAxisValues(min, max, ColorComponent.axisSteps);
    this.stepSize = (max - min) / (ColorComponent.axisSteps - 1);
  }

  private calcAxisValues(min: number, max: number, steps: number = 50): number[] {
    const stepSize = (max - min) / (steps - 1);
    return Array.from({ length: steps }, (_, i) => min + i * stepSize);
  }

  convertAverage(min: number, max: number) {
    return this.convert(this.internalAverage(min, max));
  }

  convert(value: number) {
    return `${this.clampValue(value).toFixed(this.precision)}${this.unit}`;
  }

  average(min: number, max: number) {
    return Number.parseFloat(this.internalAverage(min, max).toFixed(this.precision));
  }

  clampValue(value?: number): number {
    return value === undefined ? this.defaultValue : Math.max(this.min, Math.min(this.max, value));
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

    templateFn?: (parts: Triple<string>) => string
  ) {
    this.templateFn = templateFn?.bind(this) || this.templateFn;
  }

  private template(parts: Triple<string>): string {
    return `${this.name}(${parts[0]} ${parts[1]} ${parts[2]})`;
  }

  defaultValues() {
    return [
      this.components[0].defaultValue,
      this.components[1].defaultValue,
      this.components[2].defaultValue,
    ] as Triple<number>;
  }

  convert(values: Triple<number>) {
    return this.templateFn([
      this.components[0].convert(values[0]),
      this.components[1].convert(values[1]),
      this.components[2].convert(values[2]),
    ]);
  }
}

export type PaletteStepsConfig = {
  pasos: number;
  automatico: boolean;
};

export type PaletteVisualConfig = {
  alto: number;
  continuo: boolean;
  separate: boolean;
};

export type PaletteValuesConfig = {
  showValues: showValuesOption;
};

export type showValuesOption = "no" | "yes" | "rgb";

export type VariableConfig = {
  variable: ColorComponent;
  variableIndex: 0 | 1 | 2;
};
