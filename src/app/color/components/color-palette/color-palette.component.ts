import { Component, signal } from "@angular/core";
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
        pasos: number;
        continuo: boolean;
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

  configChanged(config: { pasos: number; alto: number; continuo: boolean }) {
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
