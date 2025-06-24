import { Component, computed, Signal, signal } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ColorComponent, ColorModel, Triple, Tuple } from "../../model/colors.model";
import { ColorSampleComponent } from "../color-sample/color-sample.component";
import { ColorAxisConfigComponent } from "../color-axis-config/color-axis-config.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { ColorRangeSelectorComponent } from "../color-range-selector/color-range-selector.component";
import { ColorConfigComponent } from "../color-config/color-config.component";

@Component({
  selector: "zz-color-palette",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ColorAxisComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    ColorAxisConfigComponent,
    ColorConfigComponent,
  ],
  templateUrl: "./color-palette.component.html",
})
export class ColorPaletteComponent {
  config = signal<
    | {
        alto: number;
        continuo: boolean;
        pasos: number;
        automatico: boolean;
      }
    | undefined
  >(undefined);

  colorConfig = signal<
    | {
        model: ColorModel;
        variable: ColorComponent;
        variableIndex: 0 | 1 | 2;
      }
    | undefined
  >(undefined);

  minmax = signal<Tuple<number>>([0, 0]);
  currentColor = signal<Triple<number>>([0, 0, 0]);
  pasos: Signal<number | undefined> = undefined;

  ngOnInit() {
    this.pasos = computed(() => {
      const config = this.config();
      if (config.automatico) {
        const variable = this.colorConfig()?.variable;
        const minmax = this.minmax();
        const pasosMax = config?.pasos ?? 10;

        return Math.min(
          pasosMax,
          Math.max(2, Math.ceil((Math.abs(minmax[1] - minmax[0]) / (variable.max - variable.min)) * variable.steps))
        );
      }
      return config?.pasos ?? 10;
    });
  }
  configChanged(config: { alto: number; continuo: boolean; pasos: number; automatico: boolean }) {
    this.config.set(config);
  }
  colorConfigChanged(config: { model: ColorModel; variable: ColorComponent; variableIndex: 0 | 1 | 2 }) {
    this.colorConfig.set(config);
    this.minmax.set(config.variable ? [config.variable.min, config.variable.max] : ([0, 0] as Tuple<number>));
    this.currentColor.set(config.model?.defaultValues() ?? ([0, 0, 0] as Triple<number>));
  }
  colorChange(valores: Triple<number>) {
    this.currentColor.set(valores);
  }

  rangeChange(minmax: Tuple<number>) {
    this.minmax.set(minmax);
  }
}
