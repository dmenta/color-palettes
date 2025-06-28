import { Component, computed, input, Signal } from "@angular/core";
import { FullWidthColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { AxisConfig, ColorConfig, Triple } from "../../model/colors.model";
import { ColorValuesDisplayComponent } from "../color-values-display/color-values-display.component";
import { toContrast, toRgb } from "../../model/color";

@Component({
  selector: "zz-color-axis",
  imports: [FullWidthColorSwatchDirective, ColorValuesDisplayComponent],
  templateUrl: "./color-axis.component.html",
})
export class ColorAxisComponent {
  colorConfig = input<ColorConfig | undefined>(undefined, { alias: "color-config" });
  axisConfig = input<AxisConfig | undefined>(undefined, { alias: "axis-config" });
  colorBase = input<Triple<number> | undefined>(undefined, { alias: "color-base" });

  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);

  showClamp = input<boolean>(false);

  width = input<number | "full">("full");

  swatches: Signal<Swatch[]> | undefined = undefined;

  pasos: Signal<number> | undefined = undefined;

  ngOnInit() {
    this.pasos = computed(() => {
      const colorConfig = this.colorConfig();
      if (!colorConfig) {
        return 10;
      }
      const config = this.axisConfig();

      const pasosConfig = config?.pasos ?? 10;
      if (config?.automatico ?? true) {
        const variable = colorConfig.variable;
        const min = this.min() ?? 0;
        const max = this.max() ?? 0;

        return Math.min(
          pasosConfig,
          Math.max(2, Math.ceil((Math.abs(max - min) / (variable.max - variable.min)) * variable.steps))
        );
      }

      return pasosConfig;
    });

    this.swatches = computed(() => {
      const colorConfig = this.colorConfig();

      if (!colorConfig) {
        return [];
      }

      const baseArray =
        this.colorBase() ??
        ([
          colorConfig.model.components[0].defaultValue,
          colorConfig.model.components[1].defaultValue,
          colorConfig.model.components[2].defaultValue,
        ] as Triple<number>);
      const pasos = this.pasos!();
      const max = this.max() ?? 0;
      const min = this.min() ?? 0;

      const step = (max - min) / (pasos - 1);

      const valores = Array.from({ length: pasos }, (_, i) => {
        const value = min + i * step;
        const valores = [...baseArray];
        valores[colorConfig.variableIndex] = value;
        const color = colorConfig.model.convert([valores[0]!, valores[1]!, valores[2]!]);
        const rgb = toRgb(color);
        return {
          valores: valores as Triple<number>,
          color: rgb,
          fore: toContrast(color),
        } as Swatch;
      });

      if (valores.length > 0) {
        let previo = valores[0]!.color;
        for (let i = 1; i < valores.length; i++) {
          const actual = valores[i]!.color;
          const diff0 = Math.abs(actual[0] - previo[0]);
          const diff1 = Math.abs(actual[1] - previo[1]);
          const diff2 = Math.abs(actual[2] - previo[2]);
          if (diff0 <= 7 && diff1 <= 3 && diff2 <= 14) {
            valores[i - 1]!.clamp = true;
            valores[i]!.clamp = true;
          }
          previo = actual;
        }
      }

      return valores;
    });
  }
}

export type Swatch = { valores: Triple<number>; color: Triple<number>; fore: string; clamp?: boolean };
