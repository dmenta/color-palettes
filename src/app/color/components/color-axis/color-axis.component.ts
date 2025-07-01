import { ChangeDetectionStrategy, Component, computed, input, Signal } from "@angular/core";
import { ColorSwatchDirective } from "../../directives/color-swatch.directive";
import { ColorConfig, ColorValues } from "../../model/colors.model";

@Component({
  selector: "zz-color-axis",
  imports: [ColorSwatchDirective],
  templateUrl: "./color-axis.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorAxisComponent {
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

  swatches: Signal<ColorValues[]> | undefined = undefined;

  ngOnInit() {
    this.swatches = computed(() => {
      const config = this.colorConfig();

      if (!config) {
        return [];
      }

      const baseArray = this.currentColor() ?? config.colorModel.defaultValues();

      return config.variable.axisValues.map((value) => {
        const valores = [...baseArray];
        valores[config.variableIndex] = value;
        return valores as ColorValues;
      });
    });
  }
}
