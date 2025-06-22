export type ColorModelName = "rgb" | "hsl" | "oklch";

type ComponentValues = {
  [key in componentKey]: number;
};

type ComponentParts = {
  [key in componentKey]: string;
};

export type componentKey = "A" | "B" | "C";

export class ColorComponent {
  readonly defaultValue: number;
  constructor(
    public name: string,
    public max: number,
    public unit: string = "",
    public precision: number = 0,
    public min: number = 0
  ) {
    this.defaultValue = Number.parseFloat(((this.max + this.min) / 2).toFixed(this.precision));
  }

  convert(value: number) {
    return `${this.clampValue(value).toFixed(this.precision)}${this.unit}`;
  }
  clampValue(value?: number): number {
    return value === undefined ? this.defaultValue : Math.max(this.min, Math.min(this.max, value));
  }
}

export class ColorModel {
  readonly templateFn = this.template;
  constructor(
    public name: ColorModelName,
    public components: Record<componentKey, ColorComponent>,
    templateFn?: (parts: ComponentParts) => string
  ) {
    this.templateFn = templateFn?.bind(this) || this.templateFn;
  }

  private template(parts: ComponentParts): string {
    return `${this.name}(${parts.A} ${parts.B} ${parts.C})`;
  }
  convert(values: ComponentValues) {
    const Apart = this.components.A.convert(values.A);
    const Bpart = this.components.B.convert(values.B);
    const Cpart = this.components.C.convert(values.C);
    return this.templateFn({ A: Apart, B: Bpart, C: Cpart });
  }
}
