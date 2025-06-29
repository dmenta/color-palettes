import { ChangeDetectionStrategy, Component, computed, input, Signal } from "@angular/core";
import { ColorSwatchDirective } from "../../directives/color-swatch.directive";
import { ColorConfig, Triple } from "../../model/colors.model";

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
  colorBase = input<Triple<number> | undefined>(undefined, { alias: "color-base" });

  swatches: Signal<Triple<number>[]> | undefined = undefined;

  ngOnInit() {
    this.swatches = computed(() => {
      const colorConfig = this.colorConfig();

      if (!colorConfig) {
        return [];
      }

      const variable = colorConfig.variable;

      const baseArray = this.colorBase() ?? colorConfig.model.defaultValues();

      return variable.axisValues.map((value) => {
        const valores = [...baseArray];
        valores[colorConfig.variableIndex] = value;
        return valores as Triple<number>;
      });
    });
  }
}
