import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from "@angular/core";
import { ColorSwatchPanelDirective } from "../../directives/color-swatch.directive";
import { Triple } from "../../model/colors.model";
import { ColorValuesDisplayComponent } from "../color-values-display/color-values-display.component";
import { toContrast, toRgb } from "../../model/color";
import { ColorStateService } from "../../services/color-state.service";

@Component({
  selector: "zz-color-palette",
  imports: [ColorSwatchPanelDirective, ColorValuesDisplayComponent],
  templateUrl: "./color-palette.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPaletteComponent {
  state = inject(ColorStateService);
  showClamp = input<boolean>(false);
  swatches: Signal<Swatch[]> | undefined = undefined;

  ngOnInit() {
    this.swatches = computed(() => {
      const colorModel = this.state.colorModel();
      const variableConfig = this.state.variableConfig();
      const config = this.state.paletteStepsConfig();

      if (!colorModel || !variableConfig) {
        return [];
      }

      let pasos = config?.pasos ?? 10;
      if (config?.automatico ?? true) {
        const variable = variableConfig.variable;
        const min = this.state.minmax()[0];
        const max = this.state.minmax()[1];

        pasos = Math.min(
          pasos,
          Math.max(2, Math.ceil((Math.abs(max - min) / (variable.max - variable.min)) * variable.autoSteps))
        );
      }

      const baseArray = this.state.currentColor() ?? colorModel.defaultValues();
      const min = this.state.minmax()[0];
      const max = this.state.minmax()[1];

      const step = (max - min) / (pasos - 1);

      const valores = Array.from({ length: pasos }, (_, i) => {
        const value = min + i * step;
        const valores = [...baseArray];
        valores[variableConfig.variableIndex] = value;
        const color = colorModel.convert([valores[0]!, valores[1]!, valores[2]!]);
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
