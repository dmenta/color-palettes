import { Component, computed, input, Signal } from "@angular/core";
import { FullWidthColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { AxisConfig, ColorConfig, Triple } from "../../model/colors.model";
import { ColorToContrastPipe, ColorToRgbPipe } from "../color-swatch/color-to-rgb.pipe";

@Component({
  selector: "zz-color-axis",
  imports: [FullWidthColorSwatchDirective, ColorToRgbPipe, ColorToContrastPipe],
  templateUrl: "./color-axis.component.html",
})
export class ColorAxisComponent {
  colorConfig = input<ColorConfig | undefined>(undefined, { alias: "color-config" });
  axisConfig = input<AxisConfig | undefined>(undefined, { alias: "axis-config" });
  colorBase = input<Triple<number> | undefined>(undefined, { alias: "color-base" });

  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);

  width = input<number | "full">("full");

  indices: Signal<{ valores: Triple<number>; color: string }[]> | undefined = undefined;

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

      return Array.from({ length: pasos }, (_, i) => {
        const value = this.min() + i * step;
        const valores = [...baseArray];
        valores[this.colorConfig().variableIndex] = value;
        return { valores: valores as Triple<number>, color: model.convert([valores[0], valores[1], valores[2]]) };
      });
    });
  }
}
