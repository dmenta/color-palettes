import { computed, Directive, input, Signal } from "@angular/core";
import { ColorConfig, ColorModelName, ColorValues } from "../model/colors.model";

@Directive({
  selector: "[zz-color-axis]",
  host: {
    "[style.height.px]": "height()",
    "[style.background]": "gradient!()",
  },
})
export class AxisGradientDirective {
  colorConfig = input<ColorConfig | undefined>(undefined, { alias: "color-config" });

  height = input(30, {
    transform: (value?: number) => {
      if (value === undefined) {
        return 30;
      }
      const valor = Number.isInteger(value) ? value : 30;

      return Math.max(1, Math.min(400, valor));
    },
  });
  currentColor = input<ColorValues | undefined>(undefined, { alias: "current-color" });

  gradient: Signal<string> | undefined = undefined;

  colorSpaces: Record<ColorModelName, string> = {
    oklch: "oklch",
    rgb: "srgb",
    hsl: "hsl",
    hex: "srgb",
  };

  ngOnInit() {
    this.gradient = computed(() => {
      const config = this.colorConfig();

      if (!config) {
        return "";
      }

      const colorModel = config.colorModel!;
      const baseArray = this.currentColor() ?? colorModel.defaultValues();

      const ratio = 100 / (config.variable.axisValues.length - 1);

      const puntos = config.variable.axisValues.map((value, i) => {
        const valores = { ...baseArray };
        valores[config.variableIndex] = value;
        return `${colorModel.convert(valores as ColorValues)} ${(i * ratio).toFixed(2)}%`;
      });

      return `linear-gradient(to right in ${this.colorSpaces[colorModel.name]}, ${puntos})`;
    });
  }
}
