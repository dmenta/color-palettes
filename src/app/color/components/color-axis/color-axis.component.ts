import { Component, computed, input, Signal } from "@angular/core";
import { FullWidthColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { AxisConfig, ColorConfig, Triple } from "../../model/colors.model";
import { RgbDisplayComponent } from "../rgb-display/rgb-display.component";
import { toContrast, toRgb } from "../color";

@Component({
  selector: "zz-color-axis",
  imports: [FullWidthColorSwatchDirective, RgbDisplayComponent],
  templateUrl: "./color-axis.component.html",
})
export class ColorAxisComponent {
  colorConfig = input<ColorConfig | undefined>(undefined, { alias: "color-config" });
  axisConfig = input<AxisConfig | undefined>(undefined, { alias: "axis-config" });
  colorBase = input<Triple<number> | undefined>(undefined, { alias: "color-base" });

  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);

  width = input<number | "full">("full");

  indices:
    | Signal<{ values: { valores: Triple<number>; color: Triple<number>; fore: string }[]; min: number; max: number }>
    | undefined = undefined;

  pasos: Signal<number | undefined> = undefined;

  ngOnInit() {
    this.pasos = computed(() => {
      const config = this.axisConfig();
      const pasosConfig = config.pasos ?? 10;
      if (config.automatico) {
        const variable = this.colorConfig().variable;
        const min = this.min();
        const max = this.max();

        return Math.min(
          pasosConfig,
          Math.max(2, Math.ceil((Math.abs(max - min) / (variable.max - variable.min)) * variable.steps))
        );
      }

      return pasosConfig;
    });

    this.indices = computed(() => {
      const model = this.colorConfig().model;
      const baseArray =
        this.colorBase() ??
        ([
          model.components[0].defaultValue,
          model.components[1].defaultValue,
          model.components[2].defaultValue,
        ] as Triple<number>);
      const pasos = this.pasos();
      const step = (this.max() - this.min()) / (pasos - 1);

      const maximo = [...baseArray];
      maximo[this.colorConfig().variableIndex] = this.colorConfig().variable.max;

      const maxRgb = toRgb(model.convert([maximo[0], maximo[1], maximo[2]]));

      const minimo = [...baseArray];
      minimo[this.colorConfig().variableIndex] = this.colorConfig().variable.min;

      const minRgb = toRgb(model.convert([minimo[0], minimo[1], minimo[2]]));

      const valores = Array.from({ length: pasos }, (_, i) => {
        const value = this.min() + i * step;
        const valores = [...baseArray];
        valores[this.colorConfig().variableIndex] = value;
        const color = model.convert([valores[0], valores[1], valores[2]]);
        const rgb = toRgb(color);
        return {
          valores: valores as Triple<number>,
          color: rgb,
          fore: toContrast(color),
        };
      });

      const minIndex = valores.findIndex(
        (v) => v.color[0] === minRgb[0] && v.color[1] === minRgb[1] && v.color[2] === minRgb[2]
      );
      const maxIndex = valores.findIndex(
        (v) => v.color[0] === maxRgb[0] && v.color[1] === maxRgb[1] && v.color[2] === maxRgb[2]
      );

      return {
        values: valores,
        min: minIndex > 0 ? minIndex : -1,
        max: maxIndex > 0 && maxIndex !== valores.length - 1 ? maxIndex : valores.length,
      };
    });
  }
}
