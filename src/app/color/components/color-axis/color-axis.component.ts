import { ChangeDetectionStrategy, Component, computed, input, Signal } from "@angular/core";
import { ColorSwatchDirective } from "../../directives/color-swatch.directive";
import { ColorModel, Triple, VariableConfig } from "../../model/colors.model";

@Component({
  selector: "zz-color-axis",
  imports: [ColorSwatchDirective],
  templateUrl: "./color-axis.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorAxisComponent {
  colorModel = input<ColorModel | undefined>(undefined, { alias: "color-model" });
  variableConfig = input<VariableConfig | undefined>(undefined, { alias: "variable-config" });

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
      const colorModel = this.colorModel();

      if (!colorModel) {
        return [];
      }

      const variableConfig = this.variableConfig()!;

      const baseArray = this.colorBase() ?? colorModel.defaultValues();

      return variableConfig.variable.axisValues.map((value) => {
        const valores = [...baseArray];
        valores[variableConfig.variableIndex] = value;
        return valores as Triple<number>;
      });
    });
  }
}
