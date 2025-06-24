export type ColorModelName = "rgb" | "hsl" | "oklch";

export type Triple<T> = [T, T, T];
export type Tuple<T> = [T, T];

export class ColorComponent {
  readonly defaultValue: number;

  constructor(
    public name: string,
    public max: number,
    public unit: string = "",
    public precision: number = 0,
    public min: number = 0
  ) {
    this.defaultValue = this.average(min, max);
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
